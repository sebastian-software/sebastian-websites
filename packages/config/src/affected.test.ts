import { describe, expect, it } from "vitest"

import {
  assertValidBaseReference,
  createAffectedInvocation,
  isGlobalQualityChange,
} from "./affected.ts"

describe("affected quality invocation", () => {
  it("checks changed workspaces and their dependents for app or package changes", () => {
    expect(
      createAffectedInvocation("agent:check", "origin/main", ["packages/ui/src/SiteHeader.tsx"])
    ).toStrictEqual({
      args: [
        "--filter",
        "...[origin/main]",
        "--filter",
        "!sebastian-websites",
        "--if-present",
        "run",
        "agent:check",
      ],
      mode: "affected",
    })
  })

  it("checks every current workspace for root quality contract changes", () => {
    expect(createAffectedInvocation("build", "abc1234", ["pnpm-workspace.yaml"])).toStrictEqual({
      args: ["-r", "--if-present", "run", "build"],
      mode: "all",
    })
    expect(isGlobalQualityChange("packages/config/src/eslint.ts")).toBe(true)
    expect(isGlobalQualityChange(".github/workflows/deploy.yml")).toBe(true)
  })

  it("rejects refs that could be interpreted as revisions or options", () => {
    expect(() => {
      assertValidBaseReference("-main")
    }).toThrow("Invalid quality base ref")
    expect(() => {
      assertValidBaseReference("main..feature")
    }).toThrow("Invalid quality base ref")
    expect(() => {
      assertValidBaseReference("main;echo")
    }).toThrow("Invalid quality base ref")
  })
})
