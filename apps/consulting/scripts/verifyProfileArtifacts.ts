import { LOCALES } from "@sebastian-websites/web-core"
import { glob, readFile, stat } from "node:fs/promises"
import { basename, resolve } from "node:path"
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs"

import { PROFILE_DOCUMENTS, type ProfileDocumentKind } from "../app/lib/untranslated"

const PROJECT_PROFILE_PAGE_COUNT = 5
const A4_WIDTH_POINTS = 595.28
const A4_HEIGHT_POINTS = 841.89
const PAGE_SIZE_TOLERANCE_POINTS = 1
const MINIMUM_PROJECT_PROFILE_TOP_INSET_POINTS = 40

type ExpectedProfilePdf = {
  readonly consultantId: string
  readonly downloadName: string
  readonly filename: string
  readonly href: string
  readonly kind: ProfileDocumentKind
  readonly locale: string
  readonly route: `/${string}`
}

type PdfDocument = Awaited<ReturnType<typeof getDocument>["promise"]>

type ProjectProfilePdfContent = {
  readonly links: readonly string[]
  readonly text: string
}

type PdfTextItem = {
  readonly str: string
  readonly transform: readonly number[]
}

const REQUIRED_PROJECT_PROFILE_TEXT = {
  de: [
    "Sofort verfügbar",
    "Ausgewählte Projektnachweise · Fintech & E-Commerce",
    "Ausgewählte Projektnachweise · Enterprise-SaaS & Internationalisierung",
    "Banking und Asset Management",
    "E-Commerce",
    "Enterprise-SaaS",
  ],
  en: [
    "Available immediately",
    "Selected Project Experience · Fintech & E-Commerce",
    "Selected Project Experience · Enterprise SaaS & Internationalization",
    "banking and asset management",
    "e-commerce",
    "enterprise SaaS",
  ],
} as const

function expectedConsultantProfileUrl(locale: string): string {
  return locale === "de"
    ? "https://sebastian-consulting.de/fastner"
    : "https://sebastian-consulting.com/fastner"
}

function expectedProfilePdfs(locales: readonly string[]): ExpectedProfilePdf[] {
  return PROFILE_DOCUMENTS.flatMap((document) =>
    locales.map((locale) => {
      if (locale !== "de" && locale !== "en") {
        throw new Error(`Unknown profile locale ${JSON.stringify(locale)}.`)
      }
      const descriptor = document.pdfs[locale]
      return {
        consultantId: document.consultantId,
        downloadName: descriptor.downloadName,
        filename: basename(descriptor.href),
        href: descriptor.href,
        kind: document.kind,
        locale,
        route: document.route,
      }
    })
  )
}

/**
 * Rejects a name set in which two published PDFs would derive the same file
 * name. The compatibility build merges both languages into one flat pdfs/
 * directory and copies with `force: true`, so a collision silently leaves one
 * file where two are expected. The exact-set assertion below catches that case
 * too — its expectation would carry the name twice while the directory can only
 * return it once — but it reports `expected [x, x, …]`. This check runs first
 * purely so the failure names the colliding files.
 *
 * @param filenames - Every PDF file name the build is expected to publish.
 */
export function assertDistinctFilenames(filenames: readonly string[]): void {
  const distinct = new Set(filenames)
  if (distinct.size !== filenames.length) {
    throw new Error(
      `Derived PDF names are not distinct: ${JSON.stringify([...filenames].sort())} yields ${distinct.size} distinct names, expected ${filenames.length}.`
    )
  }
}

export function assertProfilePdfNamesDistinct(locales: readonly string[]): void {
  const profileFilenames = expectedProfilePdfs(locales).map((pdf) => pdf.filename)
  assertDistinctFilenames(profileFilenames)
}

async function publishedPdfFilenames(pdfDirectory: string): Promise<string[]> {
  const found: string[] = []
  for await (const path of glob(`${pdfDirectory}/*`)) {
    found.push(basename(path))
  }
  return found.sort()
}

