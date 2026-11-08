declare global {
  /** The year of the build, for the footer's copyright line. */
  const __BUILD_YEAR__: number
  const __SITE_VARIANT__: string
  /** False while the blog navigation is off: blog pages carry `noindex`. */
  const __BLOG_INDEXED__: boolean
}

export {}
