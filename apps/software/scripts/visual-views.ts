export const REVIEW_VIEWPORTS = [
  { height: 780, width: 360 },
  { height: 932, width: 430 },
  { height: 720, width: 1280 },
  { height: 900, width: 1440 },
  { height: 1080, width: 1920 },
] as const

const standardViews = [
  ["Homepage on desktop", "software-de-1440-home.png"],
  ["Homepage on a phone", "software-de-390-home.png"],
  ["Header scrolling over the product image", "software-de-1440-sticky-header.png"],
] as const

export function visualViews(): ReadonlyArray<readonly [string, string]> {
  const requested = process.env.SOFTWARE_VISUAL_VIEWS
  if (requested !== undefined) {
    return requested.split(",").map((name) => {
      const filename = name.trim()
      if (!/^[a-z][\da-z\-]+\.png$/v.test(filename))
        throw new Error(`Invalid screenshot name: ${filename}`)
      return [filename, filename]
    })
  }
  if (process.env.SOFTWARE_VISUAL_RESPONSIVE === "1") {
    return REVIEW_VIEWPORTS.flatMap(({ width }) => [
      [`Homepage at ${width} px`, `software-de-${width}-home.png`],
      [`Header while scrolling at ${width} px`, `software-de-${width}-sticky-header.png`],
    ])
  }
  return standardViews
}

export function screenshotInfo(filename: string) {
  return /^[a-z][a-z\-]*?-(?<language>[a-z]{2})-(?<width>\d+)-(?<view>[\da-z\-]+)\.png$/v.exec(
    filename
  )?.groups
}
