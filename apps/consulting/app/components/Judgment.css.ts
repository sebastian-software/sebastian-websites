import { color, COMPACT, editorial, PHONE } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

/** The one contained berry passage; only its top edge leans. */
export const passage = style([
  editorial.grid,
  {
    "@media": {
      [COMPACT]: { padding: "96px 40px 72px", rowGap: "32px" },
      [PHONE]: {
        clipPath: "polygon(0 24px, 100% 0, 100% 100%, 0 100%)",
        marginInline: "-20px",
        padding: "72px 20px 56px",
      },
    },
    alignItems: "center",
    backgroundColor: color.passage,
    clipPath: "polygon(0 44px, 100% 0, 100% 100%, 0 100%)",
    marginInline: "-24px",
    padding: "112px 48px 88px",
  },
])

export const title = style([
  editorial.display,
  {
    "@media": { [COMPACT]: { fontSize: "46px" }, [PHONE]: { fontSize: "34px" } },
    fontSize: "58px",
    gridColumn: "1 / span 7",
    lineHeight: 1.14,
  },
])

export const aside = style({
  "@media": { [COMPACT]: { paddingLeft: "24px" }, [PHONE]: { paddingLeft: "20px" } },
  borderLeft: `1px solid color-mix(in oklch, ${color.accent} 55%, transparent)`,
  gridColumn: "8 / span 5",
  paddingBlock: "6px",
  paddingLeft: "40px",
})

export const text = style([
  editorial.body,
  { "@media": { [PHONE]: { fontSize: "18px" } }, fontSize: "20px", lineHeight: 1.5 },
])
