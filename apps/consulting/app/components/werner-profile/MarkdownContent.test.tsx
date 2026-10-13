import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

import { getWernerProfileCopy } from "~/data/werner.profile"
import showcases from "~/data/werner.showcases.json"

import { MarkdownContent } from "./MarkdownContent"

vi.mock("@palamedes/core/macro", () => ({
  t(strings: TemplateStringsArray): string {
    return strings.join("")
  },
}))

describe("Werner public profile documents", () => {
  it("renders the complete chronology and open-source links without truncating older work", () => {
    const copy = getWernerProfileCopy()
    const view = renderToStaticMarkup(
      <MarkdownContent markdown={copy.projectHistory} title="Detailed project history" />
    )
    expect(view.match(/data-profile-project=""/gv)).toHaveLength(26)
    expect(view).toContain("Schlund+Partner / 1&amp;1")
    expect(view).toContain("DIY Retailer")
    expect(view).toContain("https://github.com/sebastian-software/ardo")
    expect(view.match(/aria-label="Showcase"/gv)).toHaveLength(5)
    expect(view).not.toContain("<h1>")
  })

  it("keeps the executive summary readable with one name heading and safe contact links", () => {
    const view = renderToStaticMarkup(
      <MarkdownContent markdown={getWernerProfileCopy().executiveSummary} />
    )
    expect(view.match(/<h1>/gv)).toHaveLength(1)
    expect(view).toContain("mailto:s.werner@sebastian-software.de")
    expect(view).toContain("<ul>")
    expect(view).toMatch(/<h3[^>]*>Regrello — [^<]+<\/h3>/v)
  })

  it("rejects raw HTML and active link protocols in profile copy", () => {
    expect(() =>
      renderToStaticMarkup(<MarkdownContent markdown="<script>alert(1)</script>" />)
    ).toThrow("Unsupported profile block token")
    expect(() =>
      renderToStaticMarkup(<MarkdownContent markdown="[Contact](javascript:alert)" />)
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
