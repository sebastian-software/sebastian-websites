/* cspell:ignore fastner */
import { BlogValidationError } from "@sebastian-websites/web-core"
import assert from "node:assert/strict"
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { after, before, test } from "node:test"

import { blogLanguageData, BlogSourceError, readBlog } from "./blog-sources.ts"

const BUILD_TIME = "2026-11-08T12:00:00.000Z"
const TAG = "internationalization"
/** Fixture-style reads: the launch guard is off unless a test turns it on. */
const UNGUARDED = { requireBothLanguages: false } as const

let root = ""
let counter = 0

before(async () => {
  root = await mkdtemp(path.join(tmpdir(), "blog-sources-"))
})

after(async () => {
  await rm(root, { force: true, recursive: true })
})

/**
 * A fresh content directory.
 * @returns Their paths.
 */
async function workspace(): Promise<{ content: string }> {
  counter += 1
  const base = path.join(root, String(counter))
  const content = path.join(base, "content")
  await mkdir(content, { recursive: true })
  return { content }
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

test("a translation pair has a counterpart path and a lone post has none", async () => {
  const { content } = await workspace()
  await writePost(content, "de/pair.md", { id: "pair" })
  await writePost(content, "en/pair.md", { id: "pair" })
  await writePost(content, "de/nur-deutsch.md", { id: "nur-deutsch" })
  const blog = await readBlog(content, BUILD_TIME, UNGUARDED)
  assert.deepEqual(blogLanguageData(blog.index, "de"), {
    counterparts: { "/blog/nur-deutsch": null, "/blog/pair": "/blog/pair" },
    otherLanguage: [],
  })
  assert.deepEqual(blogLanguageData(blog.index, "en"), {
    counterparts: { "/blog/pair": "/blog/pair" },
    otherLanguage: [],
  })
  assert.doesNotMatch(await readFile(path.join(content, "de/pair.md"), "utf8"), /counterpart/v)
})

test("drafts and future posts are validated but supply no published translation", async () => {
  const { content } = await workspace()
  await writePost(content, "de/later.md", { id: "later" })
  await writePost(content, "en/later.md", {
    id: "later",
    publishedAt: "2026-11-20T09:00:00+01:00",
  })
  await writePost(content, "en/draft.md", { extra: "draft: true\n", id: "draft" })
  await writePost(content, "de/draft.md", { id: "draft" })
  const blog = await readBlog(content, BUILD_TIME, UNGUARDED)
  assert.equal(blog.sources.length, 4)
  assert.deepEqual(blogLanguageData(blog.index, "de"), {
    counterparts: { "/blog/draft": null, "/blog/later": null },
    otherLanguage: [],
  })
  assert.deepEqual(blogLanguageData(blog.index, "en"), { counterparts: {}, otherLanguage: [] })
})

test("language data lists only this domain's post paths and the other language's tag keys", async () => {
  const { content } = await workspace()
  await writePost(content, "de/tagged.md", { id: "tagged", tags: true })
  await writePost(content, "en/plain.md", { id: "plain" })
  const blog = await readBlog(content, BUILD_TIME, UNGUARDED)
  const english = blogLanguageData(blog.index, "en")
  assert.deepEqual(english, { counterparts: { "/blog/plain": null }, otherLanguage: [TAG] })
  assert.deepEqual(blogLanguageData(blog.index, "de"), {
    counterparts: { "/blog/tagged": null },
    otherLanguage: [],
  })
  // Neither titles, prose nor another language's unpaired routes enter the browser payload.
  assert.doesNotMatch(JSON.stringify(english), /Title|Body of|tagged/v)
})

test("language data ignores tag archives from drafts and future posts", async () => {
  const { content } = await workspace()
  await writePost(content, "de/draft.md", { extra: "draft: true\n", id: "draft", tags: true })
  await writePost(content, "de/later.md", {
    id: "later",
    publishedAt: "2026-12-01T09:00:00+01:00",
    tags: true,
  })
  const blog = await readBlog(content, BUILD_TIME, UNGUARDED)
  assert.deepEqual(blogLanguageData(blog.index, "en"), { counterparts: {}, otherLanguage: [] })
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

test("a post with invalid fields fails the build before Ardo renders", async () => {
  const { content } = await workspace()
  await writePost(content, "de/bad.md", { extra: "tags: [no-such-tag]\n", id: "bad" })
  await assert.rejects(readBlog(content, BUILD_TIME, UNGUARDED), BlogValidationError)
})

test("missing or empty language directories yield an empty blog", async () => {
  const { content } = await workspace()
  // Git drops empty directories: neither language directory exists.
  const blog = await readBlog(content, BUILD_TIME, UNGUARDED)
  assert.equal(blog.sources.length, 0)
  assert.equal(blog.index.posts.de.length, 0)
  assert.equal(blog.index.posts.en.length, 0)
  assert.deepEqual(blogLanguageData(blog.index, "en"), { counterparts: {}, otherLanguage: [] })
  // An empty directory behaves the same.
  await mkdir(path.join(content, "de"), { recursive: true })
  const again = await readBlog(content, BUILD_TIME, UNGUARDED)
  assert.equal(again.sources.length, 0)
})

test("source discovery skips hidden and underscore entries and keeps nested Markdown", async () => {
  const { content } = await workspace()
  await writePost(content, "en/deep/index.md", { id: "deep" })
  await writePost(content, "en/_partial.md", { id: "partial" })
  await writePost(content, "en/.hidden.md", { id: "hidden" })
  await writeFile(path.join(content, "en", "diagram.svg"), "<svg/>")
  const blog = await readBlog(content, BUILD_TIME, UNGUARDED)
  assert.deepEqual(
    blog.sources.map((source) => source.file),
    ["deep/index.md"]
  )
  assert.deepEqual(blogLanguageData(blog.index, "en"), {
    counterparts: { "/blog/deep": null },
    otherLanguage: [],
  })
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

test("symbolic links in the content are refused before publication reads them", async () => {
  const { content } = await workspace()
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
  // The linked file keeps its text.
  assert.doesNotMatch(await readFile(outside, "utf8"), /counterpart/v)
})
