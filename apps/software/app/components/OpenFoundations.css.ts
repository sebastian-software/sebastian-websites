import {
  bleed,
  color,
  COMPACT,
  editorial,
  font,
  PHONE,
  scaled,
  typeStep,
} from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

/** A pale panel whose text aligns with the page edge; the panel reaches beyond it. */
export const panel = style({
  "@media": {
    [COMPACT]: {
      gridTemplateColumns: "minmax(0, 1fr)",
      marginInline: 0,
      padding: scaled("40px 32px 44px"),
    },
    [PHONE]: { padding: scaled("32px 24px 36px") },
  },
  backgroundColor: color.tint,
  borderRadius: scaled("16px"),
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.45fr) repeat(2, minmax(0, 1fr))",
  marginInline: `calc(-1 * ${bleed("40px")})`,
  padding: scaled("52px 40px 56px"),
})

export const column = style({
  "@media": {
    [COMPACT]: {
      selectors: {
        "& + &": {
          borderLeft: 0,
          borderTop: `1px solid ${color.rule}`,
          marginTop: scaled("36px"),
          paddingLeft: 0,
          paddingTop: scaled("32px"),
        },
      },
    },
  },
  display: "flex",
  flexDirection: "column",
  selectors: {
    "& + &": { borderLeft: `1px solid ${color.rule}`, paddingLeft: "40px" },
  },
})

export const intro = style({
  "@media": { [COMPACT]: { paddingRight: 0 } },
  paddingRight: scaled("40px"),
})

export const title = style([editorial.title, { marginBottom: scaled("12px") }])

export const project = style({
  "@media": { [COMPACT]: { marginTop: 0 } },
  color: color.heading,
  fontFamily: font.serif,
  fontSize: typeStep("1"),
  lineHeight: 1.3,
  marginBottom: scaled("10px"),
  marginTop: scaled("62px"),
})

export const text = style([editorial.bodySerif, { flexGrow: 1 }])

export const action = style({ marginTop: scaled("28px") })
