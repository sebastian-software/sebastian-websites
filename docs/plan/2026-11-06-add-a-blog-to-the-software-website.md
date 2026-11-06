# Add a blog to the Software website

**Plan status:** Not implemented
**Source:** effective-flow plan
**Recommended workflow:** Feature (`effective-flow build`)

## Requirement

Add a blog to `sebastian-software.de` and `sebastian-software.com` to carry the November 2026 marketing strategy. The strategy's approach is to talk about the work so that paying customers follow. Posts answer buyer and adoption questions. They are distributed by hand on LinkedIn and in a monthly newsletter. The strategy plans two main posts per month and suggests November 17, 2026 for the first one. That date is a target, not a commitment, because the launch depends on an Ardo release.

The Software website runs on Ardo 6.3.0 (ADR-0019), and Ardo already generates its sitemap and robots file. Ardo 6.3.0 has a `publication` feature for Markdown/MDX posts. It provides an overview page, RSS 2.0 and Atom feeds, author profiles, drafts, and future-dated posts. This plan builds on that feature and extends Ardo where a gap is reusable. It adds no CMS (ADR-0004), fork, or custom feed generator.

Planning baseline: repository HEAD `6542970` on November 6, 2026. The working tree had uncommitted changes to `.gitignore` and `AGENTS.md`, plus an untracked `docs/adr/0020-effective-flow-project-setup.md`. None of them affects this plan. Before implementation, compare against the current `main` and reconcile any drift.

### Owner decisions on November 6, 2026

**Languages and posts**

- **Language-specific posts.** `sebastian-software.de` lists German posts and `sebastian-software.com` lists English posts. Posts are not translated by default. A translated post has a counterpart in the other language, linked through hreflang. A post without a counterpart exists on one domain only. This is a documented exception to the shared-path rule of ADR-0010.
- **The first post appears in both languages.** Both domains launch with the blog, its navigation item, and at least one post.
- **Language switch without a counterpart.** On a page with no counterpart, the switch links to the other language's blog overview.
- **Tags are fixed English keys with translated labels.** A tag archive that exists in both languages gets hreflang. An archive that exists in one language only is a second allowed single-language page class.

**Ardo and the launch**

- **Ardo first, then launch.** Ardo 6.3.0 has three gaps that the website cannot work around:
  - It hard-codes the overview canonical as `…/blog/`, with a trailing slash.
  - It emits no hreflang and renders a fixed `ArdoPostList`.
  - It injects its own canonical and social meta on every post.

  The site cannot override any of this, and the hosting gate rejects it. The launch therefore waits for an Ardo release with the reusable extensions listed below. The gate gets no exception for `/blog`.

- **Feed IDs become unique per publication.** The Ardo release changes feed entry IDs so that a translated pair keeps one shared post `id` without colliding across the two feeds.

**Publishing**

- **Future-dated posts are allowed.** A post with a future `publishedAt` may be merged into `main`. It appears with the first deploy after its date. The owners accept that such a post can be read in the public repository before its date (ADR-0012). ADR-0012's content rules still apply when the post is merged.
- **Shared build time.** Both language builds use one shared build time. `build.ts` copies only posts that are due by then. Ardo needs no extension for this. Scheduled CI builds stay out of scope. A post that falls due goes live with the next merge or a manual re-run of the Deploy workflow.
- **Images.** Raster images in posts go through Bunny, using a generic image-provider extension in Ardo and a Bunny binding in this repository.
  - The blog launches without raster images in post bodies, cover images, or author avatars.
  - A separate plan adds those images once the provider is released.
  - Social previews use a Bunny default image from the start.
- **What launches together.** The navigation item, overview, feeds, tag archives, and the first approved post. The repository contains no public sample post, and the owners write the post copy.

**Site features**

- **Brand navigation.** The blog item belongs to the Software brand navigation. It therefore also appears on every other site of that brand (Open Source, app-tracking, Skills) as a cross-site link, like Products.
- **Tag archives come from Ardo,** in the same release, as part of the launch.
- **Every post has a primary next step.** Every post must set `nextStep`. The value `none` explicitly marks a development report.
- **Scope of the first build:** overview, post pages, RSS/Atom, author profiles, Open Graph social previews, tag archives, and the next-step box.