// glob over a missing base yields zero entries instead of throwing, so without
// this stat a build that never produced pdfs/ would be reported as a directory
// holding the wrong files rather than as a directory that does not exist.
async function assertPdfDirectory(path: string): Promise<void> {
  const directoryStats = await stat(path).catch(() => null)
  if (directoryStats?.isDirectory() !== true) {
    throw new Error(`Expected PDF output directory: ${path}`)
  }
}

async function assertNonEmptyFile(path: string): Promise<void> {
  const fileStats = await stat(path).catch(() => null)
  if (fileStats?.isFile() !== true) {
    throw new Error(`Expected profile PDF file: ${path}`)
  }
  if (fileStats.size === 0) {
    throw new Error(`Profile PDF ${path} is empty.`)
  }
}

function assertNear(actual: number, expected: number, description: string): void {
  if (Math.abs(actual - expected) > PAGE_SIZE_TOLERANCE_POINTS) {
    throw new Error(`${description} is ${actual.toFixed(2)}pt, expected ${expected.toFixed(2)}pt.`)
  }
}

function normalizeLink(value: string): string {
  return new URL(value).href
}

function isPdfTextItem(item: unknown): item is PdfTextItem {
  if (typeof item !== "object" || item === null) return false
  const candidate = item as { str?: unknown; transform?: unknown }
  return (
    typeof candidate.str === "string" &&
    Array.isArray(candidate.transform) &&
    candidate.transform.every((value: unknown) => typeof value === "number")
  )
}

function inspectProjectProfilePageText(
  items: readonly unknown[],
  inspection: { readonly pageNumber: number; readonly pageTop: number; readonly path: string }
): string {
  const textItems: PdfTextItem[] = []
  let highestTextBaseline = Number.NEGATIVE_INFINITY
  for (const item of items) {
    if (!isPdfTextItem(item)) continue
    textItems.push(item)
    highestTextBaseline = Math.max(highestTextBaseline, item.transform[5] ?? 0)
  }
  const topInset = inspection.pageTop - highestTextBaseline
  if (topInset < MINIMUM_PROJECT_PROFILE_TOP_INSET_POINTS) {
    throw new Error(
      `${inspection.path} page ${String(inspection.pageNumber)} starts ${topInset.toFixed(2)}pt below the page edge; project-profile content is clipped into the top margin.`
    )
  }
  return textItems.map((item) => item.str).join(" ")
}

async function readProjectProfilePdfContent(
  document: PdfDocument,
  path: string
): Promise<ProjectProfilePdfContent> {
  const textParts: string[] = []
  const links: string[] = []
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    // eslint-disable-next-line no-await-in-loop -- PDF pages are inspected in order
    const page = await document.getPage(pageNumber)
    const [left, bottom, right, top] = page.view
    assertNear(Math.abs(right - left), A4_WIDTH_POINTS, `${path} page ${String(pageNumber)} width`)
    assertNear(
      Math.abs(top - bottom),
      A4_HEIGHT_POINTS,
      `${path} page ${String(pageNumber)} height`
    )
    // eslint-disable-next-line no-await-in-loop -- one loaded page keeps memory bounded
    const [textContent, annotations] = await Promise.all([
      page.getTextContent(),
      page.getAnnotations(),
    ])
    textParts.push(
      inspectProjectProfilePageText(textContent.items, { pageNumber, pageTop: top, path })
    )
    links.push(
      ...annotations.flatMap((annotation: unknown) => {
        if (typeof annotation !== "object" || annotation === null) return []
        const candidate = annotation as { subtype?: unknown; url?: unknown }
        return candidate.subtype === "Link" && typeof candidate.url === "string"
          ? [normalizeLink(candidate.url)]
          : []
      })
    )
  }
  return { links, text: textParts.join(" ").replaceAll(/\s+/gv, " ") }
}

