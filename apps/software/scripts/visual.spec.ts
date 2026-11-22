import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

import { visualViews } from "./visual-views.ts"

const evidence = path.resolve(
  process.env.SOFTWARE_VISUAL_EVIDENCE ?? path.join(import.meta.dirname, "../build/evidence")
)

for (const [title, filename] of visualViews()) {
  test(title, async () => {
    const actual = await readFile(path.join(evidence, filename))
    expect(actual).toMatchSnapshot(filename)
  })
}
