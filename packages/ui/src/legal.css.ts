import { style } from "@vanilla-extract/css"

import { PHONE } from "./responsive.ts"
import { color } from "./theme.css.ts"

// Class names for the legal documents: a single reading column in the system's type.

export const legalClassNames = {
  address: style({ fontStyle: "normal" }),
  definitionDescription: style({ margin: "0 0 0.5rem", overflowWrap: "anywhere" }),
  definitionList: style({
    "@media": { [PHONE]: { gridTemplateColumns: "minmax(0, 1fr)" } },
    display: "grid",
    gap: "0.25rem 1.5rem",
    gridTemplateColumns: "auto 1fr",
  }),
  definitionTerm: style({ fontWeight: 600 }),
  link: style({ color: color.vivid, overflowWrap: "anywhere", textDecoration: "underline" }),
  list: style({ paddingInlineStart: "1.25rem" }),
  page: style({
    "@media": { [PHONE]: { padding: "48px 20px 88px" } },
    fontSize: "17px",
    lineHeight: 1.65,
    marginInline: "auto",
    maxWidth: "calc(48rem + 48px)",
    padding: "96px 24px 128px",
  }),
  pageContent: style({ marginInline: "auto", maxWidth: "48rem" }),
  pageTitle: style({
    "@media": { [PHONE]: { fontSize: "32px", marginBottom: "28px" } },
    fontSize: "clamp(36px, 4vw, 56px)",
    marginBottom: "40px",
  }),
  section: style({ marginTop: "56px" }),
  sectionTitle: style({
    "@media": { [PHONE]: { fontSize: "24px" } },
    fontSize: "28px",
    marginBottom: "16px",
  }),
  subsectionTitle: style({ fontSize: "20px", fontWeight: 500, margin: "24px 0 8px" }),
  subtitle: style({ color: color.muted, fontSize: "20px", fontWeight: 300 }),
  text: style({ marginBottom: "16px" }),
} as const
