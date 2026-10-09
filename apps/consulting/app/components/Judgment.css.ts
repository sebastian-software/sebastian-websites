import { color, COMPACT, editorial, PHONE, scaled } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

/** The one contained berry passage; only its top edge leans. */
export const passage = style([
  editorial.grid,
  {
    "@media": {
      [COMPACT]: { padding: scaled("96px 40px 72px"), rowGap: scaled("32px") },
      [PHONE]: {
        clipPath: `polygon(0 ${scaled("24px")}, 100% 0, 100% 100%, 0 100%)`,
        marginInline: scaled("-20px"),
        padding: scaled("72px 20px 56px"),
      },
    },
    alignItems: "center",
    backgroundColor: color.passage,
    clipPath: `polygon(0 ${scaled("44px")}, 100% 0, 100% 100%, 0 100%)`,
    marginInline: scaled("-24px"),
    padding: scaled("112px 48px 88px"),
  },
])

export const title = style([
  editorial.display,
  {
    "@media": { [COMPACT]: { fontSize: scaled("46px") }, [PHONE]: { fontSize: scaled("34px") } },
    fontSize: scaled("58px"),
    gridColumn: "1 / span 7",
    lineHeight: 1.14,
  },
])

export const aside = style({
  "@media": {
    [COMPACT]: { paddingLeft: scaled("24px") },
    [PHONE]: { paddingLeft: scaled("20px") },
  },
  borderLeft: `1px solid color-mix(in oklch, ${color.accent} 55%, transparent)`,
  gridColumn: "8 / span 5",
  paddingBlock: scaled("6px"),
  paddingLeft: scaled("40px"),
})

export const text = style([
  editorial.body,
  {
    "@media": { [PHONE]: { fontSize: scaled("18px") } },
    fontSize: scaled("20px"),
    lineHeight: 1.5,
  },
])
