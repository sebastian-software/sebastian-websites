import { describe, expect, it } from "vitest"

import { authorAvatarIssues, rasterImageIssues } from "./blogImages.ts"

function check(body: string, format: "md" | "mdx" = "md", frontmatter = {}): readonly string[] {
  return rasterImageIssues({ body, format, frontmatter })
}

describe("raster-image source check", () => {
  it("rejects image frontmatter fields", () => {
    expect(
      check("", "md", { coverImage: {}, images: {}, ogImage: "a.png", twitterImage: "b.png" })
    ).toHaveLength(4)
  })

  it("allows SVG Markdown images and rejects every other inline target", () => {
    expect(check('![A](./a.svg) ![B](<./b c.SVG> "title") ![C](./c.svg?raw#x)')).toStrictEqual([])
    expect(check("![A](./a.png)\n![B](https://example.com/b.webp)\n![C](./c)")).toStrictEqual([
      "Markdown image ./a.png is not an SVG",
      "Markdown image https://example.com/b.webp is not an SVG",
      "Markdown image ./c is not an SVG",
    ])
  })

  it("resolves reference-style images, including collapsed and shortcut forms", () => {
    const definitions = "\n\n[diagram]: ./diagram.svg\n[photo]: <./photo.jpg>\n"
    expect(check(`![A][diagram]${definitions}`)).toStrictEqual([])
    expect(check(`![A][Photo] ![photo][] ![photo]${definitions}`)).toHaveLength(3)
    expect(check("![Not a reference] and [a link](./a.png)")).toStrictEqual([])
  })

  it("rejects image elements and components", () => {
    for (const body of [
      '<img src="a.svg">',
      "<IMG src=a.png>",
      "<picture><source srcset=a.avif></picture>",
      '<Image src="./a.png" />',
    ]) {
      expect(check(body, "mdx")).toStrictEqual([
        "Image elements (img, picture, source, Image) are not allowed",
      ])
    }
    expect(check("<Imagery />", "mdx")).toStrictEqual([])
  })

  it("rejects MDX imports of non-SVG files and keeps module imports", () => {
    const body = [
      'import logo from "./logo.svg"',
      'import { Chart } from "../components/Chart"',
      'import data from "./data.ts"',
      'import photo from "./photo.png"',
      "import cover from './cover.jpg?bunny'",
      'import "./diagram.webp"',
    ].join("\n")
    expect(check(body, "mdx")).toStrictEqual([
      "MDX import ./photo.png is not an SVG or a module",
      "MDX import ./cover.jpg?bunny is not an SVG or a module",
      "MDX import ./diagram.webp is not an SVG or a module",
    ])
    expect(check('import photo from "./photo.png"', "md")).toStrictEqual([])
  })

  it("follows multi-line imports, re-exports, and dynamic imports", () => {
    const body = [
      "import {",
      "  photo,",
      "  other,",
      '} from "./photos.png"',
      "",
      'export { default as cover } from "./cover.webp"',
      "export * from './figures.avif';",
      'export { Chart } from "../components/Chart.tsx"',
      'export const meta = { title: "Figures" }',
      "",
      '<Figure load={() => import("./lazy.jpg")} />',
      "<Diagram load={() => import('./lazy.svg')} />",
    ].join("\n")
    expect(check(body, "mdx")).toStrictEqual([
      "MDX import ./photos.png is not an SVG or a module",
      "MDX import ./cover.webp is not an SVG or a module",
      "MDX import ./figures.avif is not an SVG or a module",
      "MDX import ./lazy.jpg is not an SVG or a module",
    ])
  })

  it("ignores image syntax inside code", () => {
    expect(
      check("```md\n![A](./a.png)\n<img src=a.png>\n```\n\nUse `![alt](a.png)` for images.")
    ).toStrictEqual([])
    expect(check("~~~\n![A](./a.png)\n~~~\n![B](./b.png)")).toHaveLength(1)
  })

  it("rejects author avatar entries", () => {
    expect(
      authorAvatarIssues({ first: { name: "First Author" }, second: { avatar: "./second.jpg" } })
    ).toStrictEqual(["Author second has an avatar entry"])
  })
})
