import { scaled, typeStep } from "@sebastian-websites/tokens"
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
    fontSize: typeStep("0"),
    lineHeight: 1.65,
    marginInline: "auto",
    maxWidth: scaled("816px"),
    padding: scaled("96px 24px 128px"),
  }),
  pageContent: style({ marginInline: "auto", maxWidth: scaled("768px") }),
  pageTitle: style({
    "@media": { [PHONE]: { marginBottom: scaled("28px") } },
    fontSize: typeStep("5"),
    marginBottom: scaled("40px"),
  }),
  section: style({ marginTop: scaled("56px") }),
  sectionTitle: style({
    fontSize: typeStep("2"),
    marginBottom: scaled("16px"),
  }),
  subsectionTitle: style({
    fontSize: typeStep("1"),
    fontWeight: 500,
    margin: scaled("24px 0 8px"),
  }),
  subtitle: style({ color: color.muted, fontSize: typeStep("1"), fontWeight: 300 }),
  text: style({ marginBottom: scaled("16px") }),
} as const
