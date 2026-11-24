import { t } from "@palamedes/core/macro"

import type { CaseStudyData } from "~/components/CaseStudy"

import { SERVICE_PATHS } from "~/data/services"

export const WITT_CASE_PATH = "/case-studies/witt"

/**
 * Fastner's April 2019–September 2020 engagement, using his published profiles.
 * @returns The localized account of the multi-brand frontend foundation.
 */
export function getWittCaseStudy(): CaseStudyData {
  return {
    description: t`Sebastian Fastner's frontend architecture work for the Witt Group, April 2019–September 2020: shared foundations for 17 multi-brand shops, Contentful, Apollo GraphQL, and release tests.`,
    lead: t`A multi-brand commerce business needed a frontend foundation for shops across international markets. I led the frontend rebuild for the Witt Group within the Otto Group, connecting shared application code, reusable content, and backend services.`,
    period: t`April 2019–September 2020 · Sebastian Fastner · Senior Frontend Architect`,
    sections: [
      {
        id: "context",
        paragraphs: [
          t`The project combined multiple brands and international markets. The frontend had to support that scope while giving content and backend integration a shared technical foundation.`,
          t`This account covers my Witt Group engagement from April 2019 to September 2020. I established technical foundations within this multi-brand program; the 17-shop figure describes the platform's scope.`,
        ],
        title: t`The situation`,
      },
      {
        id: "contribution",
        paragraphs: [
          t`I built the Next.js, React, and TypeScript frontend and an Apollo GraphQL layer. The GraphQL layer brought backend services together behind an interface the shop frontend could use. Styled Components supported the frontend implementation.`,
          t`Contentful supplied reusable content and control over SEO-related pages. I also built automated test infrastructure, including GraphQL query tests for the release process. AWS, Kubernetes, and Vault were part of the published deployment stack.`,
        ],
        title: t`Sebastian Fastner · My contribution`,
      },
      {
        id: "decisions",
        paragraphs: [
          t`A shared application foundation and reusable content addressed different parts of the multi-brand problem. Application code could provide common frontend behavior, while Contentful held content that could be reused across the shop context.`,
          t`The Apollo GraphQL layer gave backend orchestration its own place instead of making every interface work directly with each underlying service. Query tests checked that integration as part of releases.`,
        ],
        title: t`Shared code, content, and integration`,
      },
      {
        id: "result",
        paragraphs: [
          t`The delivered capabilities documented in my profiles are the frontend foundation for 17 multi-brand shops, the Apollo GraphQL layer, reusable Contentful pages, and automated tests. These describe my technical contribution within the wider commerce program.`,
        ],
        title: t`Delivered capabilities`,
      },
    ],
    service: { href: SERVICE_PATHS.modernization, label: t`React and TypeScript modernization` },
    sources: [
      { href: "/fastner", label: t`Fastner's full consultant profile` },
      { href: "/fastner/project-profile", label: t`Fastner's compact project profile` },
    ],
    title: t`Witt: shared commerce foundations`,
  }
}
