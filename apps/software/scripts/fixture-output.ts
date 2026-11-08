/* eslint-disable security/detect-non-literal-fs-filename -- Paths stay below the fixture build roots of check-fixtures. */
/* eslint-disable no-await-in-loop -- Build files are read in a stable order. */
/* eslint-disable unicorn/consistent-function-scoping, max-nested-callbacks -- The feed parser runs in the browser as one serialized callback, so its helpers stay inside it. */
import type { Page } from "playwright"

import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

/** File types whose text the marker search reads; images and fonts are skipped. */
const TEXT_FILE = /\.(?:css|html|js|json|svg|txt|webmanifest|xml)$/v
const LINK_ELEMENT = /<link\b[^>]*>/gv
const ANCHOR_ELEMENT = /<a\b[^>]*>/gv
const SITE_HEADER = /<header\b[\s\S]*?<\/header>/v
const MAIN = /<main\b[\s\S]*?<\/main>/v
const LOCATION = /<loc>(?<url>[^<]+)<\/loc>/gv
const ATTRIBUTE = /\s(?<name>[\w:\-]+)="(?<value>[^"]*)"/gv

/** One entry of an RSS or Atom feed, as a strict XML parser reads it. */
export type FeedEntry = {
  readonly authors: readonly string[]
  readonly categories: readonly string[]
  readonly content: string
  readonly id: string
  readonly link: string
}

/** A feed parsed strictly: its language and entries, or the parser's error. */
export type Feed = {
  readonly entries: readonly FeedEntry[]
  readonly error?: string
  readonly language: string
  readonly root: string
}

/**
 * Reads every text file of a client build, keyed by its path below the client.
 * @param client - The client directory of one variant build.
 * @returns The files' text by relative path with forward slashes.
 */
export async function textFiles(client: string): Promise<ReadonlyMap<string, string>> {
  const files = new Map<string, string>()
  const visit = async (directory: string, prefix: string): Promise<void> => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const relative = `${prefix}${entry.name}`
      if (entry.isDirectory()) await visit(path.join(directory, entry.name), `${relative}/`)
      else if (TEXT_FILE.test(entry.name)) {
        files.set(relative, await readFile(path.join(directory, entry.name), "utf8"))
      }
    }
  }
  await visit(client, "")
  return files
}

/**
 * The built document of a route.
 * @param files - The client's text files.
 * @param route - The route path, such as `/blog/pair`.
 * @returns The HTML, or undefined when the build has no such page.
 */
export function documentAt(files: ReadonlyMap<string, string>, route: string): string | undefined {
  return files.get(route === "/" ? "index.html" : `${route.slice(1)}/index.html`)
}

function attribute(element: string, name: string): string | undefined {
  const match = [...element.matchAll(ATTRIBUTE)].find((entry) => entry.groups?.name === name)
  return match?.groups?.value.replaceAll("&amp;", "&")
}

/**
 * The hreflang alternates in a document's head, as `<language> <href>`.
 * @param html - A built document.
 * @returns The alternates in document order.
 */
export function alternates(html: string): readonly string[] {
  return [...html.matchAll(LINK_ELEMENT)]
    .map((match) => match[0])
    .filter((element) => attribute(element, "rel") === "alternate")
    .flatMap((element) => {
      const language = attribute(element, "hrefLang")
      return language === undefined ? [] : [`${language} ${attribute(element, "href") ?? ""}`]
    })
}

/**
 * The canonical URL of a document.
 * @param html - A built document.
 * @returns The canonical link target.
 */
export function canonical(html: string): string {
  const links = [...html.matchAll(LINK_ELEMENT)]
    .map((match) => match[0])
    .filter((element) => attribute(element, "rel") === "canonical")
  assert.equal(links.length, 1, "a document needs exactly one canonical link")
  return attribute(links[0] ?? "", "href") ?? ""
}

/**
 * The language switch target for one language in the site header.
 * @param html - A built document.
 * @param locale - The language the link leads to.
 * @returns The link target.
 */
