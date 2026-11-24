import { t } from "@palamedes/core/macro"

import type { CaseStudyData } from "~/components/CaseStudy"

import { SERVICE_PATHS } from "~/data/services"

export const REGRELLO_CASE_PATH = "/case-studies/regrello"

/**
 * The joint Regrello engagement, limited to already published project evidence.
 * @returns The localized account with separately attributed responsibilities.
 */
export function getRegrelloCaseStudy(): CaseStudyData {
  return {
    description: t`How Sebastian Werner and Sebastian Fastner worked on UI localization and user-content translation in Regrello's existing enterprise platform, from October 2024 to September 2025.`,
    lead: t`We worked on two related language problems in Regrello's enterprise platform: translating the application interface and enabling people using different languages to work with user-authored content. The work combined frontend integration with backend translation workflows.`,
    period: t`October 2024–September 2025 · Joint engagement`,
    sections: [
      {
        id: "context",
        paragraphs: [
          t`An existing collaborative product has more than application-owned labels. Workflow titles, task descriptions, and other user-entered text also carry information that people need to act on. A translated interface alone does not make those contents readable across languages.`,
          t`The public customer account describes an initial milestone for static UI strings and a second milestone for user-entered data. These scopes called for different handling of catalog messages, editable content, and asynchronous translation states.`,
        ],
        title: t`The situation`,
      },
      {
        id: "werner",
        paragraphs: [
          t`I led frontend internationalization in the established application. I integrated localization into the UI and built catalog extraction, compilation, and LLM-assisted translation workflows that retained translation metadata and language-specific terminology.`,
          t`Within the shared initiative, I implemented review interfaces for translated user content, including rich text, mention placeholders, permission-sensitive editing, and asynchronous states. I also worked on the frontend workspace, strict type-aware linting, GraphQL migration tooling, and targeted UI and end-to-end tests.`,
        ],
        title: "Sebastian Werner · Frontend",
      },
      {
        id: "fastner",
        paragraphs: [
          t`I developed backend translation workflows for new and changed application content, workflow titles, and task descriptions. A plugin system around GraphQL resolvers and mutations integrated translations into the Go service APIs, with Redis caching.`,
          t`Temporal workflows coordinated queues, workers, retries, throttling, and rate limits. I also built operational and CLI tools for managing jobs, testing workflows, and retrying failed translations. This work addressed the processing lifecycle behind the translated content shown in the frontend.`,
        ],
        title: "Sebastian Fastner · Backend",
      },
      {
        id: "result",
        paragraphs: [
          t`The published profiles describe working catalog tooling, translation integration through service APIs, operational workflows, and interfaces for reviewing translated content. These are concrete capabilities across the two scopes.`,
          t`Chris Lewis's recommendation describes our work with Regrello's internal project lead and praises the research and developer workflow. His account is dated August 2025 and describes the user-content milestone as ongoing at that time. It is a qualitative customer assessment; no numerical business or performance result is inferred from it.`,
        ],
        title: t`Capabilities and customer perspective`,
      },
    ],
    service: {
      href: SERVICE_PATHS.internationalization,
      label: t`Internationalization consulting`,
    },
    sources: [
      { href: "/werner/projects", label: t`Werner's detailed project history` },
      { href: "/fastner", label: t`Fastner's full consultant profile` },
      {
        href: "/references#recommendation-chris-lewis",
        label: t`Chris Lewis's complete recommendation`,
      },
    ],
    title: t`Regrello: internationalization in a live product`,
  }
}
