import { describe, expect, it } from "vitest"

import { image, responsiveImage } from "./image.ts"

const source = { height: 5942, path: "shooting-2024/shoot-19.jpg", width: 3961 }

describe("image", () => {
  it("crops the original before resizing and reports matching responsive dimensions", () => {
    const photo = image(source, { aspectRatio: [4, 3], focus: [0.5, 0.62], width: 800 })
    const url = new URL(photo.src)
    expect(url.hostname).toBe("assets.sebastian-software.com")
    expect(url.pathname).toBe("/shooting-2024/shoot-19.jpg")
    expect(url.searchParams.get("focus_crop")).toBe("3961,2970,0.5,0.62")
    // Bunny would ignore the focal point next to an aspect ratio.
    expect(url.searchParams.has("aspect_ratio")).toBe(false)
    expect(url.searchParams.get("quality")).toBe("85")
    expect(photo.width).toBe(800)
    expect(photo.height).toBe(600)
    expect(photo.srcSet.split(", ").map((entry) => entry.split(" ").at(-1))).toStrictEqual([
      "400w",
      "800w",
      "1600w",
    ])
  })

  it("zooms a focus crop for comparable framing and bounds the variants by it", () => {
    const portrait = responsiveImage(source, {
      aspectRatio: [7, 10],
      crop: { mode: "focus", point: [0.45, 0.38], zoom: 1.5 },
      width: 360,
    })
    const url = new URL(portrait.src)
    expect(url.searchParams.get("focus_crop")).toBe("2640,3771,0.45,0.38")
    expect(portrait.height).toBe(514)
    expect(portrait.srcSet).toContain(" 1080w")
    expect(() =>
      image(source, {
        aspectRatio: [1, 1],
        crop: { mode: "focus", point: [0.5, 0.5], zoom: 0.5 },
        width: 400,
      })
    ).toThrow("zoom must be at least 1")
  })

  it("encodes paths and supports centered crops and small portrait variants", () => {
    const photo = image(
      { ...source, path: "shooting-2024/team photo.jpg" },
      { aspectRatio: [1, 1], quality: 90, width: 144, widths: [216, 72, 144, 144] }
    )
    expect(photo.src).toContain("team%20photo.jpg")
    expect(photo.height).toBe(144)
    expect(photo.src).not.toContain("focus_crop")
    expect(photo.srcSet.split(", ")).toHaveLength(3)
  })

  it("rejects upscaling, invalid focal points, and paths escaping the asset host", () => {
    expect(() => image(source, { aspectRatio: [1, 1], width: 4000 })).toThrow(
      "Image variants must fit"
    )
    expect(() => image(source, { aspectRatio: [1, 1], focus: [0.5, 2], width: 800 })).toThrow(
      "Invalid focal coordinates"
    )
    expect(() =>
      image({ ...source, path: "../private.jpg" }, { aspectRatio: [1, 1], width: 800 })
    ).toThrow("relative asset path")
  })
})

describe("responsiveImage", () => {
  it("bounds every width descriptor by the source crop and removes duplicate variants", () => {
    const photo = responsiveImage(
      { height: 600, path: "images/small.jpg", width: 800 },
      { aspectRatio: [1, 1], width: 800, widths: [320, 600, 1200, 2400] }
    )
    const candidates = photo.srcSet.split(", ")
    expect(candidates.map((entry) => entry.split(" ").at(-1))).toStrictEqual(["320w", "600w"])
    for (const candidate of candidates) {
      const [url, descriptor] = candidate.split(" ")
      expect(`${new URL(url).searchParams.get("width")}w`).toBe(descriptor)
    }
    expect(new URL(photo.src).searchParams.get("width")).toBe("600")
  })

  it("keeps the face crop constant across resolutions and resizes after cropping", () => {
    const photo = responsiveImage(source, {
      aspectRatio: [4, 5],
      crop: { mode: "faces" },
      width: 800,
    })
    const crops = photo.srcSet.split(", ").map((entry) => {
      const url = new URL(entry.split(" ")[0])
      expect(url.searchParams.has("aspect_ratio")).toBe(false)
      return url.searchParams.get("face_crop")
    })
    expect(new Set(crops)).toStrictEqual(new Set(["3961,4951"]))
  })
})
