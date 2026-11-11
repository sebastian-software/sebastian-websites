import { createElement } from "ardo/react"
import { renderToStaticMarkup } from "ardo/react-dom/server"
import { describe, expect, it, vi } from "vitest"

import showcases from "~/data/werner.showcases.json"

import { assertProfileContent } from "../../../scripts/profile-content"
import { ProfileLink } from "./MarkdownContent"

vi.mock("@palamedes/core/macro", () => ({
  t(strings: TemplateStringsArray): string {
    return strings.join("")
  },
}))

describe("Werner public profile documents", () => {
  it("rejects raw HTML and active link protocols in profile copy", () => {
    expect(() => {
      assertProfileContent("<script>alert(1)</script>")
    }).toThrow("Unsupported profile HTML")
    const activeProtocol = "javascript"
    expect(() =>
      renderToStaticMarkup(
        createElement(ProfileLink, { href: `${activeProtocol}:alert` }, "Contact")
      )
    ).toThrow("Unsupported profile link protocol")
  })

  it("publishes only selected showcase identifiers, labels, and public URLs", () => {
    const allowedKeys = new Set(["id", "name", "showcase", "url"])
    for (const showcase of showcases.showcases) {
      expect(showcase.showcase).toBe(true)
      expect(Object.keys(showcase).every((key) => allowedKeys.has(key))).toBe(true)
    }
  })
})
