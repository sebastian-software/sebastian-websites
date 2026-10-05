import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

import {
  type AffectedCommand,
  assertValidBaseReference,
  createAffectedInvocation,
} from "../src/affected.ts"

const rootDirectory = path.resolve(fileURLToPath(new URL("../../..", import.meta.url)))
const commandArgument = process.argv[2]
const baseReference = process.env.QUALITY_BASE_REF ?? "origin/main"

if (commandArgument !== "agent:check" && commandArgument !== "build") {
  throw new Error("Usage: runAffected.ts <agent:check|build>")
}
const command: AffectedCommand = commandArgument

assertValidBaseReference(baseReference)

const diff = spawnSync(
  "git",
  ["diff", "--name-only", "--diff-filter=ACMR", `${baseReference}...HEAD`],
  {
    cwd: rootDirectory,
    encoding: "utf8",
  }
)

if (diff.status !== 0) {
  process.stderr.write(diff.stderr)
  process.exit(diff.status ?? 1)
}

const changedFiles = diff.stdout
  .split(/\r?\n/v)
  .map((file) => file.trim())
  .filter(Boolean)
const invocation = createAffectedInvocation(command, baseReference, changedFiles)
const selection =
  invocation.mode === "all"
    ? "all current workspaces"
    : `workspaces affected since ${baseReference}`

console.log(`Running ${command} in ${selection}.`)

const result = spawnSync("pnpm", invocation.args, {
  cwd: rootDirectory,
  stdio: "inherit",
})

process.exit(result.status ?? 1)
