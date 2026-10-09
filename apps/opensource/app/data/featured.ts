import type { ImageSource } from "@sebastian-websites/web-core"

import { t } from "@palamedes/core/macro"

import ardoBook from "~/assets/illustrations/ardo-documentation-book.png?bunny"
import daloSetup from "~/assets/illustrations/dalo-agent-setup.png?bunny"
import effectiveAgentRobot from "~/assets/illustrations/effective-agent-robot.png?bunny"
import ferramentaDocuments from "~/assets/illustrations/ferramenta-documents.png?bunny"
import palamedesCatalogs from "~/assets/illustrations/palamedes-catalogs.png?bunny"

import type { FEATURED } from "./projects"

export type FeaturedId = (typeof FEATURED)[number]

/** One featured project as an illustrated story with its own identity. */
export type FeaturedProject = {
  readonly actions: ReadonlyArray<{ readonly href: string; readonly label: string }>
  readonly description: string
  readonly id: FeaturedId
  /** The drawing beside the text. */
  readonly illustration: { readonly alt: string; readonly src: ImageSource }
  readonly name: string
  readonly title: string
}

/**
 * The featured projects in editorial order. Ferramenta stays one family: its
 * engines appear inside its story, never as tiles of their own. Effective Agent
 * closes the list and leads to its own site.
 *
 * @returns The featured projects in the active language.
 */
export function getFeatured(): readonly FeaturedProject[] {
  return [
    {
      actions: [{ href: "https://palamedes.dev", label: t`Explore Palamedes` }],
      description: t`Write messages close to the code, keep source-string catalogs in your repository, and let a native toolchain extract, validate, and compile them. Palamedes brings TypeScript applications into more languages with one runtime model.`,
      id: "palamedes",
      illustration: {
        alt: t`A drawn messages.po catalog in front of cards for German, French, Spanish, and Japanese.`,
        src: palamedesCatalogs,
      },
      name: "Palamedes",
      title: t`Rust-powered internationalization.`,
    },
    {
      actions: [
        { href: "https://ferramenta.dev", label: t`Explore Ferramenta` },
        { href: "https://ferromark.dev", label: t`Learn about Ferromark` },
      ],
      description: t`A family of independent tools for document and text work: regular expressions, syntax highlighting, Markdown, spell checking, translation catalogs, file walking, and PDF previews. Choose the engine that solves your task; each one can be inspected and used on its own.`,
      id: "ferramenta",
      illustration: {
        alt: t`A drawn Ferromark document stamped “Markdown into documents” beside books and a wooden stamp.`,
        src: ferramentaDocuments,
      },
      name: "Ferramenta",
      title: t`Rust engines and applications for documents and text.`,
    },
    {
      actions: [{ href: "https://dalo.sh", label: t`Open Dalo` }],
      description: t`Keep skills, standing instructions, and hooks in Git. Dalo resolves one approved setup and delivers it to the folders your coding agents already read, so teams can keep shared practices across people and machines.`,
      id: "dalo",
      illustration: {
        alt: t`Drawn cards for skills, instructions, and hooks in a tray beside a mug.`,
        src: daloSetup,
      },
      name: "Dalo",
      title: t`Manage your agent's setup. Just ask.`,
    },
    {
      actions: [{ href: "https://ardo-docs.dev", label: t`Open Ardo` }],
      description: t`Build documentation with your React stack and keep the content in your repository. Ardo brings guides, API reference, and navigation into a site your team can maintain, without moving docs into a closed platform.`,
      id: "ardo",
      illustration: {
        alt: t`A drawn open book with an Ardo table of contents and the line “Build beautiful docs with React”.`,
        src: ardoBook,
      },
      name: "Ardo",
      title: t`Modern, open documentation for React teams.`,
    },
    {
      actions: [
        { href: "https://effective-agent.dev", label: t`Explore Effective Agent` },
        {
          href: "https://github.com/sebastian-software/effective-agent",
          label: t`View on GitHub`,
        },
      ],
      description: t`Seven open-source skills that put our way of working into instructions a coding agent can follow: product decisions, web, engineering, delivery, writing, marketing, and image work. Install one for your next task, read every reference before you trust it, and combine them when the work crosses disciplines.`,
      id: "effective-agent",
      illustration: {
        alt: t`A drawn little tin robot with glowing eyes, connected by a cable to a device holding seven colored cartridges.`,
        src: effectiveAgentRobot,
      },
      name: "Effective Agent",
      title: t`Better judgment for coding agents.`,
    },
  ]
}
