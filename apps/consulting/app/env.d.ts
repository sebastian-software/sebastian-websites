declare global {
  /** The build timestamp as an ISO string; documents show it as their "as of" date. */
  const __BUILD_DATE__: string
  /** The year of the build, for the footer's copyright line. */
  const __BUILD_YEAR__: number
  const __SITE_VARIANT__: string

  /** Rybbit's global, present only when the analytics script is loaded. */
  var rybbit:
    { event: (name: string, properties?: Record<string, number | string>) => void } | undefined
}

export {}
