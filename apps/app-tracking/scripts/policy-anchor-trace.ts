/* eslint-disable unicorn/prefer-global-this -- Init scripts execute in the page's Window. */
import type { BrowserContext, Page } from "playwright"

type Rectangle = Pick<DOMRect, "bottom" | "height" | "left" | "right" | "top" | "width" | "x" | "y">
type AnchorGeometry = { readonly header: DOMRect | undefined; readonly section: DOMRect }
type Viewport = { readonly height: number; readonly name: string; readonly width: number }
type DocumentEvent = {
  readonly at: number
  readonly event: string
  readonly fonts: FontFaceSetLoadStatus
  readonly hash: string
  readonly height: number
  readonly readyState: DocumentReadyState
  readonly scrollY: number
  readonly targetPresent: boolean
  readonly width: number
}
type DocumentSnapshot = {
  readonly at: number
  readonly documentId: string
  readonly droppedEvents: number
  readonly events: readonly DocumentEvent[]
  readonly fonts: { readonly readyAt: null | number; readonly status: FontFaceSetLoadStatus }
  readonly hash: string
  readonly header: null | Rectangle
  readonly heading: null | Rectangle
  readonly locale: string
  readonly navigation: {
    readonly domContentLoadedEventEnd: number
    readonly domInteractive: number
    readonly loadEventEnd: number
    readonly type: string
  } | null
  readonly readyState: DocumentReadyState
  readonly scrollPadding: string
  readonly scrollPaddingTop: string
  readonly scrollY: number
  readonly section: null | Rectangle
  readonly timeOrigin: number
  readonly totalEvents: number
  readonly url: string
  readonly viewport: { readonly height: number; readonly width: number }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- Window augmentation requires an interface.
  interface Window {
    policyAnchorDiagnostics?: { snapshot: (geometry?: AnchorGeometry) => DocumentSnapshot }
  }
}

// Self-contained for addInitScript: bounded passive observations, no font or layout waits.
function installDocumentTrace(): void {
  try {
    if (window !== window.top) return
    const limits = { events: 24, text: 240 }
    const events: DocumentEvent[] = []
    const documentId = crypto.randomUUID()
    let totalEvents = 0
    let readyAt: null | number = null
    function record(event: string): void {
      try {
        totalEvents += 1
        events.push({
          at: performance.now(),
          event,
          fonts: document.fonts.status,
          hash: location.hash.slice(0, limits.text),
          height: window.innerHeight,
          readyState: document.readyState,
          scrollY: window.scrollY,
          targetPresent: document.getElementById("tool-usage-reports") !== null,
          width: window.innerWidth,
        })
        if (events.length > limits.events) events.shift()
      } catch {
        // Passive diagnostics must not surface as application page errors.
      }
    }
    // oxlint-disable-next-line unicorn/consistent-function-scoping -- Playwright serializes the containing init script.
    function rectangle(value: DOMRect | undefined): null | Rectangle {
      if (!value) return null
      const { bottom, height, left, right, top, width, x, y } = value
      return { bottom, height, left, right, top, width, x, y }
    }
    function observeFonts(): void {
      void document.fonts.ready.then(
        () => {
          readyAt = performance.now()
          record("fonts-ready")
        },
        () => {
          record("fonts-ready-rejected")
        }
      )
    }
    window.policyAnchorDiagnostics = {
      snapshot(geometry) {
        const section = document.getElementById("tool-usage-reports")
        const root = getComputedStyle(document.documentElement)
        const [entry] = performance.getEntriesByType("navigation")
        const navigation = entry instanceof PerformanceNavigationTiming ? entry : undefined
        record(geometry ? "anchor-assertion" : "snapshot")
        return {
          at: performance.now(),
          documentId,
          droppedEvents: totalEvents - events.length,
          events: [...events],
          fonts: { readyAt, status: document.fonts.status },
          hash: location.hash.slice(0, limits.text),
          header: rectangle(
            geometry ? geometry.header : document.querySelector("header")?.getBoundingClientRect()
          ),
          heading: rectangle(section?.querySelector("h2")?.getBoundingClientRect()),
          locale: document.documentElement.lang.slice(0, limits.text),
          navigation: navigation
            ? {
                domContentLoadedEventEnd: navigation.domContentLoadedEventEnd,
                domInteractive: navigation.domInteractive,
                loadEventEnd: navigation.loadEventEnd,
                type: navigation.type,
              }
            : null,
          readyState: document.readyState,
          scrollPadding: root.scrollPadding.slice(0, limits.text),
          scrollPaddingTop: root.scrollPaddingTop.slice(0, limits.text),
          scrollY: window.scrollY,
          section: rectangle(geometry ? geometry.section : section?.getBoundingClientRect()),
          timeOrigin: performance.timeOrigin,
          totalEvents,
          url: `${location.origin}${location.pathname}${location.hash}`.slice(0, limits.text),
          viewport: { height: window.innerHeight, width: window.innerWidth },
        }
      },
    }
    function observeLifecycle(): void {
      document.addEventListener(
        "readystatechange",
        () => {
          record("readystatechange")
        },
        {
          passive: true,
        }
      )
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          record("DOMContentLoaded")
        },
        {
          passive: true,
        }
      )
      for (const event of [
        "load",
        "pageshow",
        "pagehide",
        "hashchange",
        "popstate",
        "resize",
        "scroll",
      ]) {
        window.addEventListener(
          event,
          () => {
            record(event)
          },
          { passive: true }
        )
      }
      document.fonts.addEventListener("loading", () => {
        readyAt = null
        record("fonts-loading")
        observeFonts()
      })
      document.fonts.addEventListener("loadingdone", () => {
        record("fonts-loadingdone")
      })
      document.fonts.addEventListener("loadingerror", () => {
        record("fonts-loadingerror")
      })
    }
    observeLifecycle()
    record("init")
    observeFonts()
  } catch {
    // Observer setup failures must not become application page errors.
  }
}