export function languageLink(html: string, locale: string): string {
  // Posts and the empty state also link the other language inside <main>.
  const header = SITE_HEADER.exec(html)?.[0] ?? ""
  const links = [...header.matchAll(ANCHOR_ELEMENT)]
    .map((match) => match[0])
    .filter((element) => attribute(element, "hrefLang") === locale)
  assert.equal(links.length, 1, `the header needs one ${locale} language link`)
  return attribute(links[0] ?? "", "href") ?? ""
}

/**
 * The language links inside a document's `<main>`, as `<language> <href>`:
 * the empty state's way to the other blog and a post's translation.
 * @param html - A built document.
 * @returns The links in document order.
 */
export function mainLanguageLinks(html: string): readonly string[] {
  const main = MAIN.exec(html)?.[0] ?? ""
  return [...main.matchAll(ANCHOR_ELEMENT)]
    .map((match) => match[0])
    .flatMap((element) => {
      const language = attribute(element, "hrefLang")
      return language === undefined ? [] : [`${language} ${attribute(element, "href") ?? ""}`]
    })
}

/**
 * The route paths a sitemap lists.
 * @param xml - A sitemap.
 * @returns The paths of its URLs.
 */
export function sitemapPaths(xml: string): readonly string[] {
  return [...xml.matchAll(LOCATION)].map((match) => new URL(match.groups?.url ?? "").pathname)
}

/**
 * Parses an RSS 2.0 or Atom feed with the browser's strict XML parser, which
 * rejects any document that is not well-formed.
 * @param page - A browser page used only for parsing.
 * @param xml - The feed document.
 * @returns The feed's language and entries, or the parser error.
 */
export async function parseFeed(page: Page, xml: string): Promise<Feed> {
  return page.evaluate((source) => {
    const ATOM = "http://www.w3.org/2005/Atom"
    const CONTENT = "http://purl.org/rss/1.0/modules/content/"
    const DUBLIN_CORE = "http://purl.org/dc/elements/1.1/"
    const document = new DOMParser().parseFromString(source, "application/xml")
    const failure = document.getElementsByTagName("parsererror").item(0)
    const root = document.documentElement
    if (failure !== null) {
      return { entries: [], error: failure.textContent, language: "", root: root.localName }
    }
    const texts = (parent: Element, namespace: null | string, name: string): string[] =>
      [...parent.getElementsByTagNameNS(namespace ?? "", name)].map(
        (element) => element.textContent
      )
    if (root.localName === "rss") {
      const channel = root.getElementsByTagName("channel").item(0)
      return {
        entries: [...root.getElementsByTagName("item")].map((item) => ({
          authors: texts(item, DUBLIN_CORE, "creator"),
          categories: texts(item, null, "category"),
          content: texts(item, CONTENT, "encoded").join(""),
          id: texts(item, null, "guid").join(""),
          link: texts(item, null, "link").join(""),
        })),
        language: channel === null ? "" : texts(channel, null, "language").join(""),
        root: `rss ${root.getAttribute("version") ?? ""}`,
      }
    }
    return {
      entries: [...root.getElementsByTagNameNS(ATOM, "entry")].map((entry) => ({
        authors: [...entry.getElementsByTagNameNS(ATOM, "author")].flatMap((author) =>
          texts(author, ATOM, "name")
        ),
        categories: [...entry.getElementsByTagNameNS(ATOM, "category")].map(
          (category) => category.getAttribute("term") ?? ""
        ),
        content: texts(entry, ATOM, "content").join(""),
        id: texts(entry, ATOM, "id").join(""),
        link: entry.getElementsByTagNameNS(ATOM, "link").item(0)?.getAttribute("href") ?? "",
      })),
      language: root.getAttributeNS("http://www.w3.org/XML/1998/namespace", "lang") ?? "",
      root: root.namespaceURI === ATOM ? `atom ${root.localName}` : root.localName,
    }
  }, xml)
}
