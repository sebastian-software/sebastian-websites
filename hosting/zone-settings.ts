import type { Json } from "./bunny.ts"

import { IMAGE_EXTENSIONS, type Target } from "./targets.ts"

const ONE_YEAR = 31_536_000
const ONE_DAY = 86_400
const FIVE_MINUTES = 300
const MAX_PATTERNS_PER_TRIGGER = 5

// Bunny edge-rule and trigger codes, as its API names them.
const ACTION = { browserCacheTime: 16, cacheTime: 3, redirect: 1, setResponseHeader: 5 } as const
const TRIGGER_URL = 0
const MATCH = { any: 0, none: 2 } as const

export type EdgeRule = { readonly Description: string } & Json

/**
 * The pull-zone settings every target shares, plus open CORS for the
 * extensions a target exports to other sites.
 *
 * @param target - The target whose exported extensions get open CORS.
 * @returns The settings as Bunny's API names them.
 */
export function pullZoneSettings(target: Target): Json {
  return {
    AccessControlOriginHeaderExtensions: [...target.corsExtensions],
    CacheErrorResponses: false,
    DisableCookies: true,
    EnableAccessControlOriginHeader: target.corsExtensions.length > 0,
    EnableGeoZoneAF: false,
    EnableGeoZoneASIA: false,
    EnableGeoZoneEU: true,
    EnableGeoZoneSA: false,
    EnableGeoZoneUS: true,
    IgnoreQueryStrings: target.assets !== true,
    OptimizerEnabled: target.assets === true,
    ...(target.assets === true
      ? {
          EnableAvifVary: true,
          EnableWebpVary: true,
          OptimizerAutomaticOptimizationEnabled: false,
          OptimizerEnableManipulationEngine: true,
          OptimizerEnableUpscaling: false,
          OptimizerEnableWebP: true,
          OptimizerForceClasses: false,
          OptimizerMinifyCSS: false,
          OptimizerMinifyJavaScript: false,
        }
      : {}),
  }
}

type CacheRuleSpec = {
  readonly browser: number
  readonly cdn: number
  readonly description: string
  readonly immutable: boolean
  readonly matching: number
  readonly orderIndex: number
  readonly patterns: readonly string[]
}

function cacheRule(spec: CacheRuleSpec): EdgeRule {
  const cacheControl = `public, max-age=${spec.browser}${spec.immutable ? ", immutable" : ""}`
  return {
    ActionParameter1: String(spec.cdn),
    ActionType: ACTION.cacheTime,
    Description: spec.description,
    Enabled: true,
    ExtraActions: [
      { ActionParameter1: String(spec.browser), ActionType: ACTION.browserCacheTime },
      {
        ActionParameter1: "Cache-Control",
        ActionParameter2: cacheControl,
        ActionType: ACTION.setResponseHeader,
      },
    ],
    OrderIndex: spec.orderIndex,
    TriggerMatchingType: MATCH.any,
    Triggers: Array.from(
      { length: Math.ceil(spec.patterns.length / MAX_PATTERNS_PER_TRIGGER) },
      (_, index) => ({
        PatternMatches: spec.patterns.slice(
          index * MAX_PATTERNS_PER_TRIGGER,
          (index + 1) * MAX_PATTERNS_PER_TRIGGER
        ),
        PatternMatchingType: spec.matching,
        Type: TRIGGER_URL,
      })
    ),
  }
}

/**
 * The caching rules of a website target: hashed build assets never change,
 * documents are purged on every publish and kept short in browsers.
 *
 * @param target - Asset zones receive image and immutable font caching rules.
 * @returns The rules, matched by description on later runs.
 */
export function cacheRules(target?: Target): readonly EdgeRule[] {
  if (target?.assets === true) {
    return [
      cacheRule({
        browser: ONE_YEAR,
        cdn: ONE_YEAR,
        description: "websites: images are cached for a year",
        immutable: false,
        matching: MATCH.any,
        orderIndex: 0,
        patterns: IMAGE_EXTENSIONS.map((extension) => `*.${extension}*`),
      }),
      cacheRule({
        browser: ONE_YEAR,
        cdn: ONE_YEAR,
        description: "websites: font binaries are immutable",
        immutable: true,
        matching: MATCH.any,
        orderIndex: 1,
        patterns: ["*.woff2*"],
      }),
      cacheRule({
        browser: FIVE_MINUTES,
        cdn: ONE_DAY,
        description: "websites: font stylesheets are purged on publish",
        immutable: false,
        matching: MATCH.any,
        orderIndex: 2,
        patterns: ["*.css*"],
      }),
    ]
  }
  return [
    cacheRule({
      browser: ONE_YEAR,
      cdn: ONE_YEAR,
      description: "websites: hashed assets are immutable",
      immutable: true,
      matching: MATCH.any,
      orderIndex: 0,
      patterns: ["*/assets/*"],
    }),
    cacheRule({
      browser: FIVE_MINUTES,
      cdn: ONE_DAY,
      description: "websites: documents are purged on publish",
      immutable: false,
      matching: MATCH.none,
      orderIndex: 1,
      patterns: ["*/assets/*"],
    }),
  ]
}

/**
 * Redirect each alias to its canonical HTTPS hostname before the cache lookup.
 * Bunny's Request.Path expansion includes the original path and query string.
 *
 * @param target - The canonical hostname and its aliases.
 * @returns The rules, matched by description on later runs.
 */
export function canonicalRedirectRules(target: Target): readonly EdgeRule[] {
  if (target.hostname === undefined) {
    return []
  }
  return (target.aliasHostnames ?? []).map((hostname, index) => ({
    ActionParameter1: `https://${target.hostname}%{Request.Path}`,
    ActionParameter2: "301",
    ActionType: ACTION.redirect,
    Description: `websites: redirect ${hostname} to canonical hostname`,
    Enabled: true,
    ExtraActions: [],
    OrderIndex: cacheRules(target).length + index,
    TriggerMatchingType: MATCH.any,
    Triggers: [
      {
        PatternMatches: [`*://${hostname}/*`],
        PatternMatchingType: MATCH.any,
        Type: TRIGGER_URL,
      },
    ],
  }))
}

/** File types whose content type Bunny Storage does not derive from the extension. */
const CONTENT_TYPES = [
  {
    contentType: "application/manifest+json; charset=utf-8",
    description: "websites: web manifests are served as manifest JSON",
    pattern: "*.webmanifest",
  },
] as const

/**
 * Corrects response content types that Bunny Storage gets wrong: it serves
 * `.webmanifest` as `application/octet-stream`. Asset zones serve no manifests.
 *
 * @param target - The target whose responses the rules adjust.
 * @returns The rules, matched by description on later runs.
 */
export function contentTypeRules(target: Target): readonly EdgeRule[] {
  if (target.assets === true) {
    return []
  }
  const firstIndex = cacheRules(target).length + (target.aliasHostnames?.length ?? 0)
  return CONTENT_TYPES.map((entry, index) => ({
    ActionParameter1: "Content-Type",
    ActionParameter2: entry.contentType,
    ActionType: ACTION.setResponseHeader,
    Description: entry.description,
    Enabled: true,
    ExtraActions: [],
    OrderIndex: firstIndex + index,
    TriggerMatchingType: MATCH.any,
    Triggers: [
      { PatternMatches: [entry.pattern], PatternMatchingType: MATCH.any, Type: TRIGGER_URL },
    ],
  }))
}