### Workflow rationale

Feature: the plan adds new pages, routes, feeds, navigation, and upstream framework capabilities.

## Outcome checkpoint

**Primary source:** The user request "Plane ein Blog-System" (November 6, 2026). It builds on the marketing strategy thread and its notes `blog-strategie.md` and `ardo-blog-check.md`, which are outside this repository.

**Original outcome:** An actionable plan for a blog on the Software website. The blog has language-specific posts, feeds, author profiles, social previews, tag archives, and a mandatory next step per post. It launches together with a first real post in both languages. This planning run authorizes no implementation, Ardo issue, release, or deployment.

**Last evaluated attempt:** None. This is a fresh baseline.

**No-progress count:** 0

**Cumulative approach:**

- The repository and the installed Ardo 6.3.0 package were inspected read-only.
- The owner decisions are recorded above.
- Two plan reviews ran: a regular one and a deep interactive one. Their findings are incorporated.

**Continuation decision:** None.

## Architecture decisions

### Publication setup

- **One publication per language build.** Each variant build sets `publication.from` to its own staged post directory and sets `to: "blog"`. Ardo's `i18n` option is not enabled, because it adds the locale prefixes that ADR-0010 rejects. Each build is monolingual, so Ardo's `default` publication belongs to that domain.
- **Post sources.** They live in `apps/software/content/blog/<locale>/`.
- **Staging.** `build.ts` fixes one build time per run. It then stages into `.variant-build/<variant>/content/blog/` only the posts that are not drafts and whose `publishedAt` is no later than that time. Ardo's own clock is always later than this time, so it cannot exclude a staged post or include an unstaged one.
- **Shared build time.** `build.ts` writes the build time next to `client/`, not inside it, so it is not uploaded. It also derives `__BUILD_YEAR__` from that time.
- **Empty directories.** `build.ts` creates an empty staged directory where Git dropped one, because Ardo's `readPostFiles` fails on a missing directory.
- **Generated routes.** Ardo regenerates `app/routes/blog` only inside the temporary variant directory, which is never committed.

### Cross-language index and validation

A new blog module in `packages/web-core` reads the frontmatter of every post in both languages, including drafts and future-dated posts, and validates it. Its vitest suite covers it.

- **Same `id`, same path.** A post with the same `id` in both languages must have the same path.
- **Same path, same `id`.** A path present in both languages must share one `id`.
- **Unique `id`.** An `id` must be unique within a language, drafts included, because Ardo no longer sees unstaged drafts.
- **`nextStep`.** Every post must have `nextStep`, and it must be in the closed set.
- **Tags.** Tags must be known keys from the tag registry.
- **No raster images.** The source must contain no raster image references (see "Raster-image check").

From the posts that are due by the shared build time, the module builds a cross-language index. For each language it lists post `id`, path, `nextStep`, and tags. Each variant build receives the index as build data, the same way metrics arrive today. The index drives hreflang, the language switch, the next-step box, and the tag-archive alternates.

Ardo 6.3.0 drops unknown frontmatter keys in `validatePageFrontmatter` (Ardo `dist/vite/index.js` lines 478–485), so the post page reads `nextStep` from the index, not from page frontmatter. Ardo already rejects unknown authors, timestamps without a time zone, and an `updatedAt` earlier than `publishedAt`. The module does not repeat those checks.

### Translation pairs and tags

- **Translation pairs** share one post `id` and one path. Generic slugs stay English for both languages, as ADR-0010 requires.
- **Tag keys and labels.** Tags are English, lowercase, hyphenated keys from one registry module. The registry holds the keys only. Translated labels are Palamedes `t` macros, so they stay in `pmds extract`, `check:translations`, and `lint:messages`. Ardo feed categories carry the key.
- **Tag archive languages.** A tag archive exists in a language if at least one due post in that language uses the tag. An archive present in both languages gets reciprocal hreflang.

### Ardo epic

The epic is filed after owner confirmation in the implementation run. Each issue carries a reduced reproduction against Ardo's default behaviour. Items 1–3 gate the launch, and items 4–6 do not.

