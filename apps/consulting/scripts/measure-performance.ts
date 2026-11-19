/* eslint-disable unicorn/prefer-global-this -- Browser callbacks use the typed Window object. */
/* eslint-disable no-await-in-loop -- Cold browser samples run sequentially. */
/* eslint-disable max-statements -- Keep each measured navigation and observer contract together. */
/* eslint-disable security/detect-non-literal-fs-filename -- The caller chooses the local JSON output. */
/** A bounded loading experiment; not a Lighthouse score or field-vitals collector. */
import { mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { type Browser, chromium, type Page } from "playwright"

const ARTICLE_ORIGIN_ARGUMENT = 3
const HTTP_OK = 200
const REPEATS = 3
const OBSERVATION_MS = 3000
const NAVIGATION_TIMEOUT_MS = 45_000
const LONG_TASK_THRESHOLD_MS = 50
const SESSION_GAP_MS = 1000
const SESSION_LIMIT_MS = 5000
const BITS_PER_BYTE = 8
const MILLISECONDS_PER_SECOND = 1000
const PROFILES = [
  {
    cpu: 4,
    downloadBits: 1_600_000,
    height: 844,
    latencyMs: 150,
    name: "mobile",
    uploadBits: 750_000,
    width: 390,
  },
  {
    cpu: 1,
    downloadBits: 10_000_000,
    height: 1000,
    latencyMs: 40,
    name: "desktop",
    uploadBits: 5_000_000,
    width: 1440,
  },
] as const
const TARGETS = [
  { name: "software-home", url: "https://sebastian-software.de/" },
  { name: "software-products", url: "https://sebastian-software.de/products" },
  { name: "consulting-home", url: "https://sebastian-consulting.de/" },
  {
    name: "consulting-service",
    url: "https://sebastian-consulting.de/services/architecture-review",
  },
  { name: "consulting-profile", url: "https://sebastian-consulting.de/werner" },
  { name: "opensource-home", url: "https://oss.sebastian-software.de/" },
  { name: "blog-home", url: "https://blog.sebastian-software.de/" },
]
type Profile = (typeof PROFILES)[number]
type Shift = { score: number; time: number }
type Observations = {
  lcp: { element: string; imageUrl: null | string; time: number } | null
  longTasks: number[]
  shifts: Shift[]
  supported: string[]
}
declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- Extend the browser's existing Window type.
  interface Window {
    seoLoadingSample: Observations
  }
}

function installObservers(): void {
  const TEXT_LIMIT = 100
  const state: Observations = {
    lcp: null,
    longTasks: [],
    shifts: [],
    supported: [...PerformanceObserver.supportedEntryTypes],
  }
  window.seoLoadingSample = state
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const element: unknown = Reflect.get(entry, "element")
      const id = element instanceof HTMLElement && element.id !== "" ? `#${element.id}` : ""
      state.lcp = {
        element:
          element instanceof HTMLElement
            ? `${element.tagName.toLowerCase() + id} ${element.textContent.trim().slice(0, TEXT_LIMIT)}`
            : "unknown",
        imageUrl: element instanceof HTMLImageElement ? element.currentSrc : null,
        time: entry.startTime,
      }
    }
  }).observe({ buffered: true, type: "largest-contentful-paint" })
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const recentInput: unknown = Reflect.get(entry, "hadRecentInput")
      const score: unknown = Reflect.get(entry, "value")
      if (recentInput === false && typeof score === "number")
        state.shifts.push({ score, time: entry.startTime })
    }
  }).observe({ buffered: true, type: "layout-shift" })
  new PerformanceObserver((list) => {
    state.longTasks.push(...list.getEntries().map((entry) => entry.duration))
  }).observe({ buffered: true, type: "longtask" })
}

function maxShiftSession(shifts: readonly Shift[]): number {
  let first = shifts.at(0)?.time ?? 0
  let previous = first
  let score = 0
  let maximum = 0
  for (const shift of shifts) {
    if (shift.time - previous >= SESSION_GAP_MS || shift.time - first >= SESSION_LIMIT_MS) {
      first = shift.time
      score = 0
    }
    score += shift.score
    maximum = Math.max(maximum, score)
    previous = shift.time
  }
  return maximum
}