function assertProjectProfilePdfContent(
  { links, text }: ProjectProfilePdfContent,
  path: string,
  locale: string
): void {
  const requiredText = [
    "Sebastian Fastner",
    "Senior React & TypeScript Developer · Frontend Architect",
    "Sebastian Software GmbH",
    "DWS",
    "Witt",
    "Regrello",
    "Terminaro",
    "Palamedes",
    ...REQUIRED_PROJECT_PROFILE_TEXT[locale === "de" ? "de" : "en"],
  ]
  for (const anchor of requiredText) {
    if (!text.includes(anchor)) {
      throw new Error(`${path} does not contain required project-profile text: ${anchor}`)
    }
  }
  for (const productUrl of ["https://terminaro.eu/", "https://palamedes.dev/"]) {
    if (!links.includes(productUrl)) {
      throw new Error(`${path} does not contain product link ${productUrl}.`)
    }
  }
  const consultantProfileUrl = expectedConsultantProfileUrl(locale)
  if (!links.includes(consultantProfileUrl)) {
    throw new Error(`${path} does not link the full consultant profile ${consultantProfileUrl}.`)
  }
  if (/\b(?:dws-morgenfund|witt-gruppe|dws-wise|regrello-i18n)\b/v.test(text)) {
    throw new Error(`${path} exposes an internal project id.`)
  }
  if (/Stundensatz|hourly rate/iv.test(text)) {
    throw new Error(`${path} exposes an hourly rate.`)
  }
}

async function verifyProjectProfilePdf(path: string, locale: string): Promise<void> {
  const bytes = await readFile(path)
  const loadingTask = getDocument({ data: Uint8Array.from(bytes) })
  try {
    const document = await loadingTask.promise
    if (document.numPages !== PROJECT_PROFILE_PAGE_COUNT) {
      throw new Error(
        `${path} has ${String(document.numPages)} pages, expected ${String(PROJECT_PROFILE_PAGE_COUNT)}.`
      )
    }
    const content = await readProjectProfilePdfContent(document, path)
    assertProjectProfilePdfContent(content, path, locale)
  } finally {
    await loadingTask.destroy()
  }
}

// Asserts the exact published name set of pdfs/, so a left-over PDF under an
// old name cannot go unnoticed.
async function assertProfilePdfMatrix(
  outputDirectory: string,
  locales: readonly string[]
): Promise<void> {
  const profilePdfs = expectedProfilePdfs(locales)
  const profileFilenames = profilePdfs.map((pdf) => pdf.filename)

  assertProfilePdfNamesDistinct(locales)

  const pdfDirectory = resolve(outputDirectory, "pdfs")
  await assertPdfDirectory(pdfDirectory)
  const sortedExpected = [...profileFilenames].sort()
  const actualFilenames = await publishedPdfFilenames(pdfDirectory)
  if (JSON.stringify(actualFilenames) !== JSON.stringify(sortedExpected)) {
    throw new Error(
      `${pdfDirectory} contains PDFs ${JSON.stringify(actualFilenames)}, expected exactly ${JSON.stringify(sortedExpected)}.`
    )
  }

  await Promise.all(
    profileFilenames.map(async (filename) => assertNonEmptyFile(resolve(pdfDirectory, filename)))
  )
  await Promise.all(
    profilePdfs
      .filter((profile) => profile.kind === "project_profile")
      .map(async (profile) =>
        verifyProjectProfilePdf(resolve(pdfDirectory, profile.filename), profile.locale)
      )
  )
}

function anchorTags(html: string): string[] {
  return [...html.matchAll(/<a\b[^>]*>/gv)].map((match) => match[0])
}

// React escapes exactly these characters when it serializes an attribute value,
// so an expected value is escaped the same way before it is compared. Today's
// derived names are pure ASCII, but a team name carrying an apostrophe or an
// ampersand would otherwise break a literal match.
function escapeAttributeValue(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;")
}

