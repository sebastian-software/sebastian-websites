import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { BunnyImage } from "./BunnyImage.tsx"

const src = { height: 3000, path: "shooting-2024/portrait.jpg", width: 4000 }

function documentFor(element: Parameters<typeof renderToStaticMarkup>[0]): Document {
  return new DOMParser().parseFromString(renderToStaticMarkup(element), "text/html")
}

describe("BunnyImage", () => {
  it("offers mobile and Retina widths in the initial HTML and preserves native attributes", () => {
    const document = documentFor(
      <BunnyImage
        alt="A portrait"
        className="portrait"
        data-placement="profile"
        height={600}
        sizes="(max-width: 767px) 90vw, 800px"
        src={src}
        width={800}
      />
    )
    const img = document.querySelector("img")!
    expect(document.querySelector("picture")).toBeNull()
    expect(img.getAttribute("srcset")).toContain(" 320w")
    expect(img.getAttribute("srcset")).toContain(" 1920w")
    expect(img.getAttribute("sizes")).toBe("(max-width: 767px) 90vw, 800px")
    expect(img.getAttribute("alt")).toBe("A portrait")
    expect(img.className).toBe("portrait")
    expect(img.dataset.placement).toBe("profile")
    expect(img.getAttribute("loading")).toBe("lazy")
    expect(img.getAttribute("decoding")).toBe("async")
  })

  it("renders an independently responsive mobile face crop and reserves its aspect ratio", () => {
    const document = documentFor(
      <BunnyImage
        alt="A portrait"
        crop={{ mode: "focus", point: [0.4, 0.3] }}
        height={450}
        loading="lazy"
        priority
        sizes="800px"
        sources={[
          {
            aspectRatio: [4, 5],
            crop: { mode: "faces" },
            media: "(max-width: 767px)",
            sizes: "90vw",
          },
        ]}
        src={src}
        width={800}
      />
    )
    const source = document.querySelector("picture > source")!
    const img = document.querySelector("picture > img")!
    expect(source.getAttribute("media")).toBe("(max-width: 767px)")
    expect(source.getAttribute("sizes")).toBe("90vw")
    expect(source.getAttribute("width")).toBe("800")
    expect(source.getAttribute("height")).toBe("1000")
    expect(source.getAttribute("srcset")).toContain("face_crop=2400%2C3000")
    expect(source.getAttribute("srcset")).toContain(" 1920w")
    expect(img.getAttribute("src")).toContain("focus_crop=")
    expect(img.getAttribute("loading")).toBe("eager")
    expect(img.getAttribute("fetchpriority")).toBe("high")
  })

  it("uses unpublished local originals without claiming resized variants", () => {
    const document = documentFor(
      <BunnyImage
        alt="Local illustration"
        height={600}
        sizes="100vw"
        src={{ ...src, localSrc: "/src/images/illustration.png" }}
        width={800}
      />
    )
    const img = document.querySelector("img")!
    expect(img.getAttribute("src")).toBe("/src/images/illustration.png")
    expect(img.hasAttribute("srcset")).toBe(false)
  })
})
