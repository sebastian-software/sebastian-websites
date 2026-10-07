const BUILD_DATE = new Date(__BUILD_DATE__)

/** The build day, shown as the documents' "as of" date. */
export const appBuildDate = new Date(
  Date.UTC(BUILD_DATE.getUTCFullYear(), BUILD_DATE.getUTCMonth(), BUILD_DATE.getUTCDate())
)
export const appBuildYear = String(appBuildDate.getUTCFullYear())
