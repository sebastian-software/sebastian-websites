import { getVariant, isVariantId, type VariantId } from "@sebastian-websites/web-core"
import { type ChildProcess, spawn } from "node:child_process"
import { mkdir } from "node:fs/promises"
import { pathToFileURL } from "node:url"
import { type Browser, type BrowserContext, chromium, type Page } from "playwright"

import {
  PROFILE_DOCUMENTS,
  type ProfileDocumentDescriptor,
  type ProfileDocumentKind,
} from "../app/lib/untranslated"

const OUTPUT_DIR = "public"
const DEV_SERVER_READY_TIMEOUT_MS = 30_000
const DEV_SERVER_STOP_TIMEOUT_MS = 5000
const LOCALHOST_URL_PATTERN = /https?:\/\/(?:localhost|127\.0\.0\.1):\d+/v
const MILLIMETERS_PER_INCH = 25.4
const CSS_PIXELS_PER_INCH = 96
const A4_WIDTH_MILLIMETERS = 210
const PROJECT_PROFILE_PAGE_MARGIN_MILLIMETERS = 50
const PROJECT_PROFILE_PRINT_HEIGHT_MILLIMETERS = 245
const PROJECT_PROFILE_WIDTH_CSS_PIXELS =
  ((A4_WIDTH_MILLIMETERS - PROJECT_PROFILE_PAGE_MARGIN_MILLIMETERS) / MILLIMETERS_PER_INCH) *
  CSS_PIXELS_PER_INCH
const PROJECT_PROFILE_HEIGHT_CSS_PIXELS =
  (PROJECT_PROFILE_PRINT_HEIGHT_MILLIMETERS / MILLIMETERS_PER_INCH) * CSS_PIXELS_PER_INCH
const LAYOUT_TOLERANCE_CSS_PIXELS = 2
const A4_HEIGHT_MILLIMETERS = 297
const CONSULTANT_PROFILE_PAGE_MARGIN_MILLIMETERS = 50
/** The executive summary must fit the first sheet's content box. */
const CONSULTANT_PROFILE_SUMMARY_MAX_HEIGHT_CSS_PIXELS =
  ((A4_HEIGHT_MILLIMETERS - CONSULTANT_PROFILE_PAGE_MARGIN_MILLIMETERS) / MILLIMETERS_PER_INCH) *
  CSS_PIXELS_PER_INCH
