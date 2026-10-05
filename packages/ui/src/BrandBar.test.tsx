import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { BrandBar } from "./BrandBar.tsx"

function parseBar(site: "consulting" | "skills", locale: "de" | "en", path: string): Document {
  const view = renderToStaticMarkup(
    <BrandBar languageLabel="Language" locale={locale} path={path} site={site} />
  )
  return new DOMParser().parseFromString(view, "text/html")
}

describe("BrandBar", () => {
  it("lists both brands with their areas and marks the current site", () => {
    const bar = parseBar("skills", "en", "/")
    const links = [...bar.querySelectorAll('nav[aria-label="Sebastian"] a')]
    expect(links.map((link) => link.textContent)).toStrictEqual([
      "Sebastian Software",
      "Open Source",
      "Skills",
      "Sebastian Consulting",
      "Services",
      "Profiles",
    ])
    expect(bar.querySelector('[aria-current="page"]')?.textContent).toBe("Skills")
  })

  it("switches language by domain on the same path", () => {
    const bar = parseBar("consulting", "de", "/profiles")
    const english = bar.querySelector('a[hreflang="en"]')
    expect(english?.getAttribute("href")).toBe("https://sebastian-consulting.com/profiles")
    expect(bar.querySelector('a[hreflang="de"]')?.getAttribute("aria-current")).toBe("true")
  })
})
