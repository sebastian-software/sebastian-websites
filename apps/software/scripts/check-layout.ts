import type { Locator, Page } from "playwright"

import assert from "node:assert/strict"

const MAX_EDGE_DELTA = 1
const HEADER_SHELL = 'header[data-brand="software"] > div'
const PRODUCT_STORIES = 'main article[aria-labelledby^="product-"]'
const PRODUCT_CARDS = "main > section:first-child article"

type Side = "left" | "right"
type Frame = Readonly<Record<Side, number>>
type LayoutRoute = "/" | "/company" | "/products"
type Placement = readonly [label: string, selector: string, edge: "both" | Side]

const sharedPlacements: readonly Placement[] = [
  ["footer", "footer > div", "both"],
  ["newsletter art", "#newsletter picture img", "left"],
  ["mountain paths", "#newsletter + section picture img", "right"],
]
const contactPhoto: Placement = ["contact photo", "main > section:last-child img", "right"]
const routePlacements: Readonly<Record<LayoutRoute, readonly Placement[]>> = {
  "/": [
    ["founders photograph", "main > figure img", "both"],
    ["first product illustration", `${PRODUCT_STORIES}:first-of-type picture img`, "right"],
    ["second product illustration", `${PRODUCT_STORIES}:nth-of-type(2) picture img`, "left"],
    ["third product illustration", `${PRODUCT_STORIES}:last-of-type picture img`, "right"],
    ["open foundations", '[aria-labelledby="open-foundations"]', "both"],
    ["region map", '[aria-labelledby="company-story"] figure img', "left"],
  ],
  "/company": [
    ["founders photograph", "main > section:first-child > img", "both"],
    ["mission radio", "main > section:nth-of-type(2) picture img", "both"],
    contactPhoto,
  ],
  "/products": [
    ["first card", `${PRODUCT_CARDS}:first-child`, "left"],
    ["last card", `${PRODUCT_CARDS}:last-child`, "right"],
    contactPhoto,
  ],
}

async function bounds(element: Locator, label: string): Promise<Frame> {
  const box = await element.boundingBox()
  assert.ok(box, `${label}: expected a visible element`)
  return { left: box.x, right: box.x + box.width }
}

/**
 * Verifies the shared outer frame and inset text in the rendered Software pages.
 * @param page - The loaded and settled browser page.
 * @param pathname - The route under test.
 * @param compact - Whether the layout is stacked.
 */
export async function checkLayout(
  page: Page,
  pathname: LayoutRoute,
  compact: boolean
): Promise<void> {
  const frame = await bounds(page.locator(HEADER_SHELL), "header")
  const heading = await bounds(page.locator("main h1"), `${pathname}: page heading`)
  assert.ok(heading.left > frame.left, `${pathname}: heading must be inset from the header`)
  const placements = [...sharedPlacements, ...routePlacements[pathname]]
  await Promise.all(
    placements.map(async ([name, selector, edge]) => {
      const label = `${pathname}: ${name}`
      const actual = await bounds(page.locator(selector), label)
      const sides: readonly Side[] = compact || edge === "both" ? ["left", "right"] : [edge]
      for (const side of sides) {
        assert.ok(
          Math.abs(actual[side] - frame[side]) <= MAX_EDGE_DELTA,
          `${label}: ${side} edge at ${actual[side]}px, header at ${frame[side]}px`
        )
      }
    })
  )
}

/**
 * Captures a real scrolled state with the product artwork partially under the header.
 * @param page - The loaded homepage.
 * @param path - The viewport screenshot path.
 */
export async function captureScrolledHeader(page: Page, path: string): Promise<void> {
  const image = page.locator(PRODUCT_STORIES).first().locator("picture img")
  const header = page.locator(HEADER_SHELL)
  const shell = await header.boundingBox()
  assert.ok(shell, "home: header is visible")
  const overlap = shell.height / 2
  const target = shell.y + overlap
  await image.evaluate((element, top) => {
    window.scrollBy(0, element.getBoundingClientRect().top - top)
  }, target)
  const scrolled = await header.boundingBox()
  const art = await image.boundingBox()
  assert.ok(scrolled && art, "home: header and artwork remain visible after scrolling")
  assert.ok(Math.abs(scrolled.y - shell.y) <= MAX_EDGE_DELTA, "home: header sticks while scrolling")
  const bottom = scrolled.y + scrolled.height
  assert.ok(art.y < bottom && art.y + art.height > bottom, "home: artwork intersects the header")
  await page.screenshot({ animations: "disabled", path })
}
