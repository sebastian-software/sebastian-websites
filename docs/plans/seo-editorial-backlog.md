# Evidence-led technical articles

Prepared on 2026-11-17 for #139 and the first-post work in #22. The audience is
developers and technical leads making decisions in existing products. The order
reflects available public evidence and the reader's next decision. No search-volume,
traffic, or conversion baseline is available to justify a demand forecast.

## 1. UI strings and user content need different translation models

- **Reader / question:** A lead adding languages to a collaborative product asks
  whether a message catalog also solves translation of customer-authored text.
- **Answer / format:** An article comparing the two lifecycles, with a small
  illustrative versioned-field record and explicit missing/stale/failure states.
- **Evidence:** Chris Lewis's already published recommendation describes the two
  Regrello milestones. ICU's primary documentation explains message units and
  variable formatting. The record and decision table are illustrative, not a
  disclosure of Regrello's schema or a measured project result.
- **Authors / factual review:** Fastner and Werner, reviewing their joint scope.
- **Languages / destination:** The first paired `de` and `en` article, shared ID
  and slug `ui-strings-and-user-content`, on the tech blog. German uses “du”.
- **Next action:** `consulting-internationalization`, for a reader whose product
  needs help with these decisions. The service page retains commercial details.
- **Why first:** Public proof is available, the distinction is concrete, and the
  article does not depend on publishing customer code or private measurements.
- **Refresh trigger:** A substantive correction to the explanation or its cited
  public account; do not change the date for a routine rebuild.

## 2. Introduce a catalog without stopping feature delivery

- **Reader / question:** A React/TypeScript lead asks how to migrate existing UI
  text while the team continues releasing features.
- **Answer / format:** A worked migration of one small, original example:
  message boundaries, placeholders, extraction, review, fallback, and rollout.
- **Evidence required:** Current public Palamedes documentation and a runnable,
  newly authored example, checked against the version named by the article.
  The repository's current macro/catalog workflow is supporting engineering
  evidence, not a claim about every customer's deployment.
- **Author / factual review:** Werner for frontend integration; Fastner reviews
  the catalog and delivery boundaries.
- **Languages / destination:** English first; German when the authors choose to
  translate. The tech blog explains the decision; API reference stays at
  [Palamedes](https://palamedes.dev).
- **Next action:** `palamedes-docs`; link the related first article where content
  translation is outside the example's scope.
- **Why second:** It turns the first distinction into an implementable UI slice.
- **Refresh trigger:** A release changes the demonstrated API or extraction and
  runtime behavior. Re-run the example before updating claims or dates.

## 3. Choose the first slice of a frontend modernization

- **Reader / question:** A technical lead needs to choose what to modernize first
  without committing to a full rewrite.
- **Answer / format:** A decision walkthrough comparing one bounded interface
  change with its release and rollback boundaries. Include what evidence could
  overturn the preferred choice.
- **Evidence required:** Public project-role descriptions from the Consulting
  profiles and an original worked example. Any performance or delivery
  comparison needs an actual reproducible measurement before inclusion.
- **Author / factual review:** Fastner for shared commerce foundations; Werner
  reviews frontend boundaries and team handover.
- **Languages / destination:** English first, optional German counterpart on the
  tech blog. Link a relevant public case study once available.
- **Next action:** `consulting-enablement` (the registered modernization route).
- **Why third:** It expands beyond localization while using the same bounded
  change and evidence discipline. It must add a concrete example beyond the
  existing modernization service page.
- **Refresh trigger:** A cited platform or example changes, or evidence invalidates
  a recommendation. Preserve the historical scope of project accounts.

## 4. Make an architecture review useful to the implementing team

- **Reader / question:** A lead asks what a review should leave behind so the
  team can actually act on it.
- **Answer / format:** An annotated original example of one decision: observed
  constraint, alternatives, selected action, owner, acceptance evidence, and
  the condition for revisiting it.
- **Evidence required:** Public architecture roles and an original sample
  decision. Do not reproduce a customer's internal RFC or report. Claims about
  delivery improvements need their own public evidence.
- **Author / factual review:** Werner, with Fastner reviewing the implementation
  and operational consequences.
- **Languages / destination:** English first; German optional. Publish on the
  tech blog, linking the architecture service and relevant public case study.
- **Next action:** `consulting-architecture`.
- **Why fourth:** It needs a useful review artifact, not a restatement of the
  architecture service page's offer.
- **Refresh trigger:** A substantive change to the sample decision or its
  implementation assumptions.

## Publishing and learning

The first article is included with this plan. Later entries are briefs, not
promises of a quota or assigned publication dates. Use the existing
`internationalization` tag where relevant; do not register tags for unwritten
posts. Images follow the current Ardo publishing guide, which supersedes the
old no-raster notes in the audit issues. This launch article needs no image to
explain its example.

Before merging the first article, land the identity/byline/article-data work
(#130, #131, #138, #124) and review the two authored versions. Keep promotion
separate: there is no authorization here to post on social accounts or contact
readers. After deployment, inspect feed entries and search/indexing separately
from any later evidence about useful visits, qualified questions, or inquiries.
The next editorial decision should use actual reader feedback and available
search queries, with their source and collection limits recorded.

For #22, the PR sets `BLOG_NAVIGATION` to `launching`. After an authorized
deployment, run both blog smoke checks, read both feeds, check social previews,
and validate the accessible article markup. Only then prepare the follow-up
change to `live`. A successful local build is not evidence of a deployment.
