import { globalStyle } from "@vanilla-extract/css"

// ─── @page rule for print margins ────────────────────────────
// SINGLE SOURCE for print margins — matches the 25mm screen padding of
// `page`/`pageFlow` in `print.css.ts` for the 1:1 browser/Playwright PDF match.
// app/app.css contributes only the @bottom-center page counter (a margin
// box vanilla-extract cannot express); it must never declare margins.
// When printing from browser: keep "Margins: Default" in the print dialog
// ("None" would override this rule and push text to the paper edge).
// app/app.css owns the A4 page size. A4 minus the two 25mm margins is the
// 160mm physical width on `document`.
globalStyle("@page", {
  margin: "25mm",
})
