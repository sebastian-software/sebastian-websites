/**
 * The launch switch of the Software blog. Deliberately free of imports, so
 * `hosting/` and build scripts can load it as a relative source file.
 */

/** The phases of the blog launch, in the order the owners step through them. */
export const BLOG_NAVIGATION_PHASES = ["off", "launching", "live"] as const

/**
 * A launch phase of the blog navigation item:
 *
 * - `off`: the Software brand navigation does not link the blog, and the site's
 *   own blog pages stay out of search: no sitemap entry, and `noindex`.
 * - `launching`: the item is shown, and the Software build fails while either
 *   language has no published post at the build time. Set it in the pull
 *   request that carries the first post in both languages.
 * - `live`: the item is shown, and a language without a published post shows
 *   the empty state. Set it after the first deployment with the item.
 */
export type BlogNavigationPhase = (typeof BLOG_NAVIGATION_PHASES)[number]

/**
 * The current launch phase. The blog pages and feeds are built in every phase;
 * fixture builds with `--content` are indexable in every phase.
 * The value is widened to the phase type, so code that reads the switch keeps
 * every branch whatever the current phase is.
 */
export const BLOG_NAVIGATION = "off" as BlogNavigationPhase