1. **Custom publication presentation and metadata.**
   - A site can supply its own overview, post-frame, and tag-archive components and route `meta`.
   - That metadata replaces Ardo's generated metadata instead of being added to it. Ardo currently injects a canonical link, `og:url`, `og:title`, `og:type=article`, `og:image`, and Twitter tags on post routes, using the title separator `" | "` (Ardo `dist/vite/index.js` lines 3497–3534 and 3590–3594). The overview meta is also fixed (lines 4568–4599). Adding site metadata on top would produce two canonical links.
2. **URL and feed correctness.**
   - A configurable trailing-slash policy, so that publication, post, tag, and feed links can have no trailing slash. `publication.url` and `post.url` end with `/` today (lines 3922 and 4650).
   - Feed entry IDs that are unique per publication, for example built from the publication URL and the post `id`. Today they are `urn:ardo:post:<id>` (line 4523).
   - A feed language: RSS `<language>` and Atom `xml:lang`.
3. **Tag archives.**
   - Generated `/blog/tags/<key>` routes, rendered through the item 1 hook and listed in the sitemap.
   - Tag keys must already be valid slugs, and colliding keys are rejected.
   - Archive labels come from the site.
4. **The publication respects `buildTime`** (optional). The site's own staging already makes the builds consistent.
5. **Custom post fields on `Post`** (optional). The site's index already carries `nextStep`.
6. **Image provider** (optional, for the follow-up image plan).
   - An interface for `renderFamily`, `renderJpeg`, and `storeImage`: it receives the source, crop, width, and format, and returns URLs.
   - sharp stays the default.
   - The same interface covers author avatars.

### Site integration and SEO

- **Frame and helpers stay in charge.** Blog pages render inside the existing `SiteHeader` and `PageEnding` frame. Canonical, hreflang, and Open Graph come from `seoMeta`, without trailing slashes, through the item 1 hook. The site does not post-process generated HTML or bypass Ardo validation.
- **Hosting gate: compare the builds, don't trust a list.** A new `seoPlans(builds)` in `hosting/seo.ts` takes all builds and returns one plan per variant: the expected alternates for each path and the expected sitemap paths. `deploy.ts` passes those plans into `verify()`. `VerifyOptions` takes the plan instead of recomputing it from one target. `verifySeo` checks each origin against its own plan. The rules:
  - A path present in both builds of a site needs reciprocal hreflang and `x-default`.
  - Only the Software site may have a path in one build only. Two kinds qualify:
    - A post, meaning a path matching `/blog/<one segment>` other than `tags`, whose head carries `og:type=article`.
    - A tag archive under `/blog/tags/<key>`.

    Both must carry no hreflang alternates.

  - Every other unpaired path fails.
  - A site with a build in one language but not the other fails.
  - A pair whose recorded build times differ fails.
- **Secretless CI entry point.** A new `hosting/check-builds.ts`, run as `pnpm hosting:plan`, executes the pre-upload checks from `deploy.ts` without the Bunny credentials. CI runs it after `pnpm build` across all buildable targets.
- **Browser check.** `check-browser.ts` (`checkRoute`) follows the same alternate rules.
- **Language switch without a counterpart.** The shared frame accepts an optional counterpart for each page. `getSiteFrame` receives it. When a page has no counterpart, `getLanguageLinks` falls back to the other language's blog overview. `SiteHeader` still renders a normal link. Sites that have no blog always have counterparts, so their output is unchanged.
- **Navigation.** A `blog` destination joins the Software brand navigation in `packages/web-core/src/frame.ts`, with labels in `packages/ui/src/frame/frameCopy.ts`. It applies to Software, Open Source, app-tracking, and Skills (`SITE_BRAND`), while Consulting is unchanged. The footer `index` is unchanged. Update the "Software journal" comment in `frame.ts`. The existing `isCurrent` prefix rule highlights the item on posts and tag archives.
- **Mandatory primary next step.** `nextStep` takes one value from a closed set:
  - `products`, `open-source`, `contact`, or `none`;
  - a named Consulting offer;
  - a named external documentation target such as palamedes.dev.

  The set lives in one module. The post frame renders one box at the end of the article, except for `none`.

