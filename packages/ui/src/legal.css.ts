import { scaled, scaledBetween } from "@sebastian-websites/tokens"
import { style } from "@vanilla-extract/css"

import { PHONE } from "./responsive.ts"
import { color } from "./theme.css.ts"

// Class names for the legal documents: a single reading column in the system's type.

export const legalClassNames = {
  address: style({ fontStyle: "normal" }),
  definitionDescription: style({ margin: scaled("0 0 8px"), overflowWrap: "anywhere" }),
  definitionList: style({
    "@media": { [PHONE]: { gridTemplateColumns: "minmax(0, 1fr)" } },
    display: "grid",
    gap: scaled("4px 24px"),
    gridTemplateColumns: "auto 1fr",
  }),
  definitionTerm: style({ fontWeight: 600 }),
  link: style({ color: color.vivid, overflowWrap: "anywhere", textDecoration: "underline" }),
  list: style({ paddingInlineStart: scaled("20px") }),
  page: style({
    "@media": { [PHONE]: { padding: scaled("48px 20px 88px") } },
    fontSize: scaled("17px"),
    lineHeight: 1.65,
    marginInline: "auto",
    maxWidth: scaled("816px"),
    padding: scaled("96px 24px 128px"),
  }),
  pageContent: style({ marginInline: "auto", maxWidth: scaled("768px") }),
  pageTitle: style({
    "@media": { [PHONE]: { marginBottom: scaled("28px") } },
    fontSize: scaledBetween("32px", "56px"),
    marginBottom: scaled("40px"),
  }),
  section: style({ marginTop: scaled("56px") }),
  sectionTitle: style({
    fontSize: scaledBetween("24px", "28px"),
    marginBottom: scaled("16px"),
  }),
  subsectionTitle: style({
    fontSize: scaled("20px"),
    fontWeight: 500,
    margin: scaled("24px 0 8px"),
  }),
  subtitle: style({ color: color.muted, fontSize: scaled("20px"), fontWeight: 300 }),
  text: style({ marginBottom: scaled("16px") }),
} as const
