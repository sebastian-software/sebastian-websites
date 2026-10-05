/* eslint-disable security/detect-non-literal-fs-filename -- All paths are discovered below the repository root. */
import fs from "node:fs"
import path from "node:path"

import { extractModuleSpecifiers, findDependencyCycles } from "./moduleGraph.ts"

const dependencyFields = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
] as const

const ignoredDirectories = new Set([
  ".react-router",
  ".variant-build",
  "build",
  "dist",
  "node_modules",
  "public",
  "temp",
])

const sourceExtensions = new Set([".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx"])

type PackageManifest = {
  readonly dependencies?: Readonly<Record<string, string>>
  readonly devDependencies?: Readonly<Record<string, string>>
  readonly name?: string
  readonly optionalDependencies?: Readonly<Record<string, string>>
  readonly peerDependencies?: Readonly<Record<string, string>>
  readonly private?: boolean
  readonly version?: string
}

export type Workspace = {
  readonly dependencies: ReadonlyMap<string, string>
  readonly directory: string
  readonly kind: "app" | "package"
  readonly name: string
}

export type WorkspaceBoundaryResult = {
  readonly errors: readonly string[]
  readonly importCount: number
  readonly workspaces: readonly Workspace[]
}

type WorkspaceEntry = {
  readonly manifest: PackageManifest
  readonly workspace: Workspace
}

type DiscoveryContext = {
  readonly kind: Workspace["kind"]
  readonly parent: string
  readonly rootDirectory: string
}

type ImportValidationContext = {
  readonly rootDirectory: string
  readonly workspace: Workspace
  readonly workspaceByName: ReadonlyMap<string, Workspace>
  readonly workspaces: readonly Workspace[]
}

function isPackageManifest(value: unknown): value is { readonly name: string } & PackageManifest {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string" &&
    value.name.length > 0
  )
}

function collectSourceFiles(directory: string): string[] {
  const files: string[] = []

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue
    }

    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(entryPath))
    } else if (entry.isFile() && sourceExtensions.has(path.extname(entry.name))) {
      files.push(entryPath)
    }
  }

  return files
}

function collectDependencies(manifest: PackageManifest): Map<string, string> {
  const dependencies = new Map<string, string>()

  for (const field of dependencyFields) {
    for (const [name, version] of Object.entries(manifest[field] ?? {})) {
      dependencies.set(name, version)
    }
  }

  return dependencies
}

function readWorkspaceEntry(
  context: DiscoveryContext,
  entry: fs.Dirent
): undefined | WorkspaceEntry {
  if (!entry.isDirectory()) {
    return undefined
  }

  const directory = path.join(context.rootDirectory, context.parent, entry.name)
  const manifestPath = path.join(directory, "package.json")
  if (!fs.existsSync(manifestPath)) {
    return undefined
  }

  const manifest: unknown = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  if (!isPackageManifest(manifest)) {
    throw new Error(`${path.relative(context.rootDirectory, manifestPath)} has no package name`)
  }

  return {
    manifest,
    workspace: {
      dependencies: collectDependencies(manifest),
      directory,
      kind: context.kind,
      name: manifest.name,
    },
  }
}

function discoverWorkspaceGroup(
  rootDirectory: string,
  parent: string,
  kind: Workspace["kind"]
): WorkspaceEntry[] {
  const parentDirectory = path.join(rootDirectory, parent)
  if (!fs.existsSync(parentDirectory)) {
    return []
  }

  return fs
    .readdirSync(parentDirectory, { withFileTypes: true })
    .map((entry) => readWorkspaceEntry({ kind, parent, rootDirectory }, entry))
    .filter((entry): entry is WorkspaceEntry => entry !== undefined)
}

function discoverWorkspaces(rootDirectory: string): readonly WorkspaceEntry[] {
  return [
    ...discoverWorkspaceGroup(rootDirectory, "apps", "app"),
    ...discoverWorkspaceGroup(rootDirectory, "packages", "package"),
  ]
}

function findImportedWorkspace(
  specifier: string,
  workspaceByName: ReadonlyMap<string, Workspace>
): undefined | Workspace {
  return [...workspaceByName.entries()]
    .sort(([left], [right]) => right.length - left.length)
    .find(([name]) => specifier === name || specifier.startsWith(`${name}/`))?.[1]
}