- **Open Graph on every indexable Software page.** `seoMeta` gains `og:title`, `og:description`, `og:url` set to the canonical, `og:type`, `og:locale`, `og:image`, and a matching Twitter card.
  - Posts get `og:type=article` with published and modified times.
  - The 404 page has no canonical, so it gets no `og:url`.
  - Until the image plan, `og:image` is a single Bunny default image owned by the repository. It is resolved with `responsiveImage()` and never assembled by hand.
- **Feed discovery.** RSS and Atom links go in the head of the overview, the posts, and the tag archives. The overview also shows visible subscribe links. The feeds are `/blog/rss.xml` and `/blog/atom.xml` on each domain, served with XML media types.
- **Author profiles.** Ardo's `authors` configuration carries only the founders' names, which are not translated, plus an optional profile URL. That is all Ardo's feeds use. Founder roles and bios stay Palamedes `t` macros in a shared founder module. `Founders.tsx` and the post author line both use that module. No locale-keyed copy is created outside Palamedes.

### Content rules

- **Withdrawn and renamed posts.** `PathRule` in `hosting/redirects.ts` gains an optional `locale`, and so do `planLegacyPath` and `smokeChecks`.
  - A withdrawn single-language post answers HTTP 410 only on its own domain. On the other domain the unknown path stays 404, as ADR-0010 requires.
  - A renamed post keeps its `id`. Its old path redirects only on the domains where it existed.
- **Raster-image check.**
  - The source check rejects:
    - the frontmatter fields `coverImage`, `images`, `ogImage`, and `twitterImage`;
    - any inline or reference-style Markdown image whose target is not `.svg`;
    - any `<img`, `<picture`, `<source`, or `<Image` element;
    - MDX imports of non-SVG files;
    - author `avatar` entries.
  - The output check asserts that `blog/**/index.html` and the feed content contain no non-SVG `<img>`, and that the client contains no publication image renditions.
- **Public repository.** `draft: true` hides a post from the site, not from GitHub. Draft copy stays outside the public repository, including pull-request branches, until it may be public. ADR-0012's content rules (no unannounced products, no uncleared personal data) apply when a post is merged, not on its `publishedAt` date.

### ADRs

A new ADR-0021 records:

- the publication feature;
- language-specific posts and tags;
- the Ardo extensions;
- staging by shared build time;
- the publishing routine: merge, or re-run Deploy, once a post falls due;
- the accepted early visibility of future-dated posts.

Three existing ADRs are updated in place:

- **ADR-0010:** single-language posts and tag archives.
- **ADR-0006:** posts are not translated by default.
- **ADR-0009:** a production state is one commit plus a recorded build time. Software's two language variants are built, compared, and published together. Single-variant builds are for development only.

### Delivery slicing

These steps do not depend on the Ardo release. Each may merge in its own pull request:

- step 3: the web-core index and its validation;
- step 5: Open Graph for the existing pages;
- step 6: the `seoPlans` comparison and `hosting:plan` in CI;
- the counterpart model from step 7, with no navigation item yet.

Only the launch pull request carries:

- the Ardo pin;
- the `publication` configuration;
- the blog presentation;
- the navigation item;
- the first post.

## Affected files

