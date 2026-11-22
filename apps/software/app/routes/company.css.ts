import { editorial, SPACE_SCALE } from "@sebastian-websites/ui/styles"
import { globalStyle, style } from "@vanilla-extract/css"

export const companyIntro = style([editorial.page, { paddingBlock: SPACE_SCALE.xl }])

export const companyPhoto = style([
  editorial.media,
  editorial.rounded,
  editorial.frameMedia,
  { marginBottom: SPACE_SCALE["2xl"] },
])

export const sectionHead = style([
  editorial.grid,
  { alignItems: "start", marginBottom: SPACE_SCALE.xl, rowGap: SPACE_SCALE.m },
])

export const missionImage = style([
  editorial.paperIllustration,
  editorial.frameMedia,
  { marginBottom: SPACE_SCALE.xl },
])

globalStyle(`${sectionHead} > :first-child`, { gridColumn: "1 / span 5" })
globalStyle(`${sectionHead} > :nth-child(2)`, { gridColumn: "7 / span 6" })
