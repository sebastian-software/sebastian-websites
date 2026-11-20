/* eslint-disable no-await-in-loop -- One Chromium page renders the changed regions in order. */
/* eslint-disable security/detect-non-literal-fs-filename -- Paths belong to the local comparison and its generated output. */
import type { Page } from "playwright"

import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { chromium } from "playwright"

import type { ReviewPair } from "./visual-review-html.ts"

import { escape, visualReviewHtml } from "./visual-review-html.ts"
import { screenshotInfo, visualViews } from "./visual-views.ts"

type Rect = { height: number; width: number; x: number; y: number }
type Kind = "added" | "changed" | "removed"
type Change = { kind: Kind } & Rect
type Region = { after: Rect; before: Rect; kind?: Kind; label: string }
type Bitmap = { data: Uint8Array; height: number; width: number }
type ChangeBoxes = {
  decodePng: (bytes: Uint8Array) => Bitmap
  findChanges: (before: Bitmap, after: Bitmap) => Change[]
}

const app = path.resolve(import.meta.dirname, "..")
const results = path.resolve(
  process.env.SOFTWARE_VISUAL_RESULTS ?? path.join(app, "build/visual-results")
)
const output = path.resolve(
  process.env.SOFTWARE_VISUAL_REVIEW ?? path.join(app, "build/visual-review")
)
const boxScript = process.env.SOFTWARE_VISUAL_BOXES
const regionFile = process.env.SOFTWARE_VISUAL_REGIONS
const context = 64
const columnWidth = 530
const maxPreviewHeight = 780
const minCropWidth = 320
const marks = {
  added: { color: "#15803d", label: "Added" },
  changed: { color: "#7651c4", label: "Changed" },
  removed: { color: "#be185d", label: "Removed" },
}

function span(changes: Change[]): Rect {
  const x = Math.min(...changes.map((box) => box.x))
  const y = Math.min(...changes.map((box) => box.y))
  return {
    height: Math.max(...changes.map((box) => box.y + box.height)) - y,
    width: Math.max(...changes.map((box) => box.x + box.width)) - x,
    x,
    y,
  }
}

function regionsFor(before: Bitmap, after: Bitmap, boxes: ChangeBoxes): Region[] {
  const fresh = boxes.findChanges(before, after)
  const previous = boxes.findChanges(after, before)
  if (fresh.length === 0 || previous.length === 0) {
    return [
      {
        after: { height: after.height, width: after.width, x: 0, y: 0 },
        before: { height: before.height, width: before.width, x: 0, y: 0 },
        label: "Full screenshot",
      },
    ]
  }
  if (fresh.length !== previous.length) {
    return [{ after: span(fresh), before: span(previous), label: "Changed areas" }]
  }
  return fresh.map((box, index) => ({
    after: box,
    before: previous[index],
    kind: box.kind,
    label: marks[box.kind].label,
  }))
}

function cropStart(start: number, crop: number, extent: number): number {
  return Math.max(0, Math.min(start, extent - crop))
}

type Capture = { image: Bitmap; source: string }

function panel(
  capture: Capture,
  rect: Rect,
  crop: { height: number; scale: number; width: number; x: number }
): string {
  const { image, source } = capture
  const { scale, x } = crop
  const y = cropStart(rect.y - context, crop.height, image.height)
  return `<div class="crop" style="width:${crop.width * scale}px;height:${crop.height * scale}px">
    <img src="${source}" style="width:${image.width * scale}px;left:${-x * scale}px;top:${-y * scale}px">
    <div class="mark" style="left:${(rect.x - x) * scale}px;top:${(rect.y - y) * scale}px;width:${Math.max(2, rect.width * scale)}px;height:${Math.max(2, rect.height * scale)}px"></div>
  </div>`
}

async function render(
  page: Page,
  captures: { after: Capture; before: Capture },
  presentation: { region: Region; title: string }
): Promise<void> {
  const { after, before } = captures
  const { region, title } = presentation
  const left = Math.min(region.before.x, region.after.x)
  const right = Math.max(region.before.x + region.before.width, region.after.x + region.after.width)
  const extent = Math.max(before.image.width, after.image.width)
  const width = Math.min(extent, Math.max(minCropWidth, right - left + 2 * context))
  const height = Math.min(
    Math.max(before.image.height, after.image.height),
    Math.max(region.before.height, region.after.height) + 2 * context
  )
  const scale = Math.min(1, columnWidth / width, maxPreviewHeight / height)
  const crop = { height, scale, width, x: cropStart(left - context, width, extent) }
  await page.setContent(`
    <!doctype html><html lang="en"><style>
      * { box-sizing: border-box }
      body { margin: 0; background: #f3f5f7; color: #182330; font: 15px system-ui, sans-serif }
      main { display: inline-block; padding: 24px }
      h1 { margin: 0 0 18px; font-size: 19px; font-weight: 600 }
      .pair { display: flex; gap: 16px }
      figure { margin: 0 }
      figcaption { margin-bottom: 8px; color: #405264; font-weight: 600 }
      .crop { position: relative; overflow: hidden; background: white; border-radius: 8px; outline: 1px solid #dbe1e8 }
      img, .mark { position: absolute }
      .mark { border: 2px dashed ${marks[region.kind ?? "changed"].color}; box-shadow: 0 0 0 1px white; border-radius: 3px }
    </style><main><h1>${escape(title)} · ${escape(region.label)}</h1><div class="pair">
      <figure><figcaption>Before</figcaption>${panel(before, region.before, crop)}</figure>
      <figure><figcaption>After</figcaption>${panel(after, region.after, crop)}</figure>
    </div></main></html>`)
  await page.evaluate(async () => {
    await Promise.all([...document.images].map(async (image) => image.decode()))
  })
}

