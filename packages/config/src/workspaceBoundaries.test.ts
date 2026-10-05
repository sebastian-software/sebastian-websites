import { describe, expect, it } from "vitest"

import { extractModuleSpecifiers, findDependencyCycles } from "./moduleGraph.ts"

describe("workspace boundaries", () => {
  it("extracts static, exported, required, and dynamic module references", () => {
    expect(
      extractModuleSpecifiers(`
        import value from "@sebastian-websites/ui"
        export { value } from "@sebastian-websites/brand"
        const dynamic = import("@sebastian-websites/web-core")
        const legacy = require("external")
      `)
    ).toStrictEqual([
      "@sebastian-websites/ui",
      "@sebastian-websites/brand",
      "@sebastian-websites/web-core",
      "external",
    ])
  })

  it("reports dependency cycles while accepting an acyclic graph", () => {
    expect(
      findDependencyCycles(
        new Map([
          ["app", ["ui"]],
          ["brand", []],
          ["ui", ["brand"]],
        ])
      )
    ).toStrictEqual([])

    expect(
      findDependencyCycles(
        new Map([
          ["brand", ["ui"]],
          ["ui", ["brand"]],
        ])
      )
    ).toStrictEqual([["brand", "ui", "brand"]])
  })
})
