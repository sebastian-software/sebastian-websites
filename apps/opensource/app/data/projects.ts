import { t } from "@palamedes/core/macro"
import { FAMILIES } from "@sebastian-websites/content"

import type { CuratedEntry, Exclusions } from "~/lib/collection"

/** What a project is written in; a Rust core alone does not decide where it runs. */
export type Technology = "cpp-core" | "rust-core" | "rust" | "typescript"

/** What kind of thing a project is. */
export type Kind = "cli-library" | "cli" | "compiler" | "configuration" | "library" | "service"

/** Where a project runs. */
export type Runtime = "browser-node" | "build" | "native-node" | "native" | "node" | "self-hosted"

/** One additional project as a tile; classification is editorial (ADR-0005). */
export type Project = {
  readonly description: string
  readonly kind: Kind
  readonly runtime: Runtime
  readonly technology: Technology
} & CuratedEntry

/**
 * The featured projects, in editorial order. Effective Agent is the skills
 * collection; it has no repository entry in the metrics service of its own.
 */
export const FEATURED = ["palamedes", "ferramenta", "dalo", "ardo", "effective-agent"] as const

/**
 * Repositories without a tile: the featured stories, the Ferramenta engines
 * presented by their family, and the Effective repositories the owners have not
 * released for the site yet.
 */
export const EXCLUSIONS: Exclusions = {
  family: FAMILIES.ferramenta.engines,
  featured: FEATURED,
  withheld: FAMILIES.effective,
}

/**
 * The curated additional projects, grounded in each repository's own sources.
 * The order here does not matter: the page sorts by recent activity.
 */
export const CURATED = [
  {
    group: "tools",
    kind: "cli",
    name: "Paratix",
    repo: "paratix",
    runtime: "node",
    technology: "typescript",
  },
  {
    group: "tools",
    kind: "cli",
    name: "Harness Relay",
    repo: "harness-relay",
    runtime: "node",
    technology: "typescript",
  },
  {
    group: "tools",
    kind: "service",
    name: "Relanto",
    repo: "relanto",
    runtime: "self-hosted",
    technology: "typescript",
  },
  {
    group: "tools",
    kind: "cli",
    name: "mdtheme",
    repo: "mdtheme",
    runtime: "native",
    technology: "rust",
  },
  {
    group: "tools",
    kind: "cli",
    name: "Offcourse",
    repo: "offcourse",
    runtime: "node",
    technology: "typescript",
  },
  {
    group: "tools",
    kind: "service",
    name: "Stellara",
    repo: "stellara",
    runtime: "self-hosted",
    technology: "typescript",
  },
  {
    group: "tools",
    kind: "cli",
    name: "Antigraph",
    repo: "antigraph",
    runtime: "node",
    technology: "typescript",
  },
  {
    group: "tools",
    kind: "cli-library",
    name: "Cuttledoc",
    repo: "cuttledoc",
    runtime: "native",
    technology: "rust-core",
  },
  {
    group: "tools",
    kind: "compiler",
    name: "Naos",
    repo: "naos-ui",
    runtime: "build",
    technology: "typescript",
  },
  {
    group: "libraries",
    kind: "library",
    name: "xlsx-format",
    repo: "xlsx-format",
    runtime: "browser-node",
    technology: "typescript",
  },
  {
    group: "libraries",
    kind: "configuration",
    name: "Oxlint Config Setup",
    repo: "oxlint-config-setup",
    runtime: "build",
    technology: "typescript",
  },
  {
    group: "libraries",
    kind: "configuration",
    name: "ESLint Config Setup",
    repo: "eslint-config-setup",
    runtime: "build",
    technology: "typescript",
  },
  {
    group: "libraries",
    kind: "library",
    name: "pdfium-node",
    repo: "pdfium-node",
    runtime: "native-node",
    technology: "cpp-core",
  },
] as const satisfies ReadonlyArray<Omit<Project, "description">>

export type CuratedRepo = (typeof CURATED)[number]["repo"]

function descriptions(): Readonly<Record<CuratedRepo, string>> {
  return {
    antigraph: t`Turn books from your Kindle library into searchable Markdown.`,
    cuttledoc: t`Transcribe speech locally with a Rust core and native CLI.`,
    "eslint-config-setup": t`Share prebuilt lint rules and practical guardrails across TypeScript teams.`,
    "harness-relay": t`Let one coding agent hand a bounded task to another local harness.`,
    mdtheme: t`Keep Markdown headers, footers, branding and badges consistent across repositories.`,
    "naos-ui": t`Compile TSX into lightweight Web Components for the browser.`,
    offcourse: t`Keep online courses available offline, with local transcription support.`,
    "oxlint-config-setup": t`Apply prebuilt, type-aware lint configurations to TypeScript projects.`,
    paratix: t`Describe a VPS in TypeScript and apply changes over SSH.`,
    "pdfium-node": t`Render selected PDF pages as thumbnails through native PDFium bindings.`,
    relanto: t`Send application email through your own SMTP servers and a shared HTTP API.`,
    stellara: t`Bring search, browser tools and memory behind one self-hosted AI gateway.`,
    "xlsx-format": t`Read and write modern Excel files in the browser and Node.js.`,
  }
}

/**
 * The curated additional projects with their descriptions.
 *
 * @returns The projects with descriptions in the active language.
 */
export function getProjects(): readonly Project[] {
  const text = descriptions()
  return CURATED.map((project) => ({ ...project, description: text[project.repo] }))
}
