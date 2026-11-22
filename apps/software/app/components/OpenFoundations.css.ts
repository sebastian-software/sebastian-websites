import {
  color,
  COMPACT,
  editorial,
  font,
  FRAME_OVERHANG,
  PHONE,
  scaled,
  SPACE_SCALE,
  typeStep,
} from "@sebastian-websites/ui/styles"
import { style } from "@vanilla-extract/css"

/** A pale panel whose text aligns with the page edge; the panel reaches beyond it. */
export const panel = style([
  editorial.frameOutset,
  {
    "@media": {
      [COMPACT]: {
        gridTemplateColumns: "minmax(0, 1fr)",
        paddingBlock: scaled("40px 44px"),
      },
      [PHONE]: { paddingBlock: scaled("32px 36px") },
    },
    backgroundColor: color.tint,
    borderRadius: scaled("16px"),
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.45fr) repeat(2, minmax(0, 1fr))",
    paddingBlock: scaled("52px 56px"),
    paddingInline: `max(${FRAME_OVERHANG}, ${SPACE_SCALE.s})`,
  },
])

export const column = style({
  "@media": {
    [COMPACT]: {
      selectors: {
        "& + &": {
          marginTop: SPACE_SCALE.xl,
          paddingLeft: 0,
        },
      },
    },
  },
  display: "flex",
  flexDirection: "column",
  selectors: {
    "& + &": { paddingLeft: SPACE_SCALE.l },
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