| File                                                                                                                            | Description                                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ardo repository (separate epic, issues, PRs)                                                                                    | Extensions 1–3 before launch. Extensions 4–6 are filed and do not gate the launch.                                                                                                                                                                                  |
| `apps/software/package.json`                                                                                                    | Pin the Ardo release with extensions 1–3. Add the `check:fixtures` script.                                                                                                                                                                                          |
| `apps/software/vite.config.ts`                                                                                                  | Per-variant `publication` (`from`, `to: "blog"`, `name`, `description`, `authors`), the presentation hooks, and the cross-language index as build data.                                                                                                             |
| `apps/software/scripts/build.ts`                                                                                                | Shared build time; staging only posts that are due and not drafts; the build-time file next to `client/`; `__BUILD_YEAR__` derived from the build time; `--content`, `--build-time`, and `--out` options for fixtures; the existing `404/index.html` normalization. |
| `apps/software/scripts/development.ts`                                                                                          | Mirror and watch `content/`.                                                                                                                                                                                                                                        |
| `apps/software/scripts/check-fixtures.ts` (new) and `apps/software/test/fixtures/blog/` (new)                                   | Fixture builds into scratch output. They cover draft and future-date exclusion at two build times, strict feed parsing, the empty state, the language-switch fallback, and the raster-image checks.                                                                 |
| `apps/software/content/blog/{de,en}/`                                                                                           | Post sources. At launch they contain the first approved post in both languages.                                                                                                                                                                                     |
| `packages/web-core/src/` (new blog module plus tests)                                                                           | The cross-language index and its validation, the `nextStep` set, the tag-key registry, and counterpart resolution.                                                                                                                                                  |
| `packages/web-core/src/seo.ts`, `seo.test.ts`, `apps/software/app/lib/seo.ts`                                                   | Open Graph and Twitter metadata, hreflang only where a counterpart exists, and article metadata.                                                                                                                                                                    |
| `packages/web-core/src/frame.ts`, `frame.test.ts`, `packages/ui/src/frame/frameCopy.ts`, `packages/ui/src/frame/SiteHeader.tsx` | Brand-wide `blog` destination, the optional counterpart, and the language-link fallback. Assertions cover Software, Open Source, app-tracking, Skills, and an unchanged Consulting.                                                                                 |
| `apps/software/app/components/Founders.tsx` and a new shared founder module                                                     | Founder copy from one source, still in Palamedes.                                                                                                                                                                                                                   |
| `apps/software/app/root.tsx`, new `apps/software/app/components/blog/`                                                          | Overview, post frame, author line, tag list and tag archive, next-step box, feed links, empty state, and translated tag labels.                                                                                                                                     |
| `apps/software/app/locales/{en,de}.po`                                                                                          | Blog UI copy and tag labels.                                                                                                                                                                                                                                        |
| `hosting/seo.ts`, `seo.test.ts`, `verify.ts`, `deploy.ts`, `check-builds.ts` (new), root `package.json` (`hosting:plan`)        | The `seoPlans` comparison, verification driven by the plan, the build-time pair check, and the secretless CI entry point.                                                                                                                                           |
| `hosting/redirects.ts`, `hosting/smoke.ts`, `hosting/hosting.test.ts`, the Bunny middleware configuration if needed             | Locale-scoped `PathRule`; smoke checks for `/blog`, `/blog/rss.xml`, and `/blog/atom.xml` with content types; XML media types.                                                                                                                                      |
| `apps/software/scripts/check-browser.ts`                                                                                        | `checkRoute` alternate rules; checks for the overview, a post, a tag archive, the next-step box, and feed links; `.xml` in the media map; baseline comparison skipped for paths missing from the baseline.                                                          |
| `.github/workflows/ci.yml`                                                                                                      | Run `pnpm hosting:plan` and `check:fixtures` after `pnpm build`, and measure the job time against the 20-minute timeout.                                                                                                                                            |
| `docs/adr/0021-blog-on-the-software-website.md` (new), ADR-0006, ADR-0009, ADR-0010                                             | The decisions above.                                                                                                                                                                                                                                                |
| `docs/operations/` (new guide)                                                                                                  | Writing, review checklist (including the ADR-0012 rules at merge time), translation, tags, scheduling and the Deploy re-run, rename, withdrawal, and the image ban until the image plan.                                                                            |

## Implementation details

### Approach

1. **Integration spike.** Before the Ardo work, run a local, non-public spike against Ardo 6.3.0. Confirm the recorded gaps against the fixture (extensions 1–3 and the feed-ID collision). Record how the directory output serves `/blog/<slug>` and `/blog/<slug>/`, and which Ardo labels remain visible. A gap that turns out to be site-specific stays in the website.
2. **Ardo epic and release.** Once the owner confirms, file the epic and the issues. Implement and release extensions 1–3 in Ardo. File extensions 4–6 without waiting for them.
3. **Index and validation.** Build the web-core blog module and its tests. This step may merge before the release.
4. **Build plumbing.** Add the shared build time, staging, the build-time file, fixture options, the `check:fixtures` script, and content mirroring in development.
5. **SEO and social metadata.** Add Open Graph for every indexable page; it may merge before the release. Add feed discovery.
6. **Hosting and CI.** Add `seoPlans` with verification driven by the plan. Add `hosting:plan` and the CI steps. Add locale-scoped redirects and smoke checks. Add the media types. This step may merge before the release.
7. **Counterpart model and navigation.** The counterpart model may merge before the release. The navigation item merges only with the launch.
8. **Blog presentation.** Pin the Ardo release and configure `publication`. Build the overview, post frame, tag archive, and empty state. Follow ADR-0016 to ADR-0018. Give each heading the largest `typeStep()` at which it needs at most three lines on a laptop.
9. **ADRs and operations guide.**
10. **First post and launch.** Add the owners' approved first post in German and English, with a shared `id`, tags, and `nextStep`. Its `publishedAt` must not be later than the CI run of the launch pull request. A build guard fails when the navigation item is active and either language has no published post. Deliver through a pull request, and publish through the existing merge-to-`main` deployment.

