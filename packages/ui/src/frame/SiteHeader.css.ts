import { FRAME, PAGE } from "@sebastian-websites/tokens"
import { style } from "@vanilla-extract/css"

import { color, font } from "../theme.css.ts"
import { continuousCorners } from "./corners.ts"

const HEADER_RADIUS = 14
const CAPSULE_RADIUS = 11

/** Hidden until focused; then it sits above the header as the first stop. */
export const skip = style({
  backgroundColor: FRAME.shell,
  borderRadius: "8px",
  boxShadow: FRAME.shadow,
  color: color.heading,
  fontFamily: font.sans,
  fontSize: "16px",
  left: "16px",
  padding: "10px 16px",
  position: "absolute",
  selectors: {
    "&:not(:focus)": { clipPath: "inset(50%)", height: "1px", overflow: "hidden", width: "1px" },
  },
  top: "16px",
  zIndex: 30,
})

/** The header floats above the page and stays in reach while scrolling. */
export const area = style({
  marginTop: FRAME.headerTop,
  position: "sticky",
  top: FRAME.headerTop,
  zIndex: 20,
})

/** One white shell, slightly wider than the text so the logo aligns with it. */
export const shell = style([
  continuousCorners(HEADER_RADIUS),
  {
    alignItems: "center",
    backgroundColor: FRAME.shell,
    boxShadow: FRAME.shadow,
    display: "flex",
    height: FRAME.headerHeight,
    marginInline: "auto",
    paddingInline: `${PAGE.overhang} 6px`,
    width: `min(calc(${PAGE.width} + 2 * ${PAGE.overhang}), 100% - 2 * (${PAGE.margin} - ${PAGE.overhang}))`,
  },
])

export const home = style({
  alignItems: "center",
  borderRadius: "6px",
  display: "flex",
  flexShrink: 0,
  height: "100%",
})

export const logo = style({ display: "block", height: "32px", width: "auto" })

/** Local navigation, language, and the outward capsule share the far end. */
export const controls = style({
  alignItems: "center",
  display: "flex",
  height: "100%",
  marginLeft: "auto",
})

export const list = style({
  alignItems: "center",
  columnGap: "40px",
  display: "flex",
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const link = style({
  color: color.heading,
  fontFamily: font.sans,
  fontSize: "16px",
  lineHeight: 1,
  paddingBlock: "8px",
  selectors: {
    "&:hover": { color: color.accent },
    '&[aria-current="page"]': {
      color: color.accent,
      textDecoration: "underline",
      textDecorationThickness: "1px",
      textUnderlineOffset: "8px",
    },
  },
})

export const separator = style({
  backgroundColor: color.rule,
  flexShrink: 0,
  height: "20px",
  marginInline: "32px",
  width: "1px",
})

export const languages = style([list, { columnGap: "8px" }])

export const language = style([
  link,
  {
    color: color.subtle,
    letterSpacing: "0.02em",
    selectors: { '&[aria-current="true"]': { color: color.heading } },
  },
])

export const slash = style({ color: color.rule, fontFamily: font.sans, fontSize: "16px" })

/** A smaller neutral utility capsule: plain outward text, never a second logo. */
export const outbound = style([
  continuousCorners(CAPSULE_RADIUS),
  {
    alignItems: "center",
    backgroundColor: FRAME.capsule,
    color: color.heading,
    columnGap: "8px",
    display: "inline-flex",
    flexShrink: 0,
    fontFamily: font.sans,
    fontSize: "15px",
    height: "36px",
    lineHeight: 1,
    paddingInline: "16px 14px",
    selectors: { "&:hover": { backgroundColor: "#e8e9ec" } },
  },
])

export const outboundArrow = style({ height: "14px", width: "14px" })
