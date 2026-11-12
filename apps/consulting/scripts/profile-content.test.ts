import { readFile } from "node:fs/promises"
import { describe, expect, it } from "vitest"

import { assertProfileContent } from "./profile-content"

describe("localized profile source policy", () => {
  it("accepts the complete published prose in both languages", async () => {
    await Promise.all(
      ["de", "en"].flatMap((locale) =>
        ["executive-summary", "project-history"].map(async (document) => {
          const source = await readFile(
            new URL(`../app/content/werner/${locale}/${document}.mdx`, import.meta.url),
            "utf8"
          )
          expect(() => {
            assertProfileContent(source)
          }).not.toThrow()
        })
      )
    )
  })

  it("rejects raw HTML, unknown components, and active component attributes", () => {
    for (const source of [
      "<script>alert(1)</script>",
      "<div>Unreviewed HTML</div>",
      "<Unknown>Unknown component</Unknown>",
      '<Project onClick="alert(1)">Prose</Project>',
      '<Experience id="regrello" title="Title" onClick="alert(1)">Prose</Experience>',
    ])
      expect(() => {
        assertProfileContent(source)
      }).toThrow("Unsupported profile HTML")
  })

  it("rejects executable expressions and module declarations", () => {
    for (const source of ["{alert(1)}", 'import unsafe from "./unsafe"', "export const unsafe = 1"])
      expect(() => {
        assertProfileContent(source)
      }).toThrow("executable MDX")
  })
})
