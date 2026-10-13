import type { Page } from "playwright"

import type { ProfileDocumentKind } from "../app/lib/untranslated"

const PROJECT_COUNT = 26
const HIGHLIGHT_COUNT = 6
const CONTENT_WIDTH_MM = 160
const MILLIMETERS_PER_INCH = 25.4
const CSS_PIXELS_PER_INCH = 96
const CONTENT_WIDTH = (CONTENT_WIDTH_MM / MILLIMETERS_PER_INCH) * CSS_PIXELS_PER_INCH
const LAYOUT_TOLERANCE = 2

export type WernerProfileLayout = {
  readonly fontsReady: boolean
  readonly highlights: number
  readonly history: boolean
  readonly language: string
  readonly overflow: boolean
  readonly projects: number
  readonly summary: boolean
  readonly width: number
}

/**
 * Rejects incomplete, wrongly localized, or horizontally clipped profile documents.
 * @param layout - Observed print layout.
 * @param kind - Document being printed.
 * @param locale - Expected document language.
 */
export function assertWernerProfileLayout(
  layout: WernerProfileLayout,
  kind: ProfileDocumentKind,
  locale: string
): void {
  const summary = kind !== "project_history"
  const history = kind !== "executive_summary"
  if (layout.language !== locale || !layout.fontsReady)
    throw new Error("Werner profile language or fonts are incorrect.")
  const actual = [layout.summary, layout.history, layout.projects, layout.highlights]
  const expected = [summary, history, history ? PROJECT_COUNT : 0, summary ? HIGHLIGHT_COUNT : 0]
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error("Werner profile document sections are incomplete.")
  }

  if (layout.overflow || Math.abs(layout.width - CONTENT_WIDTH) > LAYOUT_TOLERANCE)
    throw new Error("Werner profile exceeds its A4 content width.")
}

/**
 * Inspects the actual print layout before a PDF is generated.
 * @param page - Loaded browser page.
 * @param kind - Document being printed.
 * @param locale - Expected document language.
 */
export async function inspectWernerProfileLayout(
  page: Page,
  kind: ProfileDocumentKind,
  locale: string
): Promise<void> {
  await page.emulateMedia({ media: "print" })
  const layout = await page.evaluate(() => {
    const article = document.querySelector<HTMLElement>("article[data-werner-profile]")
    if (article === null) throw new Error("Werner profile document is missing.")
    const bounds = article.getBoundingClientRect()
    return {
      fontsReady:
        document.fonts.status === "loaded" &&
        document.fonts.check('16pt "Elena"') &&
        document.fonts.check('11pt "Glober"'),
      highlights: article.querySelectorAll("[data-experience-highlight]").length,
      history: article.querySelector("#werner-history") !== null,
      language: document.documentElement.lang,
      overflow: [...article.querySelectorAll<HTMLElement>("h1, h2, h3, p, table, img")].some(
        (element) => {
          const box = element.getBoundingClientRect()
          return box.left < bounds.left - 2 || box.right > bounds.right + 2
        }
      ),
      projects: article.querySelectorAll("[data-profile-project]").length,
      summary: article.querySelector("#werner-summary") !== null,
      width: bounds.width,
    }
  })
  assertWernerProfileLayout(layout, kind, locale)
}

/**
 * Validates the public text in every generated Werner PDF.
 * @param pageTexts - Extracted PDF pages in reading order.
 * @param kind - Document being verified.
 * @param locale - Expected document language.
 */
export function assertWernerProfilePdfText(
  pageTexts: readonly string[],
  kind: ProfileDocumentKind,
  locale: string
): void {
  const text = pageTexts.join(" ")
  const required = ["Sebastian Werner", "Regrello", "Palamedes", "Core", "Jasy", "Zynga", "qooxdoo"]
  if (kind !== "executive_summary")
    required.push(
      "3Degrees",
      "Azeti",
      "Netze BW",
      "empiriecom",
      "Heidelberg",
      "GE Healthcare",
      "Witt",
      "SWR",
      "INIT",
      "Traton",
      "coliquio",
      "BluePort",
      "Berlitz",
      locale === "de" ? "Baumarktkette" : "DIY Retailer",
      "Cleverbridge",
      "EntertainTV",
      "MAGIX",
      "Telefoniecenter",
      "Unify",
      "studiVZ",
      "Schlund+Partner"
    )
  for (const anchor of required) {
    if (!text.includes(anchor))
      throw new Error(`Werner profile is missing required text: ${anchor}`)
  }
}
