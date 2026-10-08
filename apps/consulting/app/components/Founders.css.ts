import { color, COMPACT, editorial, font, PHONE } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const title = style([
  editorial.display,
  {
    "@media": {
      [COMPACT]: { fontSize: "46px", marginBottom: "44px" },
      [PHONE]: { fontSize: "36px", marginBottom: "32px" },
    },
    fontSize: "60px",
    lineHeight: 1.12,
    marginBottom: "60px",
  },
])

/** The second line steps in, as in the selected composition. */
export const titleIndent = style({
  "@media": { [COMPACT]: { paddingLeft: "48px" }, [PHONE]: { paddingLeft: "28px" } },
  display: "block",
  paddingLeft: "84px",
})

export const row = style([
  editorial.grid,
  { "@media": { [COMPACT]: { rowGap: "48px" } }, alignItems: "center" },
])

export const intro = style({ gridColumn: "1 / span 3" })

export const values = style([
  editorial.heading,
  {
    "@media": { [COMPACT]: { fontSize: "30px" }, [PHONE]: { fontSize: "26px" } },
    fontSize: "36px",
    lineHeight: 1.22,
    marginBottom: "22px",
  },
])

export const text = style([
  editorial.body,
  { fontSize: "19px", lineHeight: 1.5, marginBottom: "36px" },
])

export const portraits = style({
  "@media": { [PHONE]: { columnGap: "16px" } },
  columnGap: "32px",
  display: "grid",
  gridColumn: "4 / span 9",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const figure = style({ margin: 0 })

export const frame = style({
  aspectRatio: "7 / 10",
  backgroundColor: color.tint,
  overflow: "hidden",
})

export const photo = style({ display: "block", height: "100%", objectFit: "cover", width: "100%" })

export const name = style({
  color: color.accent,
  fontFamily: font.sans,
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.22em",
  marginTop: "20px",
  textTransform: "uppercase",
})

export const role = style({
  color: color.accent,
  fontFamily: font.sans,
  fontSize: "16px",
  marginTop: "6px",
})
