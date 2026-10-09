import { FRAME, scaled } from "@sebastian-websites/tokens"
import { style } from "@vanilla-extract/css"

import { COMPACT, FRAME_INSET, FRAME_OVERHANG, FRAME_WIDTH, PHONE } from "../responsive.ts"
import { color, font } from "../theme.css.ts"
import { continuousCorners } from "./corners.ts"

/** The menu opens just below the header shell, inset like the shell itself. */
const MENU_TOP = `calc(${FRAME.headerTop} + ${FRAME.headerHeight} + ${scaled("8px")})`

/** Touch targets in the compact menu grow with the root but never fall below 44 px. */
const TOUCH_TARGET = `max(44px, ${scaled("44px")})`

const HEADER_RADIUS = 14
const CAPSULE_RADIUS = 11
const MENU_BUTTON_RADIUS = 10

/** Hidden until focused; then it sits above the header as the first stop. */
export const skip = style({
  backgroundColor: FRAME.shell,
  borderRadius: scaled("8px"),
  boxShadow: FRAME.shadow,
  color: color.heading,
  fontFamily: font.sans,
  fontSize: scaled("16px"),
  left: scaled("16px"),
  padding: scaled("10px 16px"),
  position: "absolute",
  selectors: {
    "&:not(:focus)": { clipPath: "inset(50%)", height: "1px", overflow: "hidden", width: "1px" },
  },
  top: scaled("16px"),
  zIndex: 30,
})

/** The header floats above the page and stays in reach while scrolling. */
export const area = style({
  "@media": { print: { display: "none" } },
  marginTop: FRAME.headerTop,
  position: "sticky",
  top: FRAME.headerTop,
  zIndex: 20,
})

/** One white shell, slightly wider than the text so the logo aligns with it. */
export const shell = style([
  continuousCorners(HEADER_RADIUS),
  {
    "@media": {
      [COMPACT]: { paddingInline: scaled("16px 2px") },
      [PHONE]: { paddingInline: scaled("12px 2px") },
    },
    alignItems: "center",
    backgroundColor: FRAME.shell,
    boxShadow: FRAME.shadow,
    display: "flex",
    height: FRAME.headerHeight,
    marginInline: "auto",
    paddingInline: `${FRAME_OVERHANG} ${scaled("6px")}`,
    width: FRAME_WIDTH,
  },
])

export const home = style({
  alignItems: "center",
  borderRadius: scaled("6px"),
  display: "flex",
  flexShrink: 0,
  height: "100%",
})

export const logo = style({ display: "block", height: scaled("32px"), width: "auto" })

/** Opens the menu on compact screens; desktop shows the controls inline. */
export const menuButton = style([
  continuousCorners(MENU_BUTTON_RADIUS),
  {
    "@media": {
      [COMPACT]: {
        alignItems: "center",
        display: "inline-flex",
        justifyContent: "center",
      },
    },
    backgroundColor: "transparent",
    border: 0,
    color: color.heading,
    cursor: "pointer",
    display: "none",
    height: TOUCH_TARGET,
    marginLeft: "auto",
    padding: 0,
    selectors: { "&:hover": { backgroundColor: FRAME.capsule } },
    width: TOUCH_TARGET,
  },
])

export const menuIcon = style({
  fill: "none",
  height: scaled("24px"),
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeWidth: 1.75,
  width: scaled("24px"),
})

/**
 * Local navigation, language, and the outward capsule share the far end. The
 * element is a popover: inline on desktop (the author display overrides the
 * closed popover's `display: none`), a panel below the header on compact screens.
 */
export const controls = style({
  "@media": {
    [COMPACT]: {
      alignItems: "stretch",
      backgroundColor: FRAME.shell,
      borderRadius: FRAME.radius,
      boxShadow: FRAME.shadow,
      display: "none",
      flexDirection: "column",
      height: "auto",
      inset: `${MENU_TOP} ${FRAME_INSET} auto`,
      maxHeight: `calc(100dvh - ${MENU_TOP} - ${scaled("16px")})`,
      overflowY: "auto",
      padding: scaled("8px 24px 24px"),
      position: "fixed",
      selectors: { "&:popover-open": { display: "flex" } },
    },
    [PHONE]: { padding: scaled("4px 20px 20px") },
  },
  alignItems: "center",
  backgroundColor: "transparent",
  border: 0,
  color: "inherit",
  display: "flex",
  height: "100%",
  inset: "auto",
  margin: "0 0 0 auto",
  overflow: "visible",
  padding: 0,
  position: "static",
  width: "auto",
})

export const list = style({
  "@media": {
    [COMPACT]: { alignItems: "stretch", flexDirection: "column" },
  },
  alignItems: "center",
  columnGap: scaled("40px"),
  display: "flex",
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const link = style({
  "@media": {
    [COMPACT]: {
      alignItems: "center",
      borderBottom: `1px solid ${color.rule}`,
      display: "flex",
      fontSize: scaled("20px"),
      minHeight: scaled("56px"),
      paddingBlock: scaled("12px"),
    },
  },
  color: color.heading,
  fontFamily: font.sans,
  fontSize: scaled("16px"),
  lineHeight: 1,
  paddingBlock: scaled("8px"),
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
  "@media": { [COMPACT]: { display: "none" } },
  backgroundColor: color.rule,
  flexShrink: 0,
  height: scaled("20px"),
  marginInline: scaled("32px"),
  width: "1px",
})

export const languages = style([
  list,
  {
    "@media": {
      [COMPACT]: {
        alignItems: "center",
        columnGap: scaled("4px"),
        flexDirection: "row",
        marginTop: scaled("12px"),
      },
    },
    columnGap: scaled("8px"),
  },
])

export const language = style([
  link,
  {
    "@media": {
      [COMPACT]: {
        borderBottom: 0,
        borderRadius: scaled("10px"),
        fontSize: scaled("17px"),
        justifyContent: "center",
        minHeight: TOUCH_TARGET,
        minWidth: scaled("56px"),
        selectors: { '&[aria-current="true"]': { backgroundColor: FRAME.capsule } },
      },
    },
    color: color.subtle,
    letterSpacing: "0.02em",
    selectors: { '&[aria-current="true"]': { color: color.heading } },
  },
])

export const slash = style({
  "@media": { [COMPACT]: { display: "none" } },
  color: color.rule,
  fontFamily: font.sans,
  fontSize: scaled("16px"),
})

/** A smaller neutral utility capsule: plain outward text, never a second logo. */
export const outbound = style([
  continuousCorners(CAPSULE_RADIUS),
  {
    "@media": {
      [COMPACT]: {
        alignSelf: "flex-start",
        fontSize: scaled("16px"),
        height: TOUCH_TARGET,
        marginTop: scaled("16px"),
      },
    },
    alignItems: "center",
    backgroundColor: FRAME.capsule,
    color: color.heading,
    columnGap: scaled("8px"),
    display: "inline-flex",
    flexShrink: 0,
    fontFamily: font.sans,
    fontSize: scaled("15px"),
    height: scaled("36px"),
    lineHeight: 1,
    paddingInline: scaled("16px 14px"),
    selectors: { "&:hover": { backgroundColor: "#e8e9ec" } },
  },
])

export const outboundArrow = style({ height: scaled("14px"), width: scaled("14px") })
