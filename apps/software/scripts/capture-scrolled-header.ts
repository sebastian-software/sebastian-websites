import type { Page } from "playwright"

import assert from "node:assert/strict"

const SCROLL_TOLERANCE = 1
const HEADER_SHELL = 'header[data-brand="software"] > div'
const FIRST_PRODUCT_IMAGE = 'main article[aria-labelledby^="product-"]:first-of-type picture img'

/**
 * Captures a real scrolled state with the product artwork partially under the header.
 * @param page - The loaded homepage.
 * @param path - The viewport screenshot path.
 */
export async function captureScrolledHeader(page: Page, path: string): Promise<void> {
  const image = page.locator(FIRST_PRODUCT_IMAGE)
  const header = page.locator(HEADER_SHELL)
  const shell = await header.boundingBox()
  assert.ok(shell, "home: header is visible")
  const overlap = shell.height / 2
  const target = shell.y + overlap
  await image.evaluate((element, top) => {
    window.scrollTo({
      behavior: "instant",
      top: window.scrollY + element.getBoundingClientRect().top - top,
    })
  }, target)
  await page.waitForFunction(
    ({ expectedTop, selector, tolerance }) => {
      const top = document.querySelector(selector)?.getBoundingClientRect().top
      return top !== undefined && Math.abs(top - expectedTop) <= tolerance
    },
    { expectedTop: target, selector: FIRST_PRODUCT_IMAGE, tolerance: SCROLL_TOLERANCE }
  )
  await page.screenshot({ animations: "disabled", path })
}
