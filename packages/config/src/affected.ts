export type AffectedCommand = "agent:check" | "build"

const globalFiles = new Set([
  "eslint.config.ts",
  "oxlint.config.ts",
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "prettier.config.mjs",
  "renovate.json",
])

const globalPrefixes = [".github/workflows/", "packages/config/"]

export type AffectedInvocation = {
  readonly args: readonly string[]
  readonly mode: "affected" | "all"
}

export function assertValidBaseReference(baseReference: string): void {
  if (
    baseReference.length === 0 ||
    baseReference.startsWith("-") ||
    baseReference.includes("..") ||
    !/^[\w.\/\-]+$/v.test(baseReference)
  ) {
    throw new Error(`Invalid quality base ref: ${JSON.stringify(baseReference)}`)
  }
}

export function isGlobalQualityChange(file: string): boolean {
  return globalFiles.has(file) || globalPrefixes.some((prefix) => file.startsWith(prefix))
}

export function createAffectedInvocation(
  command: AffectedCommand,
  baseReference: string,
  changedFiles: readonly string[]
): AffectedInvocation {
  assertValidBaseReference(baseReference)

  if (changedFiles.some((file) => isGlobalQualityChange(file))) {
    return {
      args: ["-r", "--if-present", "run", command],
      mode: "all",
    }
  }

  return {
    args: [
      "--filter",
      `...[${baseReference}]`,
      "--filter",
      "!sebastian-websites",
      "--if-present",
      "run",
      command,
    ],
    mode: "affected",
  }
}
