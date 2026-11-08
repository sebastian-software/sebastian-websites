/* cspell:ignore fastner */
import { BlogValidationError } from "@sebastian-websites/web-core"
import assert from "node:assert/strict"
import { mkdir, mkdtemp, readdir, readFile, rm, symlink, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { after, before, test } from "node:test"

import {
  BLOG_TAGS_FILE,
  BlogSourceError,
  readBlog,
  stageBlog,
  STAGED_BLOG,
} from "./blog-staging.ts"

const BUILD_TIME = "2026-11-08T12:00:00.000Z"
const TAG = "internationalization"
/** Fixture-style reads: the launch guard is off unless a test turns it on. */
const UNGUARDED = { requireBothLanguages: false } as const

let root = ""
let counter = 0

before(async () => {
  root = await mkdtemp(path.join(tmpdir(), "blog-staging-"))
})

after(async () => {
  await rm(root, { force: true, recursive: true })
})

/**
 * A fresh content directory and variant project.
 * @returns Their paths.
 */
async function workspace(): Promise<{ content: string; site: string }> {
  counter += 1
  const base = path.join(root, String(counter))
  const content = path.join(base, "content")
  const site = path.join(base, "site")
  await mkdir(content, { recursive: true })
  await mkdir(site, { recursive: true })
  return { content, site }
}

type PostOptions = {
  readonly extra?: string
  readonly id: string
  readonly publishedAt?: string
  readonly tags?: boolean
}

async function writePost(content: string, file: string, options: PostOptions): Promise<void> {
  const target = path.join(content, file)
  await mkdir(path.dirname(target), { recursive: true })
  const tags = options.tags === true ? `tags: [${TAG}]\n` : ""
  await writeFile(
    target,
    `---\nid: ${options.id}\ntitle: Title ${options.id}\ndescription: About ${options.id}.\npublishedAt: ${options.publishedAt ?? "2026-11-02T09:00:00+01:00"}\nauthors: [fastner]\nnextStep: none\n${tags}${options.extra ?? ""}---\nBody of ${options.id}.\n`
  )
}

async function staged(site: string, locale: string, file: string): Promise<string> {
  return readFile(path.join(site, STAGED_BLOG, locale, file), "utf8")
}

async function tagData(site: string): Promise<unknown> {
  return JSON.parse(await readFile(path.join(site, BLOG_TAGS_FILE), "utf8"))
}

test("a translation pair stages each side with the other's path, a lone post with null", async () => {
  const { content, site } = await workspace()
  await writePost(content, "de/pair.md", { id: "pair" })
  await writePost(content, "en/pair.md", { id: "pair" })
  await writePost(content, "de/nur-deutsch.md", { id: "nur-deutsch" })
  const blog = await readBlog(content, BUILD_TIME, UNGUARDED)
  await stageBlog({ blog, content, locale: "de", site })
  assert.match(
    await staged(site, "de", "pair.md"),
    /\ncounterpart: "\/blog\/pair"\n---\nBody of pair\.\n$/v
  )
  assert.match(await staged(site, "de", "nur-deutsch.md"), /\ncounterpart: null\n---\n/v)
  // The source frontmatter stays as written.
  assert.match(await staged(site, "de", "pair.md"), /^---\nid: pair\ntitle: Title pair\n/v)
  await stageBlog({ blog, content, locale: "en", site })
  assert.match(await staged(site, "en", "pair.md"), /\ncounterpart: "\/blog\/pair"\n/v)
})

test("a post that is not due in the other language has no counterpart", async () => {
  const { content, site } = await workspace()
  await writePost(content, "de/later.md", { id: "later" })
  await writePost(content, "en/later.md", {
    id: "later",
    publishedAt: "2026-11-20T09:00:00+01:00",
  })
  await writePost(content, "en/draft.md", { extra: "draft: true\n", id: "draft" })
  await writePost(content, "de/draft.md", { id: "draft" })
  const blog = await readBlog(content, BUILD_TIME, UNGUARDED)
  await stageBlog({ blog, content, locale: "de", site })
  assert.match(await staged(site, "de", "later.md"), /\ncounterpart: null\n/v)
  // Drafts and future posts are staged unfiltered; Ardo leaves them out.
  await stageBlog({ blog, content, locale: "en", site })
  const stagedFiles = await readdir(path.join(site, STAGED_BLOG, "en"))
  assert.deepEqual(stagedFiles.toSorted(), ["draft.md", "later.md"])
})

test("blog-tags.json lists the tags that have an archive in the other language", async () => {
  const { content, site } = await workspace()
  await writePost(content, "de/tagged.md", { id: "tagged", tags: true })
  await writePost(content, "en/plain.md", { id: "plain" })
  const blog = await readBlog(content, BUILD_TIME, UNGUARDED)
  await stageBlog({ blog, content, locale: "en", site })
  assert.deepEqual(await tagData(site), { otherLanguage: [TAG] })
  await stageBlog({ blog, content, locale: "de", site })
  assert.deepEqual(await tagData(site), { otherLanguage: [] })
})

test("blog-tags.json ignores tagged posts that are drafts or not yet due", async () => {
  const { content, site } = await workspace()
  await writePost(content, "de/draft.md", { extra: "draft: true\n", id: "draft", tags: true })
  await writePost(content, "de/later.md", {
    id: "later",
    publishedAt: "2026-12-01T09:00:00+01:00",
    tags: true,
  })
  const blog = await readBlog(content, BUILD_TIME, UNGUARDED)
  await stageBlog({ blog, content, locale: "en", site })
  assert.deepEqual(await tagData(site), { otherLanguage: [] })
})

test("an authored counterpart field is refused with the file named", async () => {
  const { content } = await workspace()
  await writePost(content, "de/beitrag.md", {
    extra: "counterpart: /blog/beitrag\n",
    id: "beitrag",
  })
  await assert.rejects(readBlog(content, BUILD_TIME, UNGUARDED), (error: unknown) => {
    assert.ok(error instanceof BlogSourceError)
    assert.match(error.message, /^de\/beitrag\.md: counterpart is written by the build/v)
    return true
  })
})

test("invalid or non-mapping frontmatter is refused", async () => {
  const broken = await workspace()
  await mkdir(path.join(broken.content, "en"), { recursive: true })
  await writeFile(path.join(broken.content, "en", "a.md"), "---\nid: [unclosed\n---\nText\n")
  await assert.rejects(
    readBlog(broken.content, BUILD_TIME, UNGUARDED),
    /^BlogSourceError: en\/a\.md: the frontmatter is not valid YAML/v
  )
  const list = await workspace()
  await mkdir(path.join(list.content, "de"), { recursive: true })
  await writeFile(path.join(list.content, "de", "b.md"), "---\n- one\n- two\n---\nText\n")
  await assert.rejects(
    readBlog(list.content, BUILD_TIME, UNGUARDED),
    /de\/b\.md: the frontmatter must be a YAML mapping/v
  )
})

test("a post with invalid fields fails the build before staging", async () => {
  const { content } = await workspace()
  await writePost(content, "de/bad.md", { extra: "tags: [no-such-tag]\n", id: "bad" })
  await assert.rejects(readBlog(content, BUILD_TIME, UNGUARDED), BlogValidationError)
})

test("missing or empty language directories yield an empty blog and staged directories", async () => {
  const { content, site } = await workspace()
  // Git drops empty directories: neither language directory exists.
  const blog = await readBlog(content, BUILD_TIME, UNGUARDED)
  assert.equal(blog.sources.length, 0)
  assert.equal(blog.index.posts.de.length, 0)
  assert.equal(blog.index.posts.en.length, 0)
  await stageBlog({ blog, content, locale: "en", site })
  assert.deepEqual(await readdir(path.join(site, STAGED_BLOG, "en")), [])
  assert.deepEqual(await tagData(site), { otherLanguage: [] })
  // An empty directory behaves the same.
  await mkdir(path.join(content, "de"), { recursive: true })
  const again = await readBlog(content, BUILD_TIME, UNGUARDED)
  assert.equal(again.sources.length, 0)
})

test("staging replaces the previous copy, skips hidden and underscore entries, and copies assets", async () => {
  const { content, site } = await workspace()
  await writePost(content, "en/deep/index.md", { id: "deep" })
  await writePost(content, "en/_partial.md", { id: "partial" })
  await writePost(content, "en/.hidden.md", { id: "hidden" })
  await writeFile(path.join(content, "en", "diagram.svg"), "<svg/>")
  await mkdir(path.join(site, STAGED_BLOG, "en"), { recursive: true })
  await writeFile(path.join(site, STAGED_BLOG, "en", "stale.md"), "old")
  const blog = await readBlog(content, BUILD_TIME, UNGUARDED)
  assert.deepEqual(
    blog.sources.map((source) => source.file),
    ["deep/index.md"]
  )
  await stageBlog({ blog, content, locale: "en", site })
  assert.match(await staged(site, "en", "deep/index.md"), /\ncounterpart: null\n/v)
  assert.equal(await staged(site, "en", "diagram.svg"), "<svg/>")
  const stagedFiles = await readdir(path.join(site, STAGED_BLOG, "en"))
  assert.deepEqual(stagedFiles.toSorted(), [".hidden.md", "_partial.md", "deep", "diagram.svg"])
})

test("the launch guard applies only when the build asks for it", async () => {
  const { content } = await workspace()
  await writePost(content, "de/nur-deutsch.md", { id: "nur-deutsch" })
  const unguarded = await readBlog(content, BUILD_TIME, UNGUARDED)
  assert.equal(unguarded.index.posts.en.length, 0)
  await assert.rejects(
    readBlog(content, BUILD_TIME, { requireBothLanguages: true }),
    (error: unknown) => {
      assert.ok(error instanceof BlogValidationError)
      assert.match(error.message, /en: the blog navigation item is launching/v)
      assert.doesNotMatch(error.message, /de: /v)
      return true
    }
  )
  await writePost(content, "en/english.md", { id: "english" })
  const guarded = await readBlog(content, BUILD_TIME, { requireBothLanguages: true })
  assert.equal(guarded.index.posts.en.length, 1)
})

test("symbolic links in the content are refused, so staging never writes through one", async () => {
  const { content, site } = await workspace()
  const outside = path.join(path.dirname(content), "outside.md")
  await writePost(path.dirname(content), "outside.md", { id: "outside" })
  await mkdir(path.join(content, "en"), { recursive: true })
  await symlink(outside, path.join(content, "en", "linked.md"))
  await assert.rejects(readBlog(content, BUILD_TIME, UNGUARDED), (error: unknown) => {
    assert.ok(error instanceof BlogSourceError)
    assert.match(error.message, /^linked\.md: symbolic links are not allowed/v)
    return true
  })
  const directory = await workspace()
  await mkdir(path.join(directory.content, "de"), { recursive: true })
  await symlink(path.dirname(outside), path.join(directory.content, "de", "folder"), "dir")
  await assert.rejects(
    readBlog(directory.content, BUILD_TIME, UNGUARDED),
    /folder: symbolic links/v
  )
  // The linked file keeps its text; nothing was staged.
  assert.doesNotMatch(await readFile(outside, "utf8"), /counterpart/v)
  await assert.rejects(readdir(path.join(site, STAGED_BLOG)), { code: "ENOENT" })
})

test("staging leaves no temporary directory behind", async () => {
  const { content, site } = await workspace()
  await writePost(content, "en/post.md", { id: "post" })
  const blog = await readBlog(content, BUILD_TIME, UNGUARDED)
  await stageBlog({ blog, content, locale: "en", site })
  await stageBlog({ blog, content, locale: "en", site })
  const entries = await readdir(site)
  assert.deepEqual(entries.toSorted(), [BLOG_TAGS_FILE, "content"])
  assert.deepEqual(await readdir(path.join(site, STAGED_BLOG, "en")), ["post.md"])
})