async function loadCapture(file: string, boxes: ChangeBoxes): Promise<Capture> {
  const bytes = await readFile(file)
  return {
    image: boxes.decodePng(bytes),
    source: `data:image/png;base64,${bytes.toString("base64")}`,
  }
}

type RenderOptions = { boxes: ChangeBoxes; overrides: Record<string, Region[]> }

async function writeReview(entries: string[]): Promise<void> {
  await mkdir(output, { recursive: true })
  const markdown =
    entries.length === 0
      ? "No image pairs for this comparison. See the Playwright report for the result.\n"
      : `<!-- visual-review:start -->\n## Visual changes\n\nFrames mark the changed areas.\n\n${entries.join("\n\n")}\n<!-- visual-review:end -->\n`
  await writeFile(path.join(output, "review.md"), markdown)
}

async function renderPairs(
  page: Page,
  file: string,
  options: RenderOptions
): Promise<ReviewPair[]> {
  const stem = file.slice(0, -"-actual.png".length)
  const name = path.basename(stem)
  const capture = screenshotInfo(`${name}.png`)
  if (!capture) return []
  const { boxes } = options
  const [before, after] = await Promise.all([
    loadCapture(path.join(results, `${stem}-expected.png`), boxes),
    loadCapture(path.join(results, file), boxes),
  ])
  const title = `${viewLabel(capture.view)} · ${capture.language.toUpperCase()}`
  const regions = options.overrides[name] ?? regionsFor(before.image, after.image, boxes)
  const pairs: ReviewPair[] = []
  for (const [index, region] of regions.entries()) {
    const image = `${name}-${index + 1}.png`
    await render(page, { after, before }, { region, title: `${title} · ${capture.width} px` })
    await page.locator("main").screenshot({ path: path.join(output, image) })
    pairs.push({
      after: await page.locator(".crop").last().screenshot(),
      before: await page.locator(".crop").first().screenshot(),
      image,
      label: region.label,
      title,
      width: Number(capture.width),
    })
  }
  return pairs
}

function viewLabel(view: string): string {
  if (view === "home") return "Homepage"
  if (view === "sticky-header") return "Header while scrolling"
  return view.replaceAll("-", " ")
}

function reviewWidths(pairs: ReviewPair[]): number[] {
  const widths = new Set(pairs.map(({ width }) => width))
  for (const [, filename] of visualViews()) {
    const view = screenshotInfo(filename)
    if (view) widths.add(Number(view.width))
  }
  return [...widths].sort((left, right) => left - right)
}

async function generate(changedFiles: string[], options: RenderOptions): Promise<void> {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({
      deviceScaleFactor: 2,
      viewport: { height: 1000, width: 1190 },
    })
    await mkdir(output, { recursive: true })
    const pairs: ReviewPair[] = []
    for (const file of changedFiles) {
      pairs.push(...(await renderPairs(page, file, options)))
    }
    await writeReview(
      pairs.map(
        ({ image, label, title, width }) => `![${title} · ${width} px — ${label}](./${image})`
      )
    )
    if (pairs.length > 0) {
      await writeFile(
        path.join(output, "report.html"),
        await visualReviewHtml(pairs, reviewWidths(pairs))
      )
    }
  } finally {
    await browser.close()
  }
}

await rm(path.join(output, "report.html"), { force: true })

const files = await readdir(results, { recursive: true })
const differences = files
  .filter((file) => file.endsWith("-diff.png"))
  .map((file) => file.replace(/-diff\.png$/v, "-actual.png"))
  .sort()

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isRect(value: unknown): value is Rect {
  return (
    isRecord(value) &&
    ["x", "y", "width", "height"].every((key) => {
      const coordinate = value[key]
      return typeof coordinate === "number" && Number.isFinite(coordinate) && coordinate >= 0
    })
  )
}

function isRegion(value: unknown): value is Region {
  return (
    isRecord(value) &&
    isRect(value.before) &&
    isRect(value.after) &&
    typeof value.label === "string" &&
    (value.kind === undefined ||
      (typeof value.kind === "string" && Object.hasOwn(marks, value.kind)))
  )
}

async function readRegions(file: string): Promise<Record<string, Region[]>> {
  const value: unknown = JSON.parse(await readFile(file, "utf8"))
  if (!isRecord(value)) throw new Error("Expected review regions keyed by screenshot name")
  return Object.fromEntries(
    Object.entries(value).map(([name, regions]) => {
      if (!Array.isArray(regions) || !regions.every((region) => isRegion(region)))
        throw new Error(`Invalid review regions for ${name}`)
      return [name, regions]
    })
  )
}

if (differences.length > 0) {
  if (boxScript === undefined || boxScript === "")
    throw new Error("Set SOFTWARE_VISUAL_BOXES to effective-web/scripts/visual-change-boxes.mjs")
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- The pinned effective-web module provides this API.
  const boxes = (await import(pathToFileURL(path.resolve(boxScript)).href)) as ChangeBoxes
  const overrides =
    regionFile === undefined || regionFile === "" ? {} : await readRegions(regionFile)
  await generate(differences, { boxes, overrides })
} else {
  await writeReview([])
}