const EXPECTED_CONSULTANT_PROFILE_SECTIONS = ["summary", "reports", "archive"] as const
const PROJECT_PROFILE_PAGE_COUNT = 5
const PROJECT_PROFILE_PAGE_MARGIN = "25mm"
const EXPECTED_PROJECT_PROFILE_MARKERS = ["1", "2", "3", "4", "5"] as const
const EXPECTED_FIRST_PAGE_SECTIONS = [
  "header",
  "summary",
  "availability",
  "technical-focus",
  "contact",
] as const
const EXPECTED_PROJECT_PROFILE_PAGE_ANCHORS = {
  de: [
    [
      "Senior React & TypeScript Developer · Frontend Architect",
      "Banking und Asset Management",
      "E-Commerce",
      "Enterprise-SaaS",
    ],
    ["Ausgewählte Projektnachweise · Fintech & E-Commerce"],
    ["Ausgewählte Projektnachweise · Enterprise-SaaS & Internationalisierung"],
  ],
  en: [
    [
      "Senior React & TypeScript Developer · Frontend Architect",
      "banking and asset management",
      "e-commerce",
      "enterprise SaaS",
    ],
    ["Selected Project Experience · Fintech & E-Commerce"],
    ["Selected Project Experience · Enterprise SaaS & Internationalization"],
  ],
} as const
const MINIMUM_FIRST_PAGE_SECTION_GAP_CSS_PIXELS = 32
const MINIMUM_PROJECT_GAP_CSS_PIXELS = 40
const MAXIMUM_PAGE_MARKER_BOTTOM_GAP_CSS_PIXELS = 16
const PROJECT_PROFILE_PROJECT_GROUP_COUNT = 3
const PROJECT_PROFILE_CAREER_ENTRY_COUNT = 16
// Vite colorizes its localhost line even on CI runners.
// eslint-disable-next-line no-control-regex, regexp/no-control-character -- ANSI starts with ESC
const ANSI_ESCAPE_PATTERN = /\u001B\[[\d;]*m/gv

export type ProfilePdfPage = {
  readonly definition: ProfileDocumentDescriptor
  readonly kind: ProfileDocumentKind
  readonly locale: string
  readonly outputPath: string
  readonly path: string
}

export type ProjectProfilePageLayout = {
  readonly clientHeight: number
  readonly clientWidth: number
  readonly descendantBottom: number
  readonly descendantLeft: number
  readonly descendantRight: number
  readonly descendantTop: number
  readonly height: number
  readonly left: number
  readonly marker: string
  readonly pageMarkerDisplay: string
  readonly scrollHeight: number
  readonly scrollWidth: number
  readonly text: string
  readonly top: number
  readonly width: number
}

type ProjectProfileSectionBounds = {
  readonly bottom: number
  readonly key: string
  readonly top: number
}

type ProjectProfileAvailabilityItemLayout = {
  readonly bottom: number
  readonly key: string
  readonly left: number
  readonly right: number
  readonly top: number
}

type ProjectProfileDetailGridLayout = {
  readonly key: string
  readonly labelRights: readonly number[]
  readonly labels: readonly string[]
  readonly valueLefts: readonly number[]
}

type ProjectProfileProjectGroupLayout = {
  readonly borderTopWidths: readonly number[]
  readonly gaps: readonly number[]
  readonly page: string
  readonly projectCount: number
  readonly projectHeadings: readonly string[]
}

export type ProjectProfilePrintLayout = {
  readonly availabilityItems: readonly string[]
  readonly availabilityLayout: readonly ProjectProfileAvailabilityItemLayout[]
  readonly careerEntryCount: number
  readonly careerHeading: string
  readonly closingPageFinalContent: ConsultantProfileFinalContent
  readonly closingPageScreens: readonly ProjectProfileClosingScreenLayout[]
  readonly detailGrids: readonly ProjectProfileDetailGridLayout[]
  readonly firstPageBottom: number
  readonly firstPageMarkerBottom: number
  readonly firstPageSections: readonly ProjectProfileSectionBounds[]
  readonly fontsReady: boolean
  readonly language: string
  readonly pageMargin: string
  readonly pages: readonly ProjectProfilePageLayout[]
  readonly projectGroups: readonly ProjectProfileProjectGroupLayout[]
  readonly screenMarkers: readonly ProjectProfileScreenMarker[]
}

export type ProjectProfileClosingScreenLayout = {
  readonly clientWidth: number
  readonly label: string
  readonly scrollWidth: number
  readonly sectionDisplay: string
  readonly sectionHeight: number
  readonly text: string
}

export type ProjectProfileScreenMarker = {
  readonly display: string
  readonly page: string
  readonly text: string
}

export type ConsultantProfileFinalContent = {
  readonly items: ReadonlyArray<{
    readonly kind: string
    readonly text: string
  }>
  readonly profileContentText: string
}

/** A boxed region of the consultant profile and whether its content fits inside it. */
export type ConsultantProfileBoxLayout = {
  readonly clientHeight: number
  readonly key: string
  readonly scrollHeight: number
}

export type ConsultantProfilePrintLayout = {
  readonly boxes: readonly ConsultantProfileBoxLayout[]
  readonly fontsReady: boolean
  readonly headingFontLoaded: boolean
  readonly language: string
  readonly sections: readonly string[]
  readonly summaryHeight: number
  readonly textFontLoaded: boolean
}

/** Hosts the documents may load besides the dev server: brand fonts and shared photos. */
const ASSET_ORIGINS = new Set([
  "https://assets.sebastian-software.com",
  "https://brand.sebastian-software.com",
])

export function getPdfPages(variant: VariantId): readonly ProfilePdfPage[] {
  const site = getVariant(variant)
  return PROFILE_DOCUMENTS.map((definition) => ({
    definition,
    kind: definition.kind,
    locale: site.locale,
    outputPath: `${OUTPUT_DIR}${definition.pdfs[site.locale].href}`,
    path: definition.route,
  }))
}

export function isAllowedBrowserRequest(requestUrl: string, baseUrl: string): boolean {
  const request = new URL(requestUrl)
  const base = new URL(baseUrl)
  return (
    (request.protocol === "http:" || request.protocol === "https:") &&
    (request.origin === base.origin || ASSET_ORIGINS.has(request.origin))
  )
}

function assertNear(actual: number, expected: number, description: string): void {
  if (Math.abs(actual - expected) > LAYOUT_TOLERANCE_CSS_PIXELS) {
    throw new Error(`${description} is ${actual.toFixed(2)}px, expected ${expected.toFixed(2)}px.`)
  }
}

function assertProjectProfilePositioning(layout: ProjectProfilePrintLayout): void {
  const expectedPageAnchors =
    EXPECTED_PROJECT_PROFILE_PAGE_ANCHORS[layout.language === "de" ? "de" : "en"]
  for (const [pageIndex, anchors] of expectedPageAnchors.entries()) {
    const pageText = layout.pages[pageIndex]?.text ?? ""
    for (const anchor of anchors) {
      if (!pageText.includes(anchor)) {
        throw new Error(
          `Project profile page ${String(pageIndex + 1)} does not contain required text: ${anchor}`
        )
      }
    }
  }
}

function assertProjectProfileDocumentLayout(layout: ProjectProfilePrintLayout): void {
  if (!layout.fontsReady) {
    throw new Error("Project profile fonts are not ready.")
  }
  if (layout.language !== "de" && layout.language !== "en") {
    throw new Error(`Project profile language is ${JSON.stringify(layout.language)}.`)
  }
  if (layout.pageMargin !== PROJECT_PROFILE_PAGE_MARGIN) {
    throw new Error(
      `Project profile page margin is ${JSON.stringify(layout.pageMargin)}, expected ${JSON.stringify(PROJECT_PROFILE_PAGE_MARGIN)}.`
    )
  }
  if (layout.pages.length !== PROJECT_PROFILE_PAGE_COUNT) {
    throw new Error(
      `Project profile has ${String(layout.pages.length)} page containers, expected ${String(PROJECT_PROFILE_PAGE_COUNT)}.`
    )
  }

  const markers = layout.pages.map((page) => page.marker)
  if (JSON.stringify(markers) !== JSON.stringify(EXPECTED_PROJECT_PROFILE_MARKERS)) {
    throw new Error(
      `Project profile page markers are ${JSON.stringify(markers)}, expected ${JSON.stringify(EXPECTED_PROJECT_PROFILE_MARKERS)}.`
    )
  }

  assertProjectProfilePositioning(layout)
}

function assertProjectProfilePageLayout(page: ProjectProfilePageLayout, index: number): void {
  const pageNumber = String(index + 1)
  assertNear(
    page.width,
    PROJECT_PROFILE_WIDTH_CSS_PIXELS,
    `Project profile page ${pageNumber} width`
  )
  assertNear(
    page.height,
    PROJECT_PROFILE_HEIGHT_CSS_PIXELS,
    `Project profile page ${pageNumber} height`
  )
  if (page.text.trim().length === 0) {
    throw new Error(`Project profile page ${pageNumber} is empty.`)
  }
  if (page.pageMarkerDisplay !== "none") {
    throw new Error(`Project profile page ${pageNumber} internal marker is visible in print.`)
  }
  if (
    page.scrollWidth > page.clientWidth + LAYOUT_TOLERANCE_CSS_PIXELS ||
    page.scrollHeight > page.clientHeight + LAYOUT_TOLERANCE_CSS_PIXELS
  ) {
    throw new Error(
      `Project profile page ${pageNumber} overflows its A4 content box (${String(page.scrollWidth)}x${String(page.scrollHeight)}px scroll versus ${String(page.clientWidth)}x${String(page.clientHeight)}px client).`
    )
  }
  if (
    page.descendantLeft < page.left - LAYOUT_TOLERANCE_CSS_PIXELS ||
    page.descendantTop < page.top - LAYOUT_TOLERANCE_CSS_PIXELS ||
    page.descendantRight > page.left + page.width + LAYOUT_TOLERANCE_CSS_PIXELS ||
    page.descendantBottom > page.top + page.height + LAYOUT_TOLERANCE_CSS_PIXELS
  ) {
    throw new Error(`Project profile page ${pageNumber} has clipped content.`)
  }
}

function assertProjectProfileFirstPageSections(layout: ProjectProfilePrintLayout): void {
  const firstPageSectionKeys = layout.firstPageSections.map((section) => section.key)
  if (JSON.stringify(firstPageSectionKeys) !== JSON.stringify(EXPECTED_FIRST_PAGE_SECTIONS)) {
    throw new Error(
      `Project profile first-page sections are ${JSON.stringify(firstPageSectionKeys)}, expected ${JSON.stringify(EXPECTED_FIRST_PAGE_SECTIONS)}.`
    )
  }
  for (let index = 1; index < layout.firstPageSections.length; index += 1) {
    const previous = layout.firstPageSections[index - 1]
    const current = layout.firstPageSections[index]
    const gap = current.top - previous.bottom
    if (gap < MINIMUM_FIRST_PAGE_SECTION_GAP_CSS_PIXELS) {
      throw new Error(
        `Project profile first-page gap before ${current.key} is ${gap.toFixed(2)}px, expected at least ${String(MINIMUM_FIRST_PAGE_SECTION_GAP_CSS_PIXELS)}px.`
      )
    }
  }
}

function assertProjectProfileFirstPageMarker(layout: ProjectProfilePrintLayout): void {
  const markerBottomGap = layout.firstPageBottom - layout.firstPageMarkerBottom
  if (
    markerBottomGap < -LAYOUT_TOLERANCE_CSS_PIXELS ||
    markerBottomGap > MAXIMUM_PAGE_MARKER_BOTTOM_GAP_CSS_PIXELS
  ) {
    throw new Error(
      `Project profile first-page marker bottom gap is ${markerBottomGap.toFixed(2)}px, expected bottom alignment without overflow.`
    )
  }
}

function assertProjectProfileAvailability(layout: ProjectProfilePrintLayout): void {
  if (layout.availabilityItems.includes("Sebastian Software GmbH")) {
    throw new Error(
      "Project profile availability renders Sebastian Software GmbH as a standalone duplicate."
    )
  }
  const expectedKeys = ["status", "capacity", "contract", "work-model"]
  const keys = layout.availabilityLayout.map((item) => item.key)
  if (JSON.stringify(keys) !== JSON.stringify(expectedKeys)) {
    throw new Error(
      `Project profile availability items are ${JSON.stringify(keys)}, expected ${JSON.stringify(expectedKeys)}.`
    )
  }
  const [status, capacity, contract, workModel] = layout.availabilityLayout
  assertNear(status.top, capacity.top, "Project profile availability top-row alignment")
  assertNear(status.left, contract.left, "Project profile availability left alignment")
  assertNear(capacity.right, contract.right, "Project profile availability right alignment")
  assertNear(contract.left, workModel.left, "Project profile availability full-row left alignment")
  assertNear(
    contract.right,
    workModel.right,
    "Project profile availability full-row right alignment"
  )
  if (
    contract.top <= Math.max(status.bottom, capacity.bottom) ||
    workModel.top <= contract.bottom
  ) {
    throw new Error("Project profile availability full-width rows are not stacked in order.")
  }
}

function assertProjectProfileDetailGrid(
  grid: ProjectProfileDetailGridLayout,
  expected: { readonly key: string; readonly labels: readonly string[] }
): void {
  if (
    grid.key !== expected.key ||
    JSON.stringify(grid.labels) !== JSON.stringify(expected.labels)
  ) {
    throw new Error(
      `Project profile ${grid.key} labels are ${JSON.stringify(grid.labels)}, expected ${JSON.stringify(expected.labels)}.`
    )
  }
  if (
    grid.labelRights.length !== grid.labels.length ||
    grid.valueLefts.length !== grid.labels.length
  ) {
    throw new Error(`Project profile ${grid.key} definition-list rows are incomplete.`)
  }
  for (const valueLeft of grid.valueLefts.slice(1)) {
    assertNear(valueLeft, grid.valueLefts[0], `Project profile ${grid.key} value alignment`)
  }
  for (const [rowIndex, labelRight] of grid.labelRights.entries()) {
    if (labelRight >= grid.valueLefts[rowIndex]) {
      throw new Error(`Project profile ${grid.key} label overlaps its value.`)
    }
  }
}

function assertProjectProfileDetails(layout: ProjectProfilePrintLayout): void {
  const expected =
    layout.language === "de"
      ? [
          { key: "contact", labels: ["E-Mail", "Telefon", "Standort", "Sprachen"] },
          {
            key: "education-contact",
            labels: ["Abschluss", "E-Mail", "Telefon", "Standort", "Sprachen"],
          },
        ]
      : [
          { key: "contact", labels: ["Email", "Phone", "Location", "Languages"] },
          {
            key: "education-contact",
            labels: ["Degree", "Email", "Phone", "Location", "Languages"],
          },
        ]
  if (layout.detailGrids.length !== expected.length) {
    throw new Error(
      `Project profile has ${String(layout.detailGrids.length)} detail grids, expected ${String(expected.length)}.`
    )
  }
  for (const [index, grid] of layout.detailGrids.entries()) {
    const expectedGrid = expected[index]
    assertProjectProfileDetailGrid(grid, expectedGrid)
  }
}

function projectProfileExpectedDistribution(language: string): ReadonlyArray<{
  readonly page: string
  readonly projectHeadings: readonly string[]
}> {
  if (language === "de") {
    return [
      {
        page: "2",
        projectHeadings: [
          "DWS / MorgenFund · Investment-Management-Plattform",
          "Witt-Gruppe (Otto Group) · Multi-Brand E-Commerce-Plattformen",
          "DWS (Deutsche Bank) · Robo-Advisor Investmentplattform",
        ],
      },
      {
        page: "3",
        projectHeadings: ["Regrello · KI-gestützte Internationalisierung"],
      },
      {
        page: "3",
        projectHeadings: [
          "Terminaro · Produkt der Sebastian Software GmbH · SaaS · Terminbuchungssystem",
          "Palamedes · Produkt der Sebastian Software GmbH · Dev Tools · KI-gestützte Lokalisierungsplattform",
        ],
      },
    ]
  }
  return [
    {
      page: "2",
      projectHeadings: [
        "DWS / MorgenFund · Investment Management Platform",
        "Witt-Gruppe (Otto Group) · Multi-Brand E-Commerce Platforms",
        "DWS (Deutsche Bank) · Robo-Advisor Investment Platform",
      ],
    },
    {
      page: "3",
      projectHeadings: ["Regrello · AI-Powered Internationalization"],
    },
    {
      page: "3",
      projectHeadings: [
        "Terminaro · Product by Sebastian Software GmbH · SaaS · Appointment Booking System",
        "Palamedes · Product by Sebastian Software GmbH · Dev Tools · AI-Powered Localization Platform",
      ],
    },
  ]
}

function assertProjectProfileProjects(layout: ProjectProfilePrintLayout): void {
  if (layout.projectGroups.length !== PROJECT_PROFILE_PROJECT_GROUP_COUNT) {
    throw new Error(
      `Project profile has ${String(layout.projectGroups.length)} project groups, expected ${String(PROJECT_PROFILE_PROJECT_GROUP_COUNT)}.`
    )
  }
  const expectedDistribution = projectProfileExpectedDistribution(layout.language)
  for (const [index, group] of layout.projectGroups.entries()) {
    const expected = expectedDistribution[index]
    if (
      group.page !== expected.page ||
      JSON.stringify(group.projectHeadings) !== JSON.stringify(expected.projectHeadings)
    ) {
      throw new Error(
        `Project profile project group ${String(index + 1)} is on page ${group.page} with headings ${JSON.stringify(group.projectHeadings)}, expected page ${expected.page} with headings ${JSON.stringify(expected.projectHeadings)}.`
      )
    }
    const expectedProjectCount = expected.projectHeadings.length
    if (
      group.projectCount !== expectedProjectCount ||
      group.borderTopWidths.length !== expectedProjectCount ||
      group.borderTopWidths.some((width) => width > 0)
    ) {
      throw new Error("Project profile project separators must not use top borders.")
    }
    if (
      group.gaps.length !== Math.max(0, expectedProjectCount - 1) ||
      group.gaps.some((gap) => gap < MINIMUM_PROJECT_GAP_CSS_PIXELS)
    ) {
      throw new Error(
        `Project profile project gaps are ${JSON.stringify(group.gaps)}, expected ${String(Math.max(0, expectedProjectCount - 1))} gaps of at least ${String(MINIMUM_PROJECT_GAP_CSS_PIXELS)}px.`
      )
    }
  }
}

function assertProjectProfileCareer(layout: ProjectProfilePrintLayout): void {
  if (layout.careerEntryCount !== PROJECT_PROFILE_CAREER_ENTRY_COUNT) {
    throw new Error(
      `Project profile career history has ${String(layout.careerEntryCount)} entries, expected ${String(PROJECT_PROFILE_CAREER_ENTRY_COUNT)}.`
    )
  }
  const expectedHeading =
    layout.language === "de"
      ? "Weitere Stationen · vollständige Laufbahn"
      : "Further experience · complete career history"
  if (layout.careerHeading !== expectedHeading) {
    throw new Error(
      `Project profile career heading is ${JSON.stringify(layout.careerHeading)}, expected ${JSON.stringify(expectedHeading)}.`
    )
  }
}

function assertProjectProfileClosingPage(layout: ProjectProfilePrintLayout): void {
  assertConsultantProfileFinalContent(layout.closingPageFinalContent, layout.language)
  const labels = layout.closingPageScreens.map((screen) => screen.label)
  if (JSON.stringify(labels) !== JSON.stringify(["desktop", "mobile"])) {
    throw new Error(
      `Project profile closing-page screen layouts are ${JSON.stringify(labels)}, expected ["desktop","mobile"].`
    )
  }
  for (const screen of layout.closingPageScreens) {
    if (
      screen.text.trim().length === 0 ||
      screen.sectionDisplay === "none" ||
      screen.sectionHeight <= LAYOUT_TOLERANCE_CSS_PIXELS
    ) {
      throw new Error(`Project profile closing page is blank in the ${screen.label} preview.`)
    }
    if (screen.scrollWidth > screen.clientWidth + LAYOUT_TOLERANCE_CSS_PIXELS) {
      throw new Error(`Project profile closing page overflows in the ${screen.label} preview.`)
    }
  }
}

function assertProjectProfileScreenMarkers(layout: ProjectProfilePrintLayout): void {
  const pages = layout.screenMarkers.map((marker) => marker.page)
  if (JSON.stringify(pages) !== JSON.stringify(EXPECTED_PROJECT_PROFILE_MARKERS)) {
    throw new Error(
      `Project profile screen markers are ${JSON.stringify(pages)}, expected ${JSON.stringify(EXPECTED_PROJECT_PROFILE_MARKERS)}.`
    )
  }
  for (const marker of layout.screenMarkers) {
    if (marker.display === "none" || !marker.text.endsWith(`${marker.page} / 5`)) {
      throw new Error(`Project profile screen marker ${marker.page} is missing or incorrect.`)
    }
  }
}

export function assertProjectProfilePrintLayout(layout: ProjectProfilePrintLayout): void {
  assertProjectProfileDocumentLayout(layout)
  for (const [index, page] of layout.pages.entries()) {
    assertProjectProfilePageLayout(page, index)
  }
  assertProjectProfileFirstPageSections(layout)
  assertProjectProfileFirstPageMarker(layout)
  assertProjectProfileAvailability(layout)
  assertProjectProfileDetails(layout)
  assertProjectProfileProjects(layout)
  assertProjectProfileCareer(layout)
  assertProjectProfileClosingPage(layout)
  assertProjectProfileScreenMarkers(layout)
}

export function assertConsultantProfileLayout(
  layout: ConsultantProfilePrintLayout,
  locale: string
): void {
  if (layout.language !== locale) {
    throw new Error(
      `Consultant profile language is ${JSON.stringify(layout.language)}, expected ${JSON.stringify(locale)}.`
    )
  }
  if (!layout.fontsReady || !layout.headingFontLoaded || !layout.textFontLoaded) {
    throw new Error("Consultant profile fonts Elena and Glober are not loaded.")
  }
  if (JSON.stringify(layout.sections) !== JSON.stringify(EXPECTED_CONSULTANT_PROFILE_SECTIONS)) {
    throw new Error(
      `Consultant profile sections are ${JSON.stringify(layout.sections)}, expected ${JSON.stringify(EXPECTED_CONSULTANT_PROFILE_SECTIONS)}.`
    )
  }
  if (
    layout.summaryHeight >
    CONSULTANT_PROFILE_SUMMARY_MAX_HEIGHT_CSS_PIXELS + LAYOUT_TOLERANCE_CSS_PIXELS
  ) {
    throw new Error(
      `Consultant profile summary is ${layout.summaryHeight.toFixed(2)}px high and overflows the first A4 page (${CONSULTANT_PROFILE_SUMMARY_MAX_HEIGHT_CSS_PIXELS.toFixed(2)}px).`
    )
  }
  for (const box of layout.boxes) {
    if (box.scrollHeight > box.clientHeight + LAYOUT_TOLERANCE_CSS_PIXELS) {
      throw new Error(`Consultant profile box ${box.key} clips its content.`)
    }
  }
}

function assertConsultantProfilePermissionContent(
  permission: ConsultantProfileFinalContent["items"][number],
  locale: string
): void {
  const expectedPermission =
    locale === "de"
      ? "Dieses Profil darf für Projektanfragen und -angebote weitergegeben, genutzt und gespeichert werden."
      : "This profile may be shared, used, and stored for project inquiries and proposals."
  if (permission.text !== expectedPermission) {
    throw new Error(
      `Consultant profile permission content is ${JSON.stringify(permission.text)}, expected ${JSON.stringify(expectedPermission)}.`
    )
  }
}

export function assertConsultantProfileFinalContent(
  content: ConsultantProfileFinalContent,
  locale: string
): void {
  const kinds = content.items.map((item) => item.kind)
  const expectedKinds = ["permission", "last-updated", "copyright"]
  if (JSON.stringify(kinds) !== JSON.stringify(expectedKinds)) {
    throw new Error(
      `Consultant profile final content order is ${JSON.stringify(kinds)}, expected ${JSON.stringify(expectedKinds)}.`
    )
  }
  const [permission, lastUpdated, copyright] = content.items
  if (content.items.some((item) => item.text.length === 0)) {
    throw new Error("Consultant profile final content blocks must be non-empty.")
  }
  assertConsultantProfilePermissionContent(permission, locale)
  const expectedLastUpdatedPrefix = locale === "de" ? "Stand:" : "As of:"
  if (!lastUpdated.text.startsWith(expectedLastUpdatedPrefix)) {
    throw new Error(
      `Consultant profile last-updated text is ${JSON.stringify(lastUpdated.text)}, expected prefix ${JSON.stringify(expectedLastUpdatedPrefix)}.`
    )
  }
  if (!copyright.text.startsWith("© ")) {
    throw new Error(`Consultant profile copyright text is ${JSON.stringify(copyright.text)}.`)
  }
  if (!content.profileContentText.trimEnd().endsWith(copyright.text)) {
    throw new Error("Consultant profile copyright is not the final profile content block.")
  }
}

async function inspectProjectProfileClosingScreen(
  browserPage: Page,
  viewport: { readonly height: number; readonly label: string; readonly width: number }
): Promise<ProjectProfileClosingScreenLayout> {
  await browserPage.setViewportSize({ height: viewport.height, width: viewport.width })
  await browserPage.emulateMedia({ media: "screen" })
  return browserPage.evaluate((label) => {
    const closingPage = document.querySelector<HTMLElement>('[data-project-profile-page="5"]')
    const finalSection = closingPage?.querySelector<HTMLElement>("[data-profile-final-section]")
    if (closingPage === null || finalSection === null || finalSection === undefined) {
      throw new Error("Project profile closing-page screen hooks are missing.")
    }
    return {
      clientWidth: closingPage.clientWidth,
      label,
      scrollWidth: closingPage.scrollWidth,
      sectionDisplay: getComputedStyle(finalSection).display,
      sectionHeight: finalSection.getBoundingClientRect().height,
      text: finalSection.innerText,
    }
  }, viewport.label)
}

async function inspectProjectProfileComponentLayout(browserPage: Page): Promise<{
  readonly detailGrids: readonly ProjectProfileDetailGridLayout[]
  readonly projectGroups: readonly ProjectProfileProjectGroupLayout[]
}> {
  const detailGrids = await browserPage.evaluate(() => {
    const measuredDetailGrids: ProjectProfileDetailGridLayout[] = []
    for (const grid of document.querySelectorAll<HTMLElement>("[data-project-profile-details]")) {
      const labelRights: number[] = []
      const labels: string[] = []
      const valueLefts: number[] = []
      for (const label of grid.querySelectorAll<HTMLElement>(":scope > dt")) {
        labelRights.push(label.getBoundingClientRect().right)
        labels.push(label.innerText.trim())
      }
      for (const value of grid.querySelectorAll<HTMLElement>(":scope > dd")) {
        valueLefts.push(value.getBoundingClientRect().left)
      }
      measuredDetailGrids.push({
        key: grid.dataset.projectProfileDetails ?? "",
        labelRights,
        labels,
        valueLefts,
      })
    }
    return measuredDetailGrids
  })
  const projectGroups = await browserPage.evaluate(() => {
    const measuredProjectGroups: ProjectProfileProjectGroupLayout[] = []
    for (const grid of document.querySelectorAll<HTMLElement>("[data-project-profile-projects]")) {
      const projects = [...grid.querySelectorAll<HTMLElement>(":scope > article")]
      const borderTopWidths: number[] = []
      const gaps: number[] = []
      for (const project of projects) {
        borderTopWidths.push(Number.parseFloat(getComputedStyle(project).borderTopWidth))
      }
      for (let index = 1; index < projects.length; index += 1) {
        const previous = projects[index - 1]
        const project = projects[index]
        gaps.push(project.getBoundingClientRect().top - previous.getBoundingClientRect().bottom)
      }
      const page = grid.closest<HTMLElement>("[data-project-profile-page]")
      measuredProjectGroups.push({
        borderTopWidths,
        gaps,
        page: page?.dataset.projectProfilePage ?? "",
        projectCount: projects.length,
        projectHeadings: projects.map(
          (project) => project.querySelector<HTMLElement>("h3")?.innerText.trim() ?? ""
        ),
      })
    }
    return measuredProjectGroups
  })
  return { detailGrids, projectGroups }
}

async function inspectProjectProfileLayout(browserPage: Page, locale: string): Promise<void> {
  await browserPage.emulateMedia({ media: "print" })
  const documentLayout = await browserPage.evaluate(() => {
    const pageMargin = [...document.styleSheets]
      .filter(
        (styleSheet) =>
          (styleSheet.href === null ||
            new URL(styleSheet.href).origin === globalThis.location.origin) &&
          !styleSheet.disabled &&
          (styleSheet.media.length === 0 ||
            globalThis.matchMedia(styleSheet.media.mediaText).matches)
      )
      .flatMap((styleSheet) => [...styleSheet.cssRules])
      .filter(
        (rule): rule is CSSPageRule =>
          rule instanceof CSSPageRule && rule.selectorText.trim() === ""
      )
      .map((rule) => rule.style.margin.trim())
      .findLast((margin) => margin.length > 0)
    const pageElements = [...document.querySelectorAll<HTMLElement>("[data-project-profile-page]")]
    const pages = pageElements.map((element) => {
      const rect = element.getBoundingClientRect()
      let descendantBottom = rect.bottom
      let descendantLeft = rect.left
      let descendantRight = rect.right
      let descendantTop = rect.top
      for (const child of element.querySelectorAll<HTMLElement>("*")) {
        if (getComputedStyle(child).display === "none") continue
        const childRect = child.getBoundingClientRect()
        descendantBottom = Math.max(descendantBottom, childRect.bottom)
        descendantLeft = Math.min(descendantLeft, childRect.left)
        descendantRight = Math.max(descendantRight, childRect.right)
        descendantTop = Math.min(descendantTop, childRect.top)
      }
      return {
        clientHeight: element.clientHeight,
        clientWidth: element.clientWidth,
        descendantBottom,
        descendantLeft,
        descendantRight,
        descendantTop,
        height: rect.height,
        left: rect.left,
        marker: element.dataset.projectProfilePage ?? "",
        pageMarkerDisplay: getComputedStyle(
          element.querySelector<HTMLElement>("[data-project-profile-marker]") ?? element
        ).display,
        scrollHeight: element.scrollHeight,
        scrollWidth: element.scrollWidth,
        text: element.innerText,
        top: rect.top,
        width: rect.width,
      }
    })
    return {
      fontsReady: document.fonts.status === "loaded",
      language: document.documentElement.lang,
      pageMargin: pageMargin ?? "",
      pages,
    }
  })
  const firstPageLayout = await browserPage.evaluate(() => {
    const firstPage = document.querySelector<HTMLElement>('[data-project-profile-page="1"]')
    if (firstPage === null) throw new Error("Project profile first page is missing.")
    const firstPageSections = [
      ...firstPage.querySelectorAll<HTMLElement>("[data-project-profile-section]"),
    ].map((section) => {
      const rect = section.getBoundingClientRect()
      return {
        bottom: rect.bottom,
        key: section.dataset.projectProfileSection ?? "",
        top: rect.top,
      }
    })
    const availabilityItems = [
      ...firstPage.querySelectorAll<HTMLElement>(
        '[data-project-profile-section="availability"] > *'
      ),
    ].map((item) => item.innerText.trim())
    const availabilityLayout = [
      ...firstPage.querySelectorAll<HTMLElement>("[data-project-profile-availability-item]"),
    ].map((item) => {
      const rect = item.getBoundingClientRect()
      return {
        bottom: rect.bottom,
        key: item.dataset.projectProfileAvailabilityItem ?? "",
        left: rect.left,
        right: rect.right,
        top: rect.top,
      }
    })
    return {
      availabilityItems,
      availabilityLayout,
      firstPageSections,
    }
  })
  const finalPageLayout = await browserPage.evaluate(() => {
    const finalPage = document.querySelector<HTMLElement>('[data-project-profile-page="4"]')
    if (finalPage === null) throw new Error("Project profile final page is missing.")
    const career = finalPage.querySelector<HTMLElement>(
      '[data-project-profile-section="career-history"]'
    )
    if (career === null) {
      throw new Error("Project profile final-page layout measurement hooks are missing.")
    }
    const careerHeading = career.querySelector<HTMLElement>("h2")
    if (careerHeading === null) throw new Error("Project profile career heading is missing.")
    return {
      careerEntryCount: career.querySelectorAll("li").length,
      careerHeading: careerHeading.innerText.trim(),
    }
  })
  const componentLayout = await inspectProjectProfileComponentLayout(browserPage)
  const closingPageFinalContent = await browserPage.evaluate(() => {
    const closingPage = document.querySelector<HTMLElement>('[data-project-profile-page="5"]')
    const finalSection = closingPage?.querySelector<HTMLElement>("[data-profile-final-section]")
    if (closingPage === null || finalSection === null || finalSection === undefined) {
      throw new Error("Project profile closing page is missing its final contact section.")
    }
    const items = [...finalSection.querySelectorAll<HTMLElement>("[data-profile-final-text]")].map(
      (item) => ({
        kind: item.dataset.profileFinalText ?? "",
        text: item.innerText.trim(),
      })
    )
    return { items, profileContentText: finalSection.innerText }
  })
  const desktopClosingPage = await inspectProjectProfileClosingScreen(browserPage, {
    height: 900,
    label: "desktop",
    width: 1024,
  })
  const screenLayout = await browserPage.evaluate(() => {
    const firstPage = document.querySelector<HTMLElement>('[data-project-profile-page="1"]')
    const markers = [...document.querySelectorAll<HTMLElement>("[data-project-profile-marker]")]
    const marker = markers.at(0)
    if (firstPage === null || marker === undefined) {
      throw new Error("Project profile first-page screen marker is missing.")
    }
    const firstPageStyle = getComputedStyle(firstPage)
    return {
      firstPageBottom:
        firstPage.getBoundingClientRect().bottom - Number.parseFloat(firstPageStyle.paddingBottom),
      firstPageMarkerBottom: marker.getBoundingClientRect().bottom,
      screenMarkers: markers.map((item) => ({
        display: getComputedStyle(item).display,
        page: item.dataset.projectProfileMarker ?? "",
        text: item.innerText.trim(),
      })),
    }
  })
  const closingPageScreens = [
    desktopClosingPage,
    await inspectProjectProfileClosingScreen(browserPage, {
      height: 844,
      label: "mobile",
      width: 390,
    }),
  ]
  await browserPage.emulateMedia({ media: "print" })
  const layout: ProjectProfilePrintLayout = {
    ...documentLayout,
    ...firstPageLayout,
    ...screenLayout,
    ...finalPageLayout,
    ...componentLayout,
    closingPageFinalContent,
    closingPageScreens,
  }
  if (layout.language !== locale) {
    throw new Error(
      `Project profile language is ${JSON.stringify(layout.language)}, expected ${JSON.stringify(locale)}.`
    )
  }
  assertProjectProfilePrintLayout(layout)
}

async function inspectConsultantProfile(browserPage: Page, locale: string): Promise<void> {
  await browserPage.emulateMedia({ media: "print" })
  const layout = await browserPage.evaluate(() => {
    const profile = document.querySelector<HTMLElement>("article")
    if (profile === null) throw new Error("Consultant profile document is missing.")
    const summary = profile.querySelector<HTMLElement>('[data-profile-page="summary"]')
    return {
      boxes: [...profile.querySelectorAll<HTMLElement>("[data-profile-box]")].map((box) => ({
        clientHeight: box.clientHeight,
        key: box.dataset.profileBox ?? "",
        scrollHeight: box.scrollHeight,
      })),
      fontsReady: document.fonts.status === "loaded",
      headingFontLoaded: document.fonts.check('16pt "Elena"'),
      language: document.documentElement.lang,
      sections: [
        ...(summary === null ? [] : ["summary"]),
        ...[...profile.querySelectorAll<HTMLElement>("[data-profile-section]")].map(
          (section) => section.dataset.profileSection ?? ""
        ),
      ],
      summaryHeight: summary?.getBoundingClientRect().height ?? 0,
      textFontLoaded: document.fonts.check('11pt "Glober"'),
    }
  })
  assertConsultantProfileLayout(layout, locale)
  const content = await browserPage.evaluate(() => {
    const profile = document.querySelector<HTMLElement>("article")
    if (profile === null) throw new Error("Consultant profile document is missing.")
    const items = [...profile.querySelectorAll<HTMLElement>("[data-profile-final-text]")].map(
      (item) => ({
        kind: item.dataset.profileFinalText ?? "",
        text: item.innerText.trim(),
      })
    )
    return { items, profileContentText: profile.innerText }
  })
  assertConsultantProfileFinalContent(content, locale)
}

async function inspectProfilePage(browserPage: Page, page: ProfilePdfPage): Promise<void> {
  await (page.kind === "project_profile"
    ? inspectProjectProfileLayout(browserPage, page.locale)
    : inspectConsultantProfile(browserPage, page.locale))
}

async function generateSinglePdf(
  context: BrowserContext,
  baseUrl: string,
  page: ProfilePdfPage
): Promise<void> {
  const browserPage = await context.newPage()
  const url = `${baseUrl}${page.path}`
  console.log(`Generating ${page.outputPath} from ${url}...`)

  try {
    await browserPage.goto(url, { waitUntil: "networkidle" })
    await browserPage.evaluate(async () => document.fonts.ready)
    await inspectProfilePage(browserPage, page)
    await browserPage.pdf({
      format: "A4",
      path: page.outputPath,
      preferCSSPageSize: true,
      printBackground: true,
    })
    console.log(`Created ${page.outputPath}`)
  } finally {
    await browserPage.close()
  }
}

async function startDevelopmentServer(): Promise<{ baseUrl: string; process: ChildProcess }> {
  const developmentServer = spawn("pnpm", ["dev"], {
    detached: process.platform !== "win32",
    env: { ...process.env, FORCE_COLOR: "0", NO_COLOR: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  })
  let output = ""

  const baseUrl = await new Promise<string>((resolve, reject) => {
    let settled = false
    const settle = (callback: () => void) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      developmentServer.stdout.off("data", onData)
      developmentServer.stderr.off("data", onData)
      developmentServer.off("error", onError)
      developmentServer.off("exit", onExit)
      callback()
    }
    const onData = (chunk: Buffer) => {
      const text = chunk.toString()
      output += text
      process.stdout.write(text)
      const match = LOCALHOST_URL_PATTERN.exec(output.replaceAll(ANSI_ESCAPE_PATTERN, ""))
      if (match) {
        settle(() => {
          resolve(match[0])
        })
      }
    }
    const onError = (error: Error) => {
      settle(() => {
        reject(error)
      })
    }
    const onExit = (code: null | number, signal: NodeJS.Signals | null) => {
      settle(() => {
        reject(
          new Error(`Dev server exited before becoming ready (code ${code}, signal ${signal}).`)
        )
      })
    }
    const timeout = setTimeout(() => {
      settle(() => {
        reject(
          new Error(
            `Dev server did not print a localhost URL within ${DEV_SERVER_READY_TIMEOUT_MS}ms.`
          )
        )
      })
    }, DEV_SERVER_READY_TIMEOUT_MS)
    developmentServer.stdout.on("data", onData)
    developmentServer.stderr.on("data", onData)
    developmentServer.on("error", onError)
    developmentServer.on("exit", onExit)
  })

  console.log(`Using dev server at ${baseUrl}`)
  return { baseUrl, process: developmentServer }
}

function terminateDevelopmentServer(developmentServer: ChildProcess, signal: NodeJS.Signals): void {
  if (process.platform === "win32" || developmentServer.pid === undefined) {
    developmentServer.kill(signal)
    return
  }
  process.kill(-developmentServer.pid, signal)
}

async function stopDevelopmentServer(developmentServer: ChildProcess): Promise<void> {
  if (developmentServer.exitCode !== null || developmentServer.signalCode !== null) return
  const exited = new Promise<void>((resolve) => {
    developmentServer.once("exit", () => {
      resolve()
    })
  })
  terminateDevelopmentServer(developmentServer, "SIGTERM")
  await Promise.race([
    exited,
    new Promise<void>((resolve) => {
      setTimeout(() => {
        if (developmentServer.exitCode === null && developmentServer.signalCode === null) {
          terminateDevelopmentServer(developmentServer, "SIGKILL")
        }
        resolve()
      }, DEV_SERVER_STOP_TIMEOUT_MS)
    }),
  ])
}

async function generatePdfs(variant: VariantId): Promise<void> {
  await mkdir(`${OUTPUT_DIR}/pdfs`, { recursive: true })
  const developmentServer = await startDevelopmentServer()
  let browser: Browser | undefined
  try {
    browser = await chromium.launch()
    const context = await browser.newContext()
    const blockedRequests: string[] = []
    await context.route("**/*", async (route) => {
      const requestUrl = route.request().url()
      if (isAllowedBrowserRequest(requestUrl, developmentServer.baseUrl)) {
        await route.continue()
      } else {
        blockedRequests.push(requestUrl)
        await route.abort("blockedbyclient")
      }
    })

    await generatePdfPages({
      baseUrl: developmentServer.baseUrl,
      blockedRequests,
      context,
      pages: getPdfPages(variant),
    })
    console.log("PDF generation complete.")
  } finally {
    try {
      await browser?.close()
    } finally {
      await stopDevelopmentServer(developmentServer.process)
    }
  }
}

async function generatePdfPages({
  baseUrl,
  blockedRequests,
  context,
  pages,
}: {
  readonly baseUrl: string
  readonly blockedRequests: string[]
  readonly context: BrowserContext
  readonly pages: readonly ProfilePdfPage[]
}): Promise<void> {
  for (const page of pages) {
    const blockedBefore = blockedRequests.length
    // eslint-disable-next-line no-await-in-loop -- keep browser memory bounded on CI
    await generateSinglePdf(context, baseUrl, page)
    const pageViolations = blockedRequests.slice(blockedBefore)
    if (pageViolations.length > 0) {
      const violations = pageViolations.map((url) => `- ${url}`).join("\n")
      throw new Error(`PDF rendering attempted external requests:\n${violations}`)
    }
  }
}

async function main(): Promise<void> {
  const value = process.env.SITE_VARIANT
  if (!isVariantId(value) || getVariant(value).site !== "consulting") {
    throw new Error(`Unknown Consulting site variant ${JSON.stringify(value)}.`)
  }
  await generatePdfs(value)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await main()
  } catch (error: unknown) {
    console.error("PDF generation failed:", error)
    process.exit(1)
  }
}