const errorNameLimit = 80
const caseEventLimit = 8
const navigationTimeout = 10_000

// Error names only: arbitrary exception messages can contain page or network contents.
function errorName(error: unknown): string {
  return error instanceof Error ? error.name.slice(0, errorNameLimit) : "unknown"
}

export function logPolicyTrace(status: string, value: object): void {
  try {
    console.log(`POLICY_ANCHOR_${status} ${JSON.stringify(value)}`)
  } catch {
    // Serialization or stdout errors cannot change the browser check's result.
  }
}

export async function installPolicyTrace(page: Page): Promise<void> {
  try {
    await page.addInitScript(installDocumentTrace)
  } catch (error) {
    logPolicyTrace("DIAGNOSTIC_ERROR", { error: errorName(error), stage: "install" })
  }
}

type AnchorObservation = {
  readonly belowHeader: boolean
  readonly diagnosticError?: string
  readonly header: null | Rectangle
  readonly section: null | Rectangle
  readonly snapshot?: DocumentSnapshot
}

export function policyCase(locale: string, viewport: Viewport, attempt: number) {
  const events: Array<{ at: number; event: string; status?: null | number }> = []
  let assertion: AnchorObservation | undefined
  const identity = {
    attempt,
    case: `${locale}/${viewport.name}/reused-page`,
    locale,
    page: `${locale}/official-policy`,
    pageReuse: viewport.name === "mobile" ? "resized-after-desktop" : "fresh-desktop",
    viewport,
  }
  return {
    assertion(observation: AnchorObservation): void {
      assertion = observation
    },
    event(event: string, status?: null | number): void {
      if (events.length < caseEventLimit) events.push({ at: Date.now(), event, status })
    },
    async report(page: Page, status: "FAILURE" | "PASS", failure?: unknown): Promise<void> {
      let snapshot = assertion?.snapshot
      let diagnosticError: string | undefined
      if (!assertion) {
        try {
          snapshot = await page.evaluate(() => window.policyAnchorDiagnostics?.snapshot())
          if (!snapshot) diagnosticError = "observer-unavailable"
        } catch (error) {
          diagnosticError = errorName(error)
        }
      }
      logPolicyTrace(status, {
        ...identity,
        assertion,
        diagnosticError,
        error: failure === undefined ? undefined : errorName(failure),
        events,
        snapshot: assertion ? undefined : snapshot,
      })
    },
  }
}

// This observation follows the original mobile result and never supplies its verdict.
export async function observeFreshMobile(
  context: BrowserContext,
  {
    locale,
    url,
    viewport,
  }: { readonly locale: string; readonly url: string; readonly viewport: undefined | Viewport }
): Promise<void> {
  if (viewport?.name !== "mobile") return
  let page: Page | undefined
  const identity = {
    case: `${locale}/mobile/fresh-page-observation`,
    locale,
    page: `${locale}/official-policy/fresh-mobile`,
    supplemental: true,
    viewport,
  }
  try {
    page = await context.newPage()
    page.setDefaultNavigationTimeout(navigationTimeout)
    await installPolicyTrace(page)
    await page.setViewportSize(viewport)
    await page.goto(url, { waitUntil: "networkidle" })
    const snapshot = await page.evaluate(() => window.policyAnchorDiagnostics?.snapshot())
    logPolicyTrace("OBSERVATION", {
      ...identity,
      diagnosticError: snapshot ? undefined : "observer-unavailable",
      snapshot,
    })
  } catch (error) {
    logPolicyTrace("DIAGNOSTIC_ERROR", { ...identity, error: errorName(error) })
  } finally {
    try {
      await page?.close()
    } catch (error) {
      logPolicyTrace("DIAGNOSTIC_ERROR", { ...identity, error: errorName(error), stage: "close" })
    }
  }
}
