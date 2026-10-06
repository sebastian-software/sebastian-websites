import { describe, expect, it } from "vitest"

import { image } from "./image.ts"

const source = { height: 5942, path: "shooting-2024/shoot-19.jpg", width: 3961 }

describe("image", () => {
  it("crops the original before resizing and reports matching responsive dimensions", () => {
    const photo = image(source, { aspectRatio: [4, 3], focus: [0.5, 0.62], width: 800 })
    const url = new URL(photo.src)
    expect(url.hostname).toBe("sebastian-websites-assets.b-cdn.net")
    expect(url.pathname).toBe("/shooting-2024/shoot-19.jpg")
    expect(url.searchParams.get("focus_crop")).toBe("3961,2970,0.5,0.62")
    expect(url.searchParams.get("aspect_ratio")).toBe("4:3")
    expect(url.searchParams.get("quality")).toBe("85")
    expect(photo.width).toBe(800)
    expect(photo.height).toBe(600)
    expect(photo.srcSet.split(", ").map((entry) => entry.split(" ").at(-1))).toStrictEqual([
      "400w",
      "800w",
      "1600w",
    ])
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