### Component structure

- `BlogIndex` lists the posts of the publication.
- `BlogEmpty` is shown when the publication has no posts. It links to the other language's blog.
- `BlogPost` wraps the generated article body. It shows `PostMeta` (dates, and authors from the shared founder module), `PostTags` (translated labels linking to the archives), `NextStep`, and `PostTranslationLink`.
- `TagArchive` lists the posts of one tag.
- `FeedLinks` is shared by the pages above.

All of these plug into the extension 1 hook.

### State management

Not relevant. All pages are static build output. The cross-language index and the post lists are build data.

### API integration

Not relevant at runtime. The build reads the post files, and Ardo emits the feeds. There is no social posting, newsletter, or CRM automation.

### Styling approach

Use Vanilla Extract with the existing tokens: `typeStep()`, `SPACE_SCALE`, `scaled()`, and `bleed()`. Add no size breakpoint overrides. Long-form text uses a readable measure in the page grid. Code blocks and tables must not cause horizontal page scrolling at 390px. The third header item must fit at 390px on every site of the Software brand.

### Accessibility

- Each page has one `h1`.
- A post is an `article`, with its date in a `time` element.
- Authors and tags are readable text. Each tag link names its tag.
- The next-step box is a normal link with descriptive text.
- Feed links have accessible names.
- The language-switch fallback is labelled as the other language's blog, not as a translation.
- The browser check covers focus and contrast as on other pages.

### Edge cases

- **Single-language post or tag archive.** It has a self canonical and no hreflang. The other domain returns the branded 404. The language switch links to the other blog overview.
- **Translation pair.** It has the same path, reciprocal hreflang, and `x-default` on `.com`. The build fails when a shared `id` has different paths, or when a shared path has different IDs.
- **No published post in one language** (possible later, after a withdrawal). `/blog` shows the empty state, and its feeds are valid and empty. The navigation-guard rule applies only to the launch build.
- **Draft.** It is never staged, so it is absent from every output. Its `id` still counts for the uniqueness check.
- **Future `publishedAt`.** The post is not staged until a build whose shared time has passed its date. It is visible in the repository before that date, which the owners accepted.
- **Missing time zone, or `updatedAt` earlier than `publishedAt`.** Ardo rejects the post.
- **Missing or unknown `nextStep`, or an unknown tag key.** The build fails.
- **Tag with a single post.** Its archive is valid and lists one entry.
- **Renamed post.** It keeps its `id`, and only the domains it existed on get a locale-scoped redirect.
- **Withdrawn post.** Only its own domains answer 410.
- **MDX with components.** Ardo requires `feedContent`. The guide recommends plain Markdown first.
- **Raster image in a post before the image plan.** The source and output checks reject it.
- **One-variant build.** `build:de` and `build:en` are for development only. The gate rejects an unpaired or time-mismatched pair.

## Acceptance criteria

**Before merge** (reviewed on the launch pull request):

- [ ] The Ardo epic exists, extensions 1–3 are released, and `apps/software/package.json` pins that release. Extensions 4–6 are filed.
- [ ] ADR-0021 exists. ADR-0006, ADR-0009, and ADR-0010 reference it. The operations guide covers the review checklist, tags, scheduling, renames, and withdrawals.

**Measured in CI** on the launch pull request:

- [ ] `pnpm build` produces both Software variants, each with:
  - `/blog/index.html`;
  - the first post's `index.html`;
  - one archive per tag that post uses;
  - `/blog/rss.xml` and `/blog/atom.xml`.