function containsPath(parent: string, child: string): boolean {
  const relative = path.relative(parent, child)
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative))
}

function validateManifest(
  workspace: Workspace,
  manifest: PackageManifest,
  workspaceByName: ReadonlyMap<string, Workspace>
): string[] {
  const errors: string[] = []

  if (workspace.kind === "package" && (manifest.private !== true || manifest.version !== "0.0.0")) {
    errors.push(`${workspace.name} must be private and use version 0.0.0`)
  }

  for (const [dependency, version] of workspace.dependencies) {
    const target = workspaceByName.get(dependency)
    if (target && !version.startsWith("workspace:")) {
      errors.push(`${workspace.name} must declare ${dependency} with the workspace: protocol`)
    }
    if (target?.kind === "app" && workspace.kind === "package") {
      errors.push(`${workspace.name} must not depend on app ${dependency}`)
    }
  }

  return errors
}

function validateWorkspaceTarget(
  workspace: Workspace,
  target: Workspace,
  relativeFile: string
): string[] {
  const errors: string[] = []
  if (!workspace.dependencies.has(target.name)) {
    errors.push(`${relativeFile} imports undeclared workspace ${target.name}`)
  }
  if (workspace.kind === "package" && target.kind === "app") {
    errors.push(`${relativeFile} must not import app ${target.name}`)
  }
  return errors
}

function validateRelativeImport(
  context: ImportValidationContext,
  file: string,
  specifier: string
): string[] {
  const resolvedImport = path.resolve(path.dirname(file), specifier)
  const crossedWorkspace = context.workspaces.find(
    (candidate) =>
      candidate.name !== context.workspace.name && containsPath(candidate.directory, resolvedImport)
  )
  return crossedWorkspace
    ? [
        `${path.relative(context.rootDirectory, file)} crosses into ${crossedWorkspace.name} via a relative import`,
      ]
    : []
}

function validateSpecifier(
  context: ImportValidationContext,
  file: string,
  specifier: string
): string[] {
  const relativeFile = path.relative(context.rootDirectory, file)
  const target = findImportedWorkspace(specifier, context.workspaceByName)
  if (target) {
    return validateWorkspaceTarget(context.workspace, target, relativeFile)
  }
  if (specifier.startsWith(".")) {
    return validateRelativeImport(context, file, specifier)
  }
  return []
}

function validateImports(context: ImportValidationContext): {
  readonly errors: readonly string[]
  readonly importCount: number
} {
  const errors: string[] = []
  let importCount = 0

  for (const file of collectSourceFiles(context.workspace.directory)) {
    const source = fs.readFileSync(file, "utf8")
    const specifiers = extractModuleSpecifiers(source, file)
    importCount += specifiers.length
    for (const specifier of specifiers) {
      errors.push(...validateSpecifier(context, file, specifier))
    }
  }

  return { errors, importCount }
}

function createWorkspaceGraph(
  workspaces: readonly Workspace[],
  workspaceByName: ReadonlyMap<string, Workspace>
): ReadonlyMap<string, readonly string[]> {
  return new Map(
    workspaces.map((workspace) => [
      workspace.name,
      [...workspace.dependencies.keys()].filter((dependency) => workspaceByName.has(dependency)),
    ])
  )
}

export function validateWorkspaceBoundaries(rootDirectory: string): WorkspaceBoundaryResult {
  const entries = discoverWorkspaces(rootDirectory)
  const workspaces = entries.map(({ workspace }) => workspace)
  const workspaceByName = new Map(workspaces.map((workspace) => [workspace.name, workspace]))
  const errors: string[] = []
  let importCount = 0

  for (const { manifest, workspace } of entries) {
    errors.push(...validateManifest(workspace, manifest, workspaceByName))
    const importResult = validateImports({
      rootDirectory,
      workspace,
      workspaceByName,
      workspaces,
    })
    errors.push(...importResult.errors)
    importCount += importResult.importCount
  }

  for (const cycle of findDependencyCycles(createWorkspaceGraph(workspaces, workspaceByName))) {
    errors.push(`Workspace dependency cycle: ${cycle.join(" -> ")}`)
  }

  return {
    errors: [...new Set(errors)].sort(),
    importCount,
    workspaces,
  }
}
