import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

const evidence = path.resolve(
  process.env.SOFTWARE_VISUAL_EVIDENCE ?? path.join(import.meta.dirname, "../build/evidence")
)

for (const [title, filename] of [
  ["Homepage on desktop", "software-de-1440-home.png"],
  ["Homepage on a phone", "software-de-390-home.png"],
  ["Header scrolling over the product image", "software-de-1440-sticky-header.png"],
]) {
  test(title, async () => {
    const actual = await readFile(path.join(evidence, filename))
    expect(actual).toMatchSnapshot(filename)
  })
}