- [ ] `pnpm hosting:plan` passes for all buildable targets. Every blog document has:
  - exactly one self canonical with no trailing slash;
  - an `html lang` that matches the variant;
  - no `noindex`;
  - reciprocal hreflang and `x-default` for paired paths.

  Each sitemap lists exactly the published blog documents of its domain.

- [ ] `hosting/seo.test.ts` proves these cases:
  - a single-language post passes without alternates;
  - a single-language tag archive passes;
  - an unpaired path outside the allowed classes fails;
  - a paired page without alternates fails;
  - a missing language build fails;
  - mismatched build times fail;
  - `verifySeo` checks each origin against its own plan.
- [ ] `hosting/hosting.test.ts` proves that locale-scoped rules affect only their own domain.
- [ ] `pnpm --filter @sebastian-websites/software check:fixtures` passes:
  - Build time before the date: a draft and a future-dated post are absent from all HTML, sitemaps, feeds, and archives.
  - Build time after the date: the future-dated post is present in both languages with matching hreflang.
  - Both feeds parse with a strict XML parser, using RSS 2.0 and Atom elements and a feed language. Each entry has full content, absolute links equal to the canonical URLs, author names, tag keys, and an ID that is unique per publication.
  - The empty state, the language-switch fallback, and both raster-image checks behave as specified.
- [ ] Every indexable Software page carries:
  - `og:title` and `og:description`;
  - `og:url` equal to its canonical;
  - `og:image` as an absolute Bunny URL;
  - a Twitter card.

  Posts also carry `og:type=article` with published and modified times.

- [ ] Each post renders exactly one next-step box for its mapped target, or none for `none`.
- [ ] `frame.test.ts` shows the translated Blog item on Software, Open Source, app-tracking, and Skills. It shows Consulting's navigation unchanged.
- [ ] `pnpm agent:check`, `pnpm test`, `pnpm hosting:test`, and `pnpm --filter software check:browser` pass at 390px and 1440px. The CI job stays within its timeout.

**Completion condition:** three checks pass in order.

1. Every CI criterion above passes on the launch pull request.
2. The Deploy run for the merge commit succeeds, including `verify` and `verifySeo`.
3. `pnpm hosting:smoke software-de` and `pnpm hosting:smoke software-en` pass, including the `/blog` and feed smoke checks and their content types.

Raster images and the Bunny image provider are not part of this plan.

## Validation plan

- **Unit tests in `packages/web-core`:**
  - index validation in both pairing directions;
  - `id` uniqueness including drafts;
  - `nextStep` values and tag keys;
  - counterpart resolution;
  - Open Graph and conditional hreflang;
  - the brand-wide Blog item.
- **Hosting tests:** `seoPlans` comparison, `verifySeo` plan use, build-time pairing, locale-scoped `PathRule`, smoke checks, and media types.
- **Fixture builds:** `check:fixtures` covers exclusion at two build times, strict feed parsing, the empty state, the fallback, and the image checks.
- **CI:** `hosting:plan` and `check:fixtures` run after `pnpm build`.
- **Browser checks:** `check:browser` runs over the sitemap pages, with explicit checks for posts, tag archives, the next-step box, and feed links. Baseline mode skips paths that are new. It does not expect header parity, because the navigation item changes the header.
- **Manual checks:**
  - Read both feeds in a desktop feed reader and in the W3C Feed Validation Service.
  - Run the post URLs through LinkedIn's Post Inspector after deployment.
  - Check the 390px header on Open Source and Skills by hand, because CI has no browser check for them.

## Assumptions and open points

- Assumption: The owners provide the first post before step 10. That means copy in both languages, tag keys, and the `nextStep` target. If the internationalization check has no page yet, the post uses `contact`.
- Assumption: The Ardo owner accepts extensions 1–3 as reusable. If one is rejected, implementation stops and reports the limitation. It does not fall back to a gate exception.
- Assumption: The newsletter sign-up remains `subscribeUnavailable()`. The blog changes neither analytics (ADR-0011) nor the privacy notice.
- Assumption: The Ardo epic is filed only after the owner confirms in the implementation run. This planning run filed nothing.
- Assumption: A separate follow-up plan covers the Bunny image provider, cover images, avatars, and per-post `og:image` after extension 6 is released.

## Plan review

