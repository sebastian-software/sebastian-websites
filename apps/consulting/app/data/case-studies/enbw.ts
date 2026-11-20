import { t } from "@palamedes/core/macro"

import type { CaseStudyData } from "~/components/CaseStudy"

import { SERVICE_PATHS } from "~/data/services"

export const ENBW_CASE_PATH = "/case-studies/enbw"

/**
 * Werner's EnBW contribution, based on the current public project history.
 * @returns The localized, individually attributed architecture account.
 */
export function getEnbwCaseStudy(): CaseStudyData {
  return {
    description: t`Sebastian Werner's frontend architecture work on EnBW customer portals and a support workbench: shared foundations, tenant configuration, and API-independent layouts, June 2022–February 2024.`,
    lead: t`Customer self-service and support applications needed shared frontend foundations while retaining tenant-specific features, content, communication options, and visual identity. I contributed architecture and implementation within the project teams.`,
    period: t`June 2022–February 2024 · Sebastian Werner · Frontend Expert / React Architect`,
    sections: [
      {
        id: "context",
        paragraphs: [
          t`The EnBW work covered customer portals and a support workbench. Customer workflows included contracts, invoices, meter readings, tariff changes, and relocation. The white-label platform supported differences between tenants in both functionality and presentation.`,
          t`Shared components had to fit that context. Reuse required clear boundaries between application routing, data integration, configuration, and the presentation that could be used across applications.`,
        ],
        title: t`The situation`,
      },
      {
        id: "contribution",
        paragraphs: [
          t`I built the PNPM/Turborepo workspace, shared theme and configuration packages, Storybook foundations, typed API integration, and reusable data-access utilities. These were frontend foundations used within the wider team effort.`,
          t`I documented how to separate routing and data integration from reusable, API-independent presentation layouts. The architecture used headless UI primitives and typed style and asset themes. The application layer could compose those pieces for its own tenant and workflow.`,
        ],
        title: t`Sebastian Werner · My contribution`,
      },
      {
        id: "decisions",
        paragraphs: [
          t`Keeping presentation layouts independent of a particular API gave the team a defined place for backend integration. Shared themes and configuration represented differences between tenants without making every reusable component responsible for the whole application.`,
          t`Storybook provided a component-development foundation alongside the applications. Typed integration and shared data-access utilities connected those interfaces to the APIs. React, TypeScript, Vite, Radix, VanillaExtract, SWR, REST, and GraphQL were part of the published project stack.`,
        ],
        title: t`Architecture boundaries`,
      },
      {
        id: "result",
        paragraphs: [
          t`The documented result is a set of shared frontend capabilities: workspace and tooling foundations, themes, configuration, component development, and typed integration. I contributed these foundations as part of the project teams' work on the customer portals and support workbench.`,
          t`Tobias Arweiler's recommendation describes our architecture discussions and implementation work at EnBW. Emanuele De Monte's account describes my frontend contribution within the same client context. These are attributed colleague perspectives, with their original dates and wording preserved on the references page.`,
        ],
        title: t`Capabilities and colleague perspectives`,
      },
    ],
    service: { href: SERVICE_PATHS.architecture, label: t`Architecture reviews` },
    sources: [
      { href: "/werner/projects", label: t`Werner's detailed project history` },
      {
        href: "/references#recommendation-tobias-arweiler",
        label: t`Tobias Arweiler's complete recommendation`,
      },
      {
        href: "/references#recommendation-emanuele-de-monte",
        label: t`Emanuele De Monte's complete recommendation`,
      },
    ],
    title: t`EnBW: shared frontend foundations`,
  }
}
