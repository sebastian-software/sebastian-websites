import type { Locale, SiteId } from "./sites.ts"

import { canonicalUrl } from "./seo.ts"

/**
 * The closed set of primary next steps a blog post points to. `none` marks a
 * development report without a call to action.
 */
export const NEXT_STEPS = [
  "products",
  "open-source",
  "contact",
  "none",
  "consulting-architecture",
  "consulting-internationalization",
  "consulting-enablement",
  "palamedes-docs",
  "ferramenta-docs",
] as const

export type NextStep = (typeof NEXT_STEPS)[number]

type NextStepTarget =
  | { readonly fragment?: string; readonly path: string; readonly site: SiteId }
  | { readonly href: string }

/** Each step's destination; Consulting offers are the sections of its services page. */
const NEXT_STEP_TARGETS: Readonly<Record<Exclude<NextStep, "none">, NextStepTarget>> = {
  "consulting-architecture": { fragment: "architecture", path: "/services", site: "consulting" },
  "consulting-enablement": { fragment: "enablement", path: "/services", site: "consulting" },
  "consulting-internationalization": {
    fragment: "internationalization",
    path: "/services",
    site: "consulting",
  },
  contact: { path: "/contact", site: "software" },
  "ferramenta-docs": { href: "https://ferramenta.dev" },
  "open-source": { path: "/open-source", site: "software" },
  "palamedes-docs": { href: "https://palamedes.dev" },
  products: { path: "/products", site: "software" },
}

/**
 * Tells whether a value names a known next step.
 *
 * @param value - The `nextStep` of post frontmatter.
 * @returns Whether it belongs to the closed set.
 */
export function isNextStep(value: unknown): value is NextStep {
  return typeof value === "string" && (NEXT_STEPS as readonly string[]).includes(value)
}

/**
 * Resolves the link of a next step. Same-site targets stay relative, so origin
 * hosts and previews keep working; other sites keep the page's language.
 *
 * @param step - The post's next step.
 * @param rendering - The site and language that render the post.
 * @param rendering.locale - The language of the rendering variant.
 * @param rendering.site - The site that renders the post.
 * @returns The destination, or undefined for `none`.
 */
export function nextStepHref(
  step: NextStep,
  rendering: { readonly locale: Locale; readonly site: SiteId }
): string | undefined {
  if (step === "none") {
    return undefined
  }
  const target = NEXT_STEP_TARGETS[step]
  if ("href" in target) {
    return target.href
  }
  const fragment = target.fragment === undefined ? "" : `#${target.fragment}`
  const href =
    target.site === rendering.site
      ? target.path
      : canonicalUrl(target.site, rendering.locale, target.path)
  return `${href}${fragment}`
}