**Result:** Approved

### Summary

| Area            | Critical | Important | Note |
| --------------- | -------: | --------: | ---: |
| Architecture    |        0 |         4 |    1 |
| Security        |        0 |         0 |    0 |
| Data protection |        0 |         1 |    0 |
| Error cases     |        0 |         3 |    1 |
| Testability     |        0 |         3 |    1 |
| Scope           |        0 |         4 |    1 |
| Maintainability |        0 |         1 |    1 |

### Findings

The deep interactive review on November 6, 2026 produced 21 findings. All are incorporated. The owners made the decisions where one was needed.

**Important findings**

- **Architecture:**
  - The single-language rule did not cover tag archives. Incorporated, by owner decision: tags are English keys with translated labels, and single-language archives are a second allowed class.
  - The gate could not identify a post from the artifacts. Incorporated: a post is defined by its path shape plus `og:type=article`. The exception applies to Software only, and a missing language build fails.
  - `verify` and `verifySeo` recompute each target alone, and `deploy.ts` needs secrets. Incorporated: plans come from `seoPlans(builds)`, and the secretless `hosting:plan` entry point runs in CI.
  - ADR-0009's per-commit and per-variant statements no longer hold. Incorporated: the ADR is reworded, the build time is recorded, and the gate checks the build-time pair.
- **Scope:**
  - Extension 5 was confirmed but redundant with the index. Incorporated: the index carries `nextStep`, and extension 5 no longer gates the launch.
  - Extension 4 was unnecessary. Incorporated, by owner decision: `build.ts` stages only due posts, and extension 4 is optional.
  - A future-dated first post would break the joint launch. Incorporated: a launch rule on `publishedAt`, plus a navigation guard.
  - The brand navigation also reaches app-tracking and Skills. Incorporated: both are covered in files, tests, and manual checks, and the footer is unchanged.
- **Error cases:**
  - A translation pair would get identical feed entry IDs. Incorporated, by owner decision: Ardo extension 2 makes feed IDs unique per publication.
  - The reverse pairing rule was missing. Incorporated: a path shared by both languages must have one `id`.
  - Gone and redirect rules applied to both domains. Incorporated: `PathRule` is scoped by locale, and the smoke checks are adjusted.
- **Data protection:**
  - ADR-0012 applies at merge time, and pull-request branches are public. Incorporated: the rule is in ADR-0021 and the guide, and drafts stay out of the public repository.
- **Maintainability:**
  - A locale-keyed founder module would take the copy out of Palamedes. Incorporated: Ardo gets names only, and roles and bios stay `t` macros.
- **Testability:**
  - Fixture builds had no runner, no isolation, and no CI step. Incorporated: `build.ts` options, `check:fixtures`, a CI step, and an `.xml` media type.
  - The raster-image check was underspecified. Incorporated: it is now defined as a source check and an output check.
  - The completion condition could not be measured as one check. Incorporated: completion is three checks, and tracker and ADR items are pre-merge checks.

**Notes**

- **Architecture:**
  - The extension 1 scope was confirmed: it must replace Ardo's post and overview meta. Incorporated, with evidence. Feed language moves into extension 2.
- **Error cases:**
  - The home-page fallback could never trigger. Incorporated: removed.
- **Testability:**
  - Browser-check baseline mode would fail on new paths and on the changed header. Incorporated.
- **Scope:**
  - Pull-request slicing was implicit. Incorporated: the plan now lists which steps can merge before the release.
- **Maintainability:**
  - The plan recorded no drift baseline. Incorporated: the baseline `6542970` and the uncommitted paths are recorded.

### Earlier review round (November 6, 2026)

The regular plan review produced 11 Important findings and 7 Notes. All were incorporated, and the owners made the decisions where one was needed:

- the Ardo-first launch;
- a gate built from comparing the two builds;
- future dates with a shared build time;
- brand-wide navigation;
- a language switch without a counterpart;
- verification after publication;
- a CI SEO step;
- the first post in both languages;
- tag archives as part of the launch;
- withdrawal through 410;
- a follow-up plan for images;
- a mandatory `nextStep`.

The deep review supersedes two of those choices: `publication.now` and the `id` map fallback for `nextStep`.

## Open points

- No open points.
