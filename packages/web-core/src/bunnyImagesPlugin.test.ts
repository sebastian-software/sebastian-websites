/* eslint-disable security/detect-non-literal-fs-filename -- Tests own their temporary fixture directories. */
import { createHash } from "node:crypto"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { build, createServer } from "vite"
import { describe, expect, it } from "vitest"

import { bunnyImages } from "./bunnyImagesPlugin.ts"

// A complete 1x1 PNG; the build preserves its original bytes.
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9l8AAAAASUVORK5CYII=",
  "base64"
)
const path = `images/${createHash("sha256").update(png).digest("hex")}.png`

function builtChunk(output: Awaited<ReturnType<typeof build>>): string {
  if (Array.isArray(output) || !("output" in output)) throw new Error("Expected one bundle")
  const chunk = output.output.find((entry) => entry.type === "chunk")
  if (chunk === undefined) throw new Error("Expected a JavaScript chunk")
  return chunk.code
}

function emittedFiles(output: Awaited<ReturnType<typeof build>>): readonly string[] {
  if (Array.isArray(output) || !("output" in output)) throw new Error("Expected one bundle")
  return output.output.filter((entry) => entry.type === "asset").map((entry) => entry.fileName)
}

async function fixture(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "bunny-vite-"))
  await writeFile(join(root, "one.png"), png)
  await writeFile(join(root, "two.png"), png)
  await writeFile(
    join(root, "entry.js"),
    'import one from "./one.png?bunny"; import two from "./two.png?bunny"; console.log(one, two);'
  )
  return root
}

describe("bunnyImages", () => {
  it("deduplicates content and writes matching production metadata, originals, and upload manifest", async () => {
    const root = await fixture()
    try {
      const output = await build({
        build: { minify: false, rolldownOptions: { input: join(root, "entry.js") } },
        configFile: false,
        logLevel: "silent",
        plugins: [bunnyImages()],
        root,
      })
      expect(builtChunk(output)).toContain(path)
      expect(builtChunk(output)).not.toContain("localSrc")
      expect(emittedFiles(output).filter((fileName) => fileName === path)).toHaveLength(1)
      expect(
        JSON.parse(await readFile(join(root, "dist/_bunny/images.json"), "utf8"))
      ).toStrictEqual([path])
      expect(await readFile(join(root, "dist", path))).toStrictEqual(png)
    } finally {
      await rm(root, { force: true, recursive: true })
    }
  })

  it("keeps unpublished development imports local", async () => {
    const root = await fixture()
    const server = await createServer({
      configFile: false,
      logLevel: "silent",
      plugins: [bunnyImages()],
      root,
    })
    try {
      const result = await server.transformRequest("/one.png?bunny")
      expect(result?.code).toContain("localSrc")
      expect(result?.code).toContain("/one.png?import&no-inline")
      expect(result?.code).toContain(path)
    } finally {
      await server.close()
      await rm(root, { force: true, recursive: true })
    }
  })

  it("uses the same hash in SSR without emitting another set of originals", async () => {
    const root = await fixture()
    try {
      const output = await build({
        build: { ssr: join(root, "entry.js"), write: false },
        configFile: false,
        logLevel: "silent",
        plugins: [bunnyImages()],
        root,
      })
      expect(emittedFiles(output)).toHaveLength(0)
      expect(builtChunk(output)).toContain(path)
    } finally {
      await rm(root, { force: true, recursive: true })
    }
  })
})