type DocumentMetrics = {
  fcpMs: null | number
  fonts: string
  images: Array<{ complete: boolean; fetchPriority: string; loading: string; url: string }>
  observations: Observations
  preloadUrls: string[]
  resources: Array<{ durationMs: number; startMs: number; type: string; url: string }>
  ttfbMs: null | number
}
async function documentMetrics(page: Page): Promise<DocumentMetrics> {
  return page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation").at(0)
    const responseStart: unknown =
      navigation === undefined ? undefined : Reflect.get(navigation, "responseStart")
    const requestStart: unknown =
      navigation === undefined ? undefined : Reflect.get(navigation, "requestStart")
    return {
      fcpMs: performance.getEntriesByName("first-contentful-paint").at(0)?.startTime ?? null,
      fonts: document.fonts.status,
      images: [...document.images]
        .filter((image) => image.getBoundingClientRect().top < innerHeight)
        .map((image) => ({
          complete: image.complete && image.naturalWidth > 0,
          fetchPriority: image.fetchPriority,
          loading: image.loading,
          url: image.currentSrc,
        })),
      observations: window.seoLoadingSample,
      preloadUrls: [...document.querySelectorAll<HTMLLinkElement>('link[rel="preload"]')].map(
        (link) => link.href
      ),
      resources: performance.getEntriesByType("resource").map((entry) => {
        const kind: unknown = Reflect.get(entry, "initiatorType")
        return {
          durationMs: entry.duration,
          startMs: entry.startTime,
          type: typeof kind === "string" ? kind : "unknown",
          url: entry.name,
        }
      }),
      ttfbMs:
        typeof responseStart === "number" && typeof requestStart === "number"
          ? responseStart - requestStart
          : null,
    }
  })
}

type SampleRequest = {
  readonly profile: Profile
  readonly repeat: number
  readonly target: (typeof TARGETS)[number]
}
async function sample(
  instance: Browser,
  { profile, repeat, target }: SampleRequest
): Promise<Readonly<Record<string, unknown>>> {
  const context = await instance.newContext({
    deviceScaleFactor: 1,
    locale: "de-DE",
    viewport: { height: profile.height, width: profile.width },
  })
  try {
    const page = await context.newPage()
    const cdp = await context.newCDPSession(page)
    await cdp.send("Network.enable")
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true })
    await cdp.send("Network.emulateNetworkConditions", {
      downloadThroughput: profile.downloadBits / BITS_PER_BYTE,
      latency: profile.latencyMs,
      offline: false,
      uploadThroughput: profile.uploadBits / BITS_PER_BYTE,
    })
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: profile.cpu })
    await cdp.send("Performance.enable")
    await page.addInitScript(installObservers)
    const startedAt = new Date().toISOString()
    const response = await page.goto(target.url, {
      timeout: NAVIGATION_TIMEOUT_MS,
      waitUntil: "load",
    })
    if (response?.status() !== HTTP_OK)
      throw new Error(`Unexpected HTTP status: ${response?.status()}`)
    await page.waitForTimeout(OBSERVATION_MS)
    const document = await documentMetrics(page)
    const cpu = await cdp.send("Performance.getMetrics")
    const metric = (name: string): null | number => {
      const value = cpu.metrics.find((entry) => entry.name === name)?.value
      return value === undefined ? null : value * MILLISECONDS_PER_SECOND
    }
    return {
      ...document,
      cls: maxShiftSession(document.observations.shifts),
      cpuScriptMs: metric("ScriptDuration"),
      cpuTaskMs: metric("TaskDuration"),
      finalUrl: page.url(),
      longTaskBlockingMs: document.observations.longTasks.reduce(
        (total, duration) => total + Math.max(0, duration - LONG_TASK_THRESHOLD_MS),
        0
      ),
      profile: profile.name,
      repeat,
      startedAt,
      status: response.status(),
      target: target.name,
      url: target.url,
    }
  } finally {
    await context.close()
  }
}

const output = resolve(process.argv.at(2) ?? "build/performance-baseline.json")
const articleOrigin = process.argv.at(ARTICLE_ORIGIN_ARGUMENT)
if (articleOrigin !== undefined)
  TARGETS.push({
    name: "local-blog-article",
    url: new URL("/posts/ui-strings-and-user-content", articleOrigin).href,
  })
const browser = await chromium.launch({ headless: true })
const samples: Array<Readonly<Record<string, unknown>>> = []
const attempts = Array.from({ length: REPEATS }, (_, index) => index + 1)
const variants = TARGETS.flatMap((target) => PROFILES.map((profile) => ({ profile, target })))
const jobs = variants.flatMap((variant) => attempts.map((repeat) => ({ ...variant, repeat })))
try {
  for (const job of jobs) {
    try {
      samples.push(await sample(browser, job))
    } catch (error) {
      samples.push({
        error: error instanceof Error ? error.message : String(error),
        profile: job.profile.name,
        repeat: job.repeat,
        target: job.target.name,
        url: job.target.url,
      })
    }
    console.log(
      `${job.target.name} ${job.profile.name} ${job.repeat}/${REPEATS}: ${"error" in (samples.at(-1) ?? {}) ? "ERROR" : "collected"}`
    )
  }
  await mkdir(dirname(output), { recursive: true })
  const report = {
    browser: browser.version(),
    generatedAt: new Date().toISOString(),
    observationAfterLoadMs: OBSERVATION_MS,
    platform: `${process.platform}/${process.arch}`,
    profiles: PROFILES,
    repeats: REPEATS,
    samples,
  }
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`)
  if (samples.some((entry) => "error" in entry)) process.exitCode = 1
  console.log(`Wrote ${samples.length} loading samples to ${output}`)
} finally {
  await browser.close()
}
