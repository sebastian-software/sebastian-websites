import path from "node:path"
import { fileURLToPath } from "node:url"

import { validateWorkspaceBoundaries } from "../src/workspaceBoundaries.ts"

const rootDirectory = path.resolve(fileURLToPath(new URL("../../..", import.meta.url)))
const result = validateWorkspaceBoundaries(rootDirectory)

if (result.errors.length > 0) {
  for (const error of result.errors) {
    console.error(`Workspace boundary error: ${error}`)
  }
  process.exitCode = 1
} else {
  console.log(
    `Workspace boundaries: ${result.workspaces.length} workspaces, ${result.importCount} imports, acyclic dependency graph.`
  )
}
