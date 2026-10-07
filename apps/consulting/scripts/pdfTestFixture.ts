type PdfFixtureOptions = {
  readonly author?: string
  readonly height?: number
  readonly link?: string
  readonly subject?: string
  readonly text?: string
  readonly title?: string
  readonly width?: number
}

type ProjectProfilePdfFixtureOptions = {
  readonly height?: number
  readonly links?: readonly string[]
  readonly locale?: "de" | "en"
  readonly pageCount?: number
  readonly text?: string
  readonly textTop?: number
  readonly width?: number
}

const XREF_OFFSET_WIDTH = 10
const LINK_RECTANGLE_BOTTOM = 740
const LINK_RECTANGLE_TOP = 760
const LINK_VERTICAL_GAP = 24

function escapePdfString(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)")
}

function wrapPdfText(value: string, maximumLineLength = 56): string[] {
  const lines: string[] = []
  let line = ""
  for (const word of value.split(" ")) {
    const candidate = line.length === 0 ? word : `${line} ${word}`
    if (candidate.length > maximumLineLength && line.length > 0) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line.length > 0) lines.push(line)
  return lines
}

function pdfReferences(references: readonly number[]): string {
  return references.map((reference) => `${String(reference)} 0 R`).join(" ")
}

function defaultProjectProfileText(locale: "de" | "en"): string {
  const localeSpecificText =
    locale === "de"
      ? [
          "Sofort verfügbar",
          "Ausgewählte Projektnachweise · Fintech & E-Commerce",
          "Ausgewählte Projektnachweise · Enterprise-SaaS & Internationalisierung",
          "Banking und Asset Management",
          "E-Commerce",
          "Enterprise-SaaS",
        ]
      : [
          "Available immediately",
          "Selected Project Experience · Fintech & E-Commerce",
          "Selected Project Experience · Enterprise SaaS & Internationalization",
          "banking and asset management",
          "e-commerce",
          "enterprise SaaS",
        ]
  return [
    "Sebastian Fastner",
    "Senior React & TypeScript Developer · Frontend Architect",
    "Sebastian Software GmbH",
    "DWS",
    "Witt",
    "Regrello",
    "Terminaro",
    "Palamedes",
    ...localeSpecificText,
  ].join(" ")
}

export function createPdfFixture({
  author = "Sebastian Consulting",
  height = 841.89,
  link = "https://example.com/",
  subject = "Fixed-price consulting assessment",
  text = "Test Document",
  title = text,
  width = 595.28,
}: PdfFixtureOptions = {}): Uint8Array {
  const content = `BT /F1 12 Tf 72 770 Td (${escapePdfString(text)}) Tj ET`
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R /Annots [6 0 R] >>`,
    `<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Type /Annot /Subtype /Link /Rect [72 750 160 780] /Border [0 0 0] /A << /S /URI /URI (${escapePdfString(link)}) >> >>`,
    `<< /Title (${escapePdfString(title)}) /Author (${escapePdfString(author)}) /Subject (${escapePdfString(subject)}) >>`,
  ]
  let pdf = "%PDF-1.4\n"
  const offsets = [0]
  for (const [index, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(pdf, "latin1"))
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  }
  const xrefOffset = Buffer.byteLength(pdf, "latin1")
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  pdf += offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(XREF_OFFSET_WIDTH, "0")} 00000 n \n`)
    .join("")
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 7 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`
  return Buffer.from(pdf, "latin1")
}

/**
 * Creates the smallest multi-page PDF that exercises project-profile artifact contracts.
 *
 * @param options - Page, locale, text, and link overrides for a negative fixture.
 * @returns A complete in-memory PDF fixture.
 */
// eslint-disable-next-line max-statements, complexity -- intentionally assembles a complete PDF object graph
export function createProjectProfilePdfFixture(
  options: ProjectProfilePdfFixtureOptions = {}
): Uint8Array {
  const { height = 841.89, locale = "de", pageCount = 5, textTop = 790, width = 595.28 } = options
  const links = options.links ?? [
    "https://terminaro.eu/",
    "https://palamedes.dev/",
    locale === "de"
      ? "https://sebastian-consulting.de/fastner"
      : "https://sebastian-consulting.com/fastner",
  ]
  const text = options.text ?? defaultProjectProfileText(locale)
  const objects: string[] = [
    "",
    "",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  ]
  const addObject = (value: string): number => {
    objects.push(value)
    return objects.length
  }
  const pageReferences: number[] = []

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const pageText = pageIndex === 0 ? text : `Project profile page ${String(pageIndex + 1)}`
    const textCommands = wrapPdfText(pageText)
      .map((line, index) => `${index === 0 ? "" : "T* "}(${escapePdfString(line)}) Tj`)
      .join(" ")
    const content = `BT /F1 12 Tf 14 TL 36 ${String(textTop)} Td ${textCommands} ET`
    const contentReference = addObject(
      `<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}\nendstream`
    )
    const annotationReferences =
      pageIndex === 0
        ? links.map((link, linkIndex) =>
            addObject(
              `<< /Type /Annot /Subtype /Link /Rect [36 ${String(LINK_RECTANGLE_BOTTOM - linkIndex * LINK_VERTICAL_GAP)} 180 ${String(LINK_RECTANGLE_TOP - linkIndex * LINK_VERTICAL_GAP)}] /Border [0 0 0] /A << /S /URI /URI (${escapePdfString(link)}) >> >>`
            )
          )
        : []
    const annotations =
      annotationReferences.length === 0 ? "" : ` /Annots [${pdfReferences(annotationReferences)}]`
    const pageReference = addObject(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${String(contentReference)} 0 R${annotations} >>`
    )
    pageReferences.push(pageReference)
  }

  objects[0] = "<< /Type /Catalog /Pages 2 0 R >>"
  objects[1] = `<< /Type /Pages /Kids [${pdfReferences(pageReferences)}] /Count ${String(pageReferences.length)} >>`

  let pdf = "%PDF-1.4\n"
  const offsets = [0]
  for (const [index, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(pdf, "latin1"))
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  }
  const xrefOffset = Buffer.byteLength(pdf, "latin1")
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  pdf += offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(XREF_OFFSET_WIDTH, "0")} 00000 n \n`)
    .join("")
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`
  return Buffer.from(pdf, "latin1")
}
