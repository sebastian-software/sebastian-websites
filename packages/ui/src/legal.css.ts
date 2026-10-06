import { style } from "@vanilla-extract/css"

import { color, font } from "./theme.css.ts"

// Class names for the legal documents. Structural only until plan 01.

const plain = style({})

export const legalClassNames = {
  address: style({ fontStyle: "normal" }),
  definitionDescription: style({ margin: "0 0 0.5rem" }),
  definitionList: style({ display: "grid", gap: "0.25rem 1rem", gridTemplateColumns: "auto 1fr" }),
  definitionTerm: style({ fontWeight: 700 }),
  link: style({ color: color.vivid }),
  list: style({ paddingInlineStart: "1.25rem" }),
  page: style({ fontFamily: font.sans, lineHeight: 1.6, padding: "2rem 1rem" }),
  pageContent: style({ marginInline: "auto", maxWidth: "48rem" }),
  pageTitle: style({ color: color.dark, fontFamily: font.slab }),
  section: style({ marginTop: "2rem" }),
  sectionTitle: style({ color: color.dark, fontFamily: font.slab }),
  subsectionTitle: plain,
  subtitle: plain,
  text: plain,
} as const
