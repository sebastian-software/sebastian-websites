import { globalStyle } from "@vanilla-extract/css"

// Printed pages are white paper. The shared base paints the body in the site
// canvas tint, which would otherwise fill the space below the last sheet.
// `:root body` outranks the shared `body` rule regardless of stylesheet order.
globalStyle(":root body", {
  "@media": { print: { backgroundColor: "white" } },
})