// Tag-scoped like the hasLink helpers of the two artifact verifiers: an
// unscoped substring search would accept the attribute on any element or on an
// anchor pointing somewhere else. Unlike hasLink this stays case sensitive,
// because the capitalization of the download name is the point of the check.
function hasAnchor(html: string, attributes: Record<string, string>): boolean {
  return anchorTags(html).some((tag) =>
    Object.entries(attributes).every(([name, value]) =>
      tag.includes(`${name}="${escapeAttributeValue(value)}"`)
    )
  )
}

async function assertProfilePage(path: string): Promise<void> {
  const fileStats = await stat(path).catch(() => null)
  if (fileStats?.isFile() !== true) {
    throw new Error(`Expected profile page file: ${path}`)
  }
}

function verifyProjectProfileHtml(html: string, path: string, locale: string): void {
  const markers = [...html.matchAll(/data-project-profile-page="(?<page>[1-5])"/gv)].map(
    (match) => match.groups?.page ?? ""
  )
  if (JSON.stringify(markers) !== JSON.stringify(["1", "2", "3", "4", "5"])) {
    throw new Error(`${path} does not contain exactly five ordered project-profile page markers.`)
  }
  for (const href of ["https://terminaro.eu", "https://palamedes.dev"]) {
    if (!hasAnchor(html, { href })) {
      throw new Error(`${path} does not link product URL ${href}.`)
    }
  }
  assertProjectProfileHtmlConsultantLink(html, path, locale)
  for (const anchor of ["Sebastian Fastner", "Sebastian Software GmbH", "Regrello"] as const) {
    if (!html.includes(anchor)) {
      throw new Error(`${path} does not contain required project-profile text ${anchor}.`)
    }
  }
  if (/\b(?:dws-morgenfund|witt-gruppe|dws-wise|regrello-i18n)\b/v.test(html)) {
    throw new Error(`${path} exposes an internal project id.`)
  }
  if (/Stundensatz|hourly rate/iv.test(html)) {
    throw new Error(`${path} exposes an hourly rate.`)
  }
}

function assertProjectProfileHtmlConsultantLink(html: string, path: string, locale: string): void {
  const consultantProfileUrl = expectedConsultantProfileUrl(locale)
  if (!hasAnchor(html, { href: consultantProfileUrl })) {
    throw new Error(`${path} does not link the full consultant profile ${consultantProfileUrl}.`)
  }
}

/**
 * Asserts that every pre-rendered profile page of one locale links its own
 * profile PDF under the derived download name. The page is a build artifact on
 * disk, so this is the only machine-checkable proof that the rail carries the
 * name — and it has to run against every published tree, because the variant
 * builds and the compatibility build are separate React Router builds.
 *
 * @param routeRoot - Directory holding the route folders of that locale.
 * @param locale - Locale whose profile pages are inspected.
 */
export async function verifyProfileDownloadNames(routeRoot: string, locale: string): Promise<void> {
  await Promise.all(
    expectedProfilePdfs([locale]).map(async ({ downloadName, href, kind, route }) => {
      const path = resolve(routeRoot, route.slice(1), "index.html")
      await assertProfilePage(path)
      const html = await readFile(path, "utf8")
      if (!hasAnchor(html, { download: downloadName, href })) {
        throw new Error(
          `${path} does not offer its profile PDF as download="${downloadName}" on an anchor to ${href}.`
        )
      }
      if (kind === "project_profile") {
        verifyProjectProfileHtml(html, path, locale)
      }
    })
  )
}

export async function verifyVariantProfileArtifacts(
  outputDirectory: string,
  locale: string
): Promise<void> {
  await assertProfilePdfMatrix(outputDirectory, [locale])
}

export async function verifyCompatibilityProfileArtifacts(outputDirectory: string): Promise<void> {
  await assertProfilePdfMatrix(outputDirectory, LOCALES)
}
