import { COMPACT_PAGE, FRAME, PAGE } from "@sebastian-websites/tokens"
import { style } from "@vanilla-extract/css"

import { COMPACT, FRAME_WIDTH, PHONE } from "../responsive.ts"
import { color, font } from "../theme.css.ts"
import { continuousCorners } from "./corners.ts"

/** The menu opens just below the header shell, inset like the shell itself. */
const MENU_TOP = `calc(${FRAME.headerTop} + ${FRAME.headerHeight} + 8px)`
const COMPACT_INSET = `calc(${COMPACT_PAGE.compactMargin} - ${COMPACT_PAGE.compactOverhang})`
const PHONE_INSET = `calc(${COMPACT_PAGE.phoneMargin} - ${COMPACT_PAGE.phoneOverhang})`

/** Touch targets in the compact menu are at least this tall. */
const TOUCH_TARGET = "44px"

const HEADER_RADIUS = 14
const CAPSULE_RADIUS = 11
const MENU_BUTTON_RADIUS = 10

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
      [COMPACT]: { paddingInline: "16px 2px", width: FRAME_WIDTH.compact },
      [PHONE]: { paddingInline: "12px 2px", width: FRAME_WIDTH.phone },
    },
    alignItems: "center",
    backgroundColor: FRAME.shell,
    boxShadow: FRAME.shadow,
    display: "flex",
    height: FRAME.headerHeight,
    marginInline: "auto",
    paddingInline: `${PAGE.overhang} 6px`,
    width: FRAME_WIDTH.desktop,
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
  height: "24px",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeWidth: 1.75,
  width: "24px",
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
      inset: `${MENU_TOP} ${COMPACT_INSET} auto`,
      maxHeight: `calc(100dvh - ${MENU_TOP} - 16px)`,
      overflowY: "auto",
      padding: "8px 24px 24px",
      position: "fixed",
      selectors: { "&:popover-open": { display: "flex" } },
    },
    [PHONE]: { inset: `${MENU_TOP} ${PHONE_INSET} auto`, padding: "4px 20px 20px" },
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
  columnGap: "40px",
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
      fontSize: "20px",
      minHeight: "56px",
      paddingBlock: "12px",
    },
  },
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
  "@media": { [COMPACT]: { display: "none" } },
  backgroundColor: color.rule,
  flexShrink: 0,
  height: "20px",
  marginInline: "32px",
  width: "1px",
})

export const languages = style([
  list,
  {
    "@media": {
      [COMPACT]: {
        alignItems: "center",
        columnGap: "4px",
        flexDirection: "row",
        marginTop: "12px",
      },
    },
    columnGap: "8px",
  },
])

export const language = style([
  link,
  {
    "@media": {
      [COMPACT]: {
        borderBottom: 0,
        borderRadius: "10px",
        fontSize: "17px",
        justifyContent: "center",
        minHeight: TOUCH_TARGET,
        minWidth: "56px",
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
  fontSize: "16px",
})

/** A smaller neutral utility capsule: plain outward text, never a second logo. */
export const outbound = style([
  continuousCorners(CAPSULE_RADIUS),
  {
    "@media": {
      [COMPACT]: {
        alignSelf: "flex-start",
        fontSize: "16px",
        height: TOUCH_TARGET,
        marginTop: "16px",
      },
    },
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
