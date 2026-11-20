export const REVIEW_VIEWPORTS = [
  { height: 844, width: 390 },
  { height: 540, width: 640 },
  { height: 800, width: 960 },
  { height: 1000, width: 1440 },
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
