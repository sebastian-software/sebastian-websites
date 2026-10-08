import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { FaviconLinks } from "./FaviconLinks.tsx"
import { createWebManifest, FAVICONS, WEB_MANIFEST_PATH } from "./favicons.ts"

describe("favicons", () => {
  it("links the root ICO, the brand's hashed icons, and the stable manifest", () => {
    const view = renderToStaticMarkup(<FaviconLinks brand="consulting" />)
    expect(view).toContain('<link href="/favicon.ico" rel="icon" sizes="32x32"/>')
    expect(view).toContain(
      `<link href="${FAVICONS.consulting.svg}" rel="icon" type="image/svg+xml"/>`
    )
    expect(view).toContain(
      `<link href="${FAVICONS.consulting.appleTouch}" rel="apple-touch-icon"/>`
    )
    expect(view).toContain(`<link href="${WEB_MANIFEST_PATH}" rel="manifest"/>`)
  })

  it("describes the site name and the brand's three manifest icons", () => {
    const manifest: unknown = JSON.parse(createWebManifest("software", "Sebastian Software"))
    expect(manifest).toStrictEqual({
      icons: [
        { sizes: "192x192", src: FAVICONS.software.icon192, type: "image/png" },
        { purpose: "maskable", sizes: "512x512", src: FAVICONS.software.mask, type: "image/png" },
        { sizes: "512x512", src: FAVICONS.software.icon512, type: "image/png" },
      ],
      name: "Sebastian Software",
    })
  })
})
