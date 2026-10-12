import { t } from "@palamedes/core/macro"

export type Recommendation = {
  readonly author: string
  readonly authorHref: string
  readonly date: string
  readonly id: string
  readonly quote: string
  readonly topic: string
}

/** Verified in the signed-in profile on October 12, 2026. */
export const RECOMMENDATIONS_SOURCE =
  "https://www.linkedin.com/in/swernerx/details/recommendations/"

/**
 * Verbatim English excerpts from VISIBLE received recommendations in the
 * October 6, 2026 LinkedIn export. These were received by Werner; Lewis's
 * recommendation explicitly describes both consultants' work at Regrello.
 * Author links and dates were cross-checked on LinkedIn on October 12, 2026.
 * Exported company and job-title fields are omitted because they do not
 * establish the author's affiliation when the recommendation was written.
 * German excerpts are translated and identified as translations in the UI.
 *
 * @returns The recommendation about the joint internationalization project.
 */
export function getFeaturedRecommendation(): Recommendation {
  return {
    author: "Chris Lewis",
    authorHref: "https://www.linkedin.com/in/cmslewis/",
    date: "2025-08-22",
    id: "chris-lewis",
    quote: t`For the past several months, they've been working on the behemoth Milestone 2: translating user-inputted data in such a way that users from different locales can collaborate on millions of user-created entities in our platform in whatever language they each individually prefer. The Sebastians have been instrumental in this effort as well.`,
    topic: t`Internationalization at Regrello`,
  }
}

/**
 * Selected perspectives on architecture, product judgment, and collaboration.
 * Every quote is one contiguous excerpt; names and meaning are preserved.
 *
 * @returns Six curated recommendations in the active language.
 */
export function getRecommendations(): readonly Recommendation[] {
  return [
    getFeaturedRecommendation(),
    {
      author: "Travis Glover",
      authorHref: "https://www.linkedin.com/in/travis-n-glover-0tng0/",
      date: "2026-07-30",
      id: "travis-glover",
      quote: t`He helped us establish a scalable localization architecture across several applications and significantly improved the developer workflow around translations. His work consistently ensured that our localization efforts were accurate, maintainable, and provided an excellent experience for users across different languages and regions.`,
      topic: t`Localization and developer experience`,
    },
    {
      author: "Mike Cozart",
      authorHref: "https://www.linkedin.com/in/mikecozart/",
      date: "2026-07-09",
      id: "mike-cozart",
      quote: t`A front-end expert, he consistently balances user experience, product strategy, and business goals to ship work of exceptional quality. Beyond his technical skill, he elevates everyone around him—thoughtful, collaborative, and genuinely a pleasure to have on a team.`,
      topic: t`Product judgment and frontend engineering`,
    },
    {
      author: "Damian Osipiuk",
      authorHref: "https://www.linkedin.com/in/damian-osipiuk/",
      date: "2025-08-22",
      id: "damian-osipiuk",
      quote: t`Sebastian excels at identifying opportunities for improvement while remaining pragmatic and collaborative, ensuring that progress is made without unnecessary friction. I was particularly impressed by his user-centric mindset.`,
      topic: t`Pragmatic engineering and user experience`,
    },
    {
      author: "Tobias Arweiler",
      authorHref: "https://www.linkedin.com/in/tobias-arweiler/",
      date: "2024-01-30",
      id: "tobias-arweiler",
      quote: t`In our shared project at EnBW he was an important voice for a sane and technologically sound software architecture, as well as a great sparring partner with any technological question or idea you'd come up with.`,
      topic: t`Architecture at EnBW`,
    },
    {
      author: "Kai S",
      authorHref: "https://www.linkedin.com/in/kai-s-b5a78618a/",
      date: "2023-11-14",
      id: "kai-s",
      quote: t`One of Sebastian’s most admirable qualities is his willingness to listen and offer guidance. Whenever I encountered a challenge, Sebastian was there with a patient ear and practical solutions.`,
      topic: t`Mentoring and knowledge sharing`,
    },
  ]
}
