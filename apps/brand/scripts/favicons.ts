/**
 * Generates the favicon set of every site from the brand marks, following
 * Evil Martians' "How to Favicon in 2021: six files that fit most needs":
 *
 * - favicon.ico: 32 px, always at the site root without a hash
 * - icon.svg: the square mark
 * - apple-touch-icon.png: 180 px, the mark at 140 px on the brand's paper
 * - icon-192.png and icon-512.png: the mark for the web manifest
 * - icon-mask.png: 512 px maskable, the mark in the 409 px safe zone on paper
 * - manifest.webmanifest: the site's name and the three manifest icons
 *
 * The files are committed; run this again only when a mark changes:
 *
 *   pnpm --filter @sebastian-websites/brand favicons
 *
 * Rendering uses Playwright's Chromium, the engine that draws most tabs, and
 * ImageMagick 7 (`magick`) packs the ICO.
 */
import { execFileSync } from "node:child_process"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { chromium, type Page } from "playwright"

const ROOT = fileURLToPath(new URL("../../..", import.meta.url))

type Brand = {
  /** The transparent mark in the brand site's public folder. */
  readonly mark: string
  /** The brand's paper tone, behind the Apple touch and maskable icons. */
  readonly paper: string
  /** Each app that uses the brand, with the name its manifest carries. */
  readonly sites: ReadonlyArray<{ readonly app: string; readonly name: string }>
}

const BRANDS: readonly Brand[] = [
  {
    mark: "apps/brand/public/sebastian-software/icon-software-light-transparent.svg",
    paper: "#e7f0f3",
    sites: [
      { app: "software", name: "Sebastian Software" },
      { app: "opensource", name: "Open Source – Sebastian Software" },
    ],
  },
  {
    mark: "apps/brand/public/sebastian-consulting/icon-consulting-light-transparent.svg",
    paper: "#f5ecee",
    sites: [{ app: "consulting", name: "Sebastian Consulting" }],
  },
]

type Raster = {
  readonly background?: string
  readonly file: string
  /** The mark's edge length inside the square canvas. */
  readonly mark: number
  readonly size: number
}

const RASTERS: readonly Raster[] = [
  { file: "favicon-32.png", mark: 32, size: 32 },
  { file: "icon-192.png", mark: 192, size: 192 },
  { file: "icon-512.png", mark: 512, size: 512 },
  { background: "paper", file: "apple-touch-icon.png", mark: 140, size: 180 },
  { background: "paper", file: "icon-mask.png", mark: 409, size: 512 },
]

/**
 * Reduces the exported mark to a plain square SVG: no XML prolog, doctype,
 * editor metadata, or percentage size.
 *
 * @param source - The mark as exported from the design tool.
 * @returns The favicon SVG.
 */
function faviconSvg(source: string): string {
  return `${source
    .replace(/<\?xml[^>]*\?>\s*/v, "")
    .replace(/<!DOCTYPE[^>]*>\s*/v, "")
    .replace(/ width="100%" height="100%"/v, "")
    .replace(/ xmlns:serif="[^"]*"/v, "")
    .replace(/ serif:id="[^"]*"/gv, "")
    .trim()}\n`
}

async function render(page: Page, svg: string, raster: Raster, paper: string): Promise<Buffer> {
  const inset = (raster.size - raster.mark) / 2
  const source = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`
  await page.setViewportSize({ height: raster.size, width: raster.size })
  await page.setContent(
    `<body style="margin:0;background:${raster.background === undefined ? "transparent" : paper}">` +
      `<img src="${source}" style="position:absolute;left:${String(inset)}px;top:${String(inset)}px;width:${String(raster.mark)}px;height:${String(raster.mark)}px">` +
      "</body>"
  )
  await page.locator("img").evaluate(async (image: HTMLImageElement) => image.decode())
  return page.screenshot({ omitBackground: raster.background === undefined })
}

function manifest(name: string): string {
  const icons = [
    { sizes: "192x192", src: "/icon-192.png", type: "image/png" },
    { purpose: "maskable", sizes: "512x512", src: "/icon-mask.png", type: "image/png" },
    { sizes: "512x512", src: "/icon-512.png", type: "image/png" },
  ]
  return `${JSON.stringify({ icons, name }, null, 2)}\n`
}

const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 1 })
const work = await mkdtemp(join(tmpdir(), "favicons-"))
try {
  for (const brand of BRANDS) {
    const svg = faviconSvg(await readFile(join(ROOT, brand.mark), "utf8"))
    const images = new Map<string, Buffer>()
    for (const raster of RASTERS) {
      images.set(raster.file, await render(page, svg, raster, brand.paper))
    }
    const png32 = join(work, "favicon-32.png")
    await writeFile(png32, images.get("favicon-32.png") ?? Buffer.alloc(0))
    const ico = join(work, "favicon.ico")
    execFileSync("magick", [png32, ico])
    for (const site of brand.sites) {
      const target = join(ROOT, "apps", site.app, "public")
      await writeFile(join(target, "favicon.ico"), await readFile(ico))
      await writeFile(join(target, "icon.svg"), svg)
      for (const [file, bytes] of images) {
        if (file !== "favicon-32.png") await writeFile(join(target, file), bytes)
      }
      await writeFile(join(target, "manifest.webmanifest"), manifest(site.name))
      console.log(`Wrote the favicon set of ${site.app}`)
    }
  }
} finally {
  await browser.close()
  await rm(work, { force: true, recursive: true })
}
