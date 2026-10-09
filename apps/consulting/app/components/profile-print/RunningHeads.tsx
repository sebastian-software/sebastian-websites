import type { ReactNode } from "react"

import { COMPANY_BRAND } from "~/lib/untranslated"

import type { Consultant } from "./types"

/**
 * Quotes a value as a CSS string; `<` is escaped so the text cannot close the element.
 *
 * @param value - Plain text for a `content` declaration.
 * @returns The quoted CSS string.
 */
function cssString(value: string): string {
  const escaped = value
    .replaceAll("\\", String.raw`\\`)
    .replaceAll('"', String.raw`\"`)
    .replaceAll("<", String.raw`\3C `)
    .replaceAll("\n", String.raw`\A `)
  return `"${escaped}"`
}

/**
 * Running heads and feet of the printed profile. Page margin boxes cannot be
 * expressed in vanilla-extract and need the consultant's own name, so they are
 * written per document. The first page carries the logo in its content and
 * therefore no running head; the page counter replaces the shared centered one
 * of app/styles/print-pages.css.
 *
 * @param props - The consultant whose name, title and mailbox run along the pages.
 * @param props.consultant - The profile's consultant.
 * @returns A style element with the document's page margin boxes.
 */
export function RunningHeads({ consultant }: { consultant: Consultant }): ReactNode {
  const marginText = `font-family: Glober, system-ui, sans-serif; font-size: 8pt; color: oklch(0.42 0.01 2);`
  const css = `@page {
  @top-left { content: ${cssString(COMPANY_BRAND)}; ${marginText} vertical-align: bottom; padding-bottom: 8mm; }
  @top-right { content: ${cssString(`${consultant.name} · ${consultant.title}`)}; ${marginText} vertical-align: bottom; padding-bottom: 8mm; }
  @bottom-left { content: ${cssString(`${consultant.name} · ${consultant.email}`)}; ${marginText} vertical-align: top; padding-top: 8mm; }
  @bottom-center { content: none; }
  @bottom-right { content: counter(page) " / " counter(pages); ${marginText} vertical-align: top; padding-top: 8mm; }
}
@page :first {
  @top-left { content: none; }
  @top-right { content: none; }
}`
  return <style>{css}</style>
}
