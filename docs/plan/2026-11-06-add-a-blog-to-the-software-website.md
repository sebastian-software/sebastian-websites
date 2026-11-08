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

  The site cannot override any of this, and the hosting gate rejects it. The launch therefore waits for an Ardo release with the reusable extensions listed below. The gate gets no exception for `/blog`. Ardo 6.4.0, released on November 8, 2026, contains them.

- **Feed IDs become unique per publication.** The Ardo release changes feed entry IDs so that a translated pair keeps one shared post `id` without colliding across the two feeds.

**Publishing**

- **Future-dated posts are allowed.** A post with a future `publishedAt` may be merged into `main`. It appears with the first deploy after its date. The owners accept that such a post can be read in the public repository before its date (ADR-0012). ADR-0012's content rules still apply when the post is merged.
- **Shared build time.** Both language builds use one shared build time. `build.ts` passes it to both Ardo builds as `buildTime`, and Ardo leaves out drafts and posts that are not yet due (ardo#502). Updated on November 7, 2026, after #502 was merged; the earlier decision had `build.ts` copy only due posts. Scheduled CI builds stay out of scope. A post that falls due goes live with the next merge or a manual re-run of the Deploy workflow.
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
- **Build time.** `build.ts` fixes one build time per run, as an RFC 3339 timestamp with a time zone. It passes that value to each variant's Ardo config as `buildTime`, so Ardo's visibility check, tag archives, feeds and sitemap `lastmod` all use it. Ardo reads no environment variable for it.
- **Post sources per build.** `build.ts` stages each language's posts unfiltered into `.variant-build/<variant>/content/blog/`. Drafts and posts that are not yet due are filtered by Ardo, not by the site. The only change to a staged copy is the build-time `counterpart` field (see [Language counterparts at build time](#language-counterparts-at-build-time)). `build.ts` rejects a source that sets `counterpart` itself. It parses frontmatter with `yaml`, declared in `apps/software`.
- **Publication name and description.** `publication.name` and `description` live in `vite.config.ts`, so they cannot use Palamedes macros. They are literals per language, and the feed titles come from them.
- **MDX posts and Palamedes.** Posts are written per language, not translated through catalogs. The Palamedes plugin excludes `/app/routes/blog/`; otherwise its MDX transform treats post prose as catalog messages and `failOnMissing` fails the build.
- **Recorded build time.** `build.ts` writes the build time next to `client/`, not inside it, so it is not uploaded. Ardo writes no such file: it keeps `buildTime` only inside the JavaScript bundle, normalised to UTC. The hosting gate's pair check therefore still reads `build-time.txt`. `build.ts` also derives `__BUILD_YEAR__` from that time.
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

From the posts that are due by the shared build time, the module builds a cross-language index. It must use the same instant that Ardo receives as `buildTime`, so that the index and Ardo's output agree. For each language it lists post `id`, path, `nextStep`, and tags. The index runs only in `build.ts`. No page receives it, so it never reaches the client bundle.

### Language counterparts at build time

Owner decision, November 8, 2026: counterparts are computed at build time, so that no page carries a blog index.

- **Non-blog pages** have the same path in both languages (ADR-0010) and need no lookup. `/blog` exists in both languages, with the empty state if needed.
- **Posts.** `build.ts` writes `counterpart: "/blog/<slug>"` or `counterpart: null` into each staged copy. The post module reads `post.data.counterpart` for hreflang, and the root reads `useArdoPage().frontmatter.counterpart` for the language switch. The value stays in that post's own route chunk.
- **Tag archives.** `build.ts` writes the tag keys that have an archive in the other language to a small build-data module, `virtual:software-blog-tags`. Only the tag module imports it. It uses the module for hreflang. Its `frontmatter({ tag, posts })` export returns `counterpart`: the other language's archive path, or `null`.
- **Language switch on tag archives.** The root reads that `counterpart` with `useArdoPage().frontmatter`, as on posts. A tag archive without a counterpart falls back to the other blog's overview. The value and the tag list stay in the tag module's chunk. This was ardo gap G6, closed in ardo 6.4.0.
- **`nextStep`** comes from `post.data.nextStep` (ardo#506 implements #503).

The spike measured the effect: with 50 posts per language, non-blog pages grew by about 0.26 KB per post, which was Ardo's route table alone. Before, they grew by about 0.45 KB per post. Since ardo#508, which is in ardo 6.4.0, the client entry keeps only each route's logical path, about 4 bytes gzip per page in Ardo's docs. The launch build measures the Software value again. Ardo already rejects unknown authors, timestamps without a time zone, and an `updatedAt` earlier than `publishedAt`. The module does not repeat those checks.

### Translation pairs and tags

- **Translation pairs** share one post `id` and one path. Generic slugs stay English for both languages, as ADR-0010 requires.
- **Tag keys and labels.** Tags are English, lowercase, hyphenated keys from one registry module. The registry holds the keys only. Translated labels are Palamedes `t` macros in the module that `publication.tagLabel` names, so they stay in `pmds extract`, `check:translations`, and `lint:messages`. Ardo calls that module while it renders, for archive headings, archive titles and post tag lists. URLs, the sitemap and feed categories carry the key.
- **Tag archive languages.** A tag archive exists in a language if at least one due post in that language uses the tag. An archive present in both languages gets reciprocal hreflang.

### Ardo epic

The epic is filed after owner confirmation in the implementation run. Each issue carries a reduced reproduction against Ardo's default behaviour. Items 1–3 gate the launch, and items 4–6 do not. Items 1–5 have shipped in ardo 6.4.0. Item 6 remains open for the image plan.

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
4. **The publication respects `buildTime`.** Merged on `main` as ardo#502, with ardo#507 for `buildHash`. ardo#506 also derives the `lastmod` of generated publication routes from the visible posts instead of the wall clock.
5. **Custom post fields on `Post`.** Implemented in ardo#506 as `post.data`. The site reads `nextStep` and `counterpart` from it.
6. **Image provider** (optional, for the follow-up image plan).
   - An interface for `renderFamily`, `renderJpeg`, and `storeImage`: it receives the source, crop, width, and format, and returns URLs.
   - sharp stays the default.
   - The same interface covers author avatars.

### Site integration and SEO

- **Frame and helpers stay in charge.** Blog pages render inside the existing `SiteHeader` and `PageEnding` frame. Canonical, hreflang, and Open Graph come from `seoMeta`, without trailing slashes, through the `meta` export of the site's publication route modules. The site does not post-process generated HTML or bypass Ardo validation.
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
- one shared build time, passed to Ardo as `buildTime`;
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

| File                                                                                                                            | Description                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ardo repository (separate epic, issues, PRs)                                                                                    | Extensions 1–3 before launch. Extensions 4–6 are filed and do not gate the launch.                                                                                                                                                                                                                             |
| `apps/software/package.json`                                                                                                    | Pin `ardo` 6.4.1, the release with extensions 1–5. Add the `check:fixtures` script.                                                                                                                                                                                                                            |
| `apps/software/vite.config.ts`                                                                                                  | Per-variant `publication` (`from`, `to: "blog"`, `name`, `description`, `authors`, `components`, `tagLabel`, `tags`, `feeds.entryIds`), top-level `trailingSlash: false`, `buildTime` and `sourceRoot`, the Palamedes `exclude` for generated blog routes, and the `virtual:software-blog-tags` build data.    |
| `apps/software/scripts/build.ts`                                                                                                | Shared build time passed to Ardo as `buildTime`; staging with the `counterpart` field and the tag build data; the build-time file next to `client/`; `__BUILD_YEAR__` derived from the build time; `--content`, `--build-time`, and `--out` options for fixtures; the existing `404/index.html` normalization. |
| `apps/software/scripts/development.ts`                                                                                          | Mirror and watch `content/`.                                                                                                                                                                                                                                                                                   |
| `apps/software/scripts/check-fixtures.ts` (new) and `apps/software/test/fixtures/blog/` (new)                                   | Fixture builds into scratch output. They cover draft and future-date exclusion at two build times, strict feed parsing, the empty state, the language-switch fallback, and the raster-image checks.                                                                                                            |
| `apps/software/content/blog/{de,en}/`                                                                                           | Post sources. At launch they contain the first approved post in both languages.                                                                                                                                                                                                                                |
| `packages/web-core/src/` (new blog module plus tests)                                                                           | The cross-language index and its validation, the `nextStep` set, the tag-key registry, and counterpart resolution.                                                                                                                                                                                             |
| `packages/web-core/src/seo.ts`, `seo.test.ts`, `apps/software/app/lib/seo.ts`                                                   | Open Graph and Twitter metadata, hreflang only where a counterpart exists, and article metadata.                                                                                                                                                                                                               |
| `packages/web-core/src/frame.ts`, `frame.test.ts`, `packages/ui/src/frame/frameCopy.ts`, `packages/ui/src/frame/SiteHeader.tsx` | Brand-wide `blog` destination, the optional counterpart, and the language-link fallback. Assertions cover Software, Open Source, app-tracking, Skills, and an unchanged Consulting.                                                                                                                            |
| `apps/software/app/components/Founders.tsx` and a new shared founder module                                                     | Founder copy from one source, still in Palamedes.                                                                                                                                                                                                                                                              |
| `apps/software/app/root.tsx`, new `apps/software/app/components/blog/`                                                          | Overview, post frame, author line, tag list and tag archive, next-step box, feed links, empty state, and translated tag labels.                                                                                                                                                                                |
| `apps/software/app/locales/{en,de}.po`                                                                                          | Blog UI copy and tag labels.                                                                                                                                                                                                                                                                                   |
| `hosting/seo.ts`, `seo.test.ts`, `verify.ts`, `deploy.ts`, `check-builds.ts` (new), root `package.json` (`hosting:plan`)        | The `seoPlans` comparison, verification driven by the plan, the build-time pair check, and the secretless CI entry point.                                                                                                                                                                                      |
| `hosting/redirects.ts`, `hosting/smoke.ts`, `hosting/hosting.test.ts`, the Bunny middleware configuration if needed             | Locale-scoped `PathRule`; smoke checks for `/blog`, `/blog/rss.xml`, and `/blog/atom.xml` with content types; XML media types.                                                                                                                                                                                 |
| `apps/software/scripts/check-browser.ts`                                                                                        | `checkRoute` alternate rules; checks for the overview, a post, a tag archive, the next-step box, and feed links; `.xml` in the media map; baseline comparison skipped for paths missing from the baseline.                                                                                                     |
| `.github/workflows/ci.yml`                                                                                                      | Run `pnpm hosting:plan` and `check:fixtures` after `pnpm build`, and measure the job time against the 20-minute timeout.                                                                                                                                                                                       |
| `docs/adr/0021-blog-on-the-software-website.md` (new), ADR-0006, ADR-0009, ADR-0010                                             | The decisions above.                                                                                                                                                                                                                                                                                           |
| `docs/operations/` (new guide)                                                                                                  | Writing, review checklist (including the ADR-0012 rules at merge time), translation, tags, scheduling and the Deploy re-run, rename, withdrawal, and the image ban until the image plan.                                                                                                                       |

## Implementation details

### Approach

1. **Integration spike.** Before the Ardo work, run a local, non-public spike against Ardo 6.3.0. Confirm the recorded gaps against the fixture (extensions 1–3 and the feed-ID collision). Record how the directory output serves `/blog/<slug>` and `/blog/<slug>/`, and which Ardo labels remain visible. A gap that turns out to be site-specific stays in the website.
2. **Ardo epic and release.** Once the owner confirms, file the epic and the issues. Implement and release extensions 1–3 in Ardo. File extensions 4–6 without waiting for them.
3. **Index and validation.** Build the web-core blog module and its tests. This step may merge before the release.
4. **Build plumbing.** Add the shared build time and pass it to Ardo as `buildTime`. Add the build-time file, fixture options, the `check:fixtures` script, and content mirroring in development.
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

`BlogIndex`, `BlogPost` and `TagArchive` are the route modules in `publication.components`. Each exports the component as `default` and its route `meta`.

### State management

Not relevant. All pages are static build output. The cross-language index runs only in `build.ts`; counterparts and post lists reach pages as per-route build data.

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
- **Draft.** Ardo leaves it out at `buildTime`, so it is absent from every output. Its `id` still counts for the uniqueness check.
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

## Build progress

**Date:** 2026-11-08
**State:** All implementation steps are done on this branch, pinned to ardo 6.4.1. The first post is still missing, so the pull request stays a draft and the plan stays open.

### Done

- **Step 1, integration spike.** It confirmed the Ardo 6.3.0 gaps: 12 of 13 new Ardo unit tests failed before the change, and so did the new integration test.
- **Step 2, Ardo epic.** [ardo#505](https://github.com/sebastian-software/ardo/issues/505) has sub-issues [#499](https://github.com/sebastian-software/ardo/issues/499)–[#504](https://github.com/sebastian-software/ardo/issues/504). Extensions 1–3 are implemented in [ardo#506](https://github.com/sebastian-software/ardo/pull/506). After a strategic review on November 7, the API of #506 changed; see [Ardo API for the launch](#ardo-api-for-the-launch). Item 4 (`buildTime`) was merged separately on `main`. Ardo 6.4.0 was released on November 8, 2026, from [ardo#481](https://github.com/sebastian-software/ardo/pull/481). It contains:
  - #502 and #507;
  - #506, with G6 and G5a fixed;
  - [ardo#508](https://github.com/sebastian-software/ardo/pull/508), which takes the route table out of the client entry;
  - [ardo#509](https://github.com/sebastian-software/ardo/pull/509), which spells the `llms.txt` page links with `trailingSlash`.
- **Step 3, web-core blog module.**
  - Module files: `blog.ts`, `blogPaths.ts`, `blogTags.ts`, `blogNextSteps.ts`, `blogImages.ts`, and `timestamps.ts`.
  - Pairing goes both ways, IDs are unique (drafts included), `nextStep` is required, tag keys are registered, and raster images are not allowed.
  - Counterpart resolution follows the same shape rules as the gate.
- **Step 5, Open Graph.** All indexable Software pages have Open Graph tags. `og:image` is the shared team photo (ADR-0014), resolved with `responsiveImage()`.
- **Step 6, hosting.**
  - `seoPlans(builds)` compares path sets across builds.
  - `verifySeo` checks each origin.
  - `hosting/check-builds.ts` runs as `pnpm hosting:plan` and in CI.
  - Locale-scoped `PathRule` and smoke checks are in place.
  - The build-time pair check validates zoned timestamps. The file is not yet required, because `build.ts` does not write it yet.
- **Step 7, partial.** The counterpart model and the language-switch fallback to the other blog are in place, labelled as that blog. The `blog` navigation item is not.
- **Docs.** ADR-0010 is amended for single-language blog pages. `docs/operations/website-hosting.md` describes the new gate.

### Ardo API for the launch

The strategic review of ardo#506 replaced the first API. The launch uses this shape:

- **Route modules.** `publication.components.{index,post,tag}` name site modules. Each exports the component as `default` and, optionally, `meta`. Ardo runs `meta` while it renders and passes Ardo's own descriptors as `defaults`; the returned list replaces them. The types are `Publication{Index,Post,Tag}MetaArgs`. `publication.meta` and the `_ardoMeta` field are gone.
- **Post frame.** Ardo mounts the site's post frame in the generated post route only. Documentation pages no longer load it.
- **Trailing slash.** A top-level `trailingSlash: false` sets the spelling for the sitemap, canonicals, links, and publication, post, tag and feed URLs. `publication.trailingSlash` is gone. Static output cannot enforce a spelling, so Bunny must serve `/blog/<slug>` and redirect `/blog/<slug>/`. The hosting gate already checks this for the existing pages.
- **Tag labels.** `publication.tagLabel` names a module whose default export is a `PublicationTagLabel`: one `case` per registry key, each a Palamedes `t` macro, with the key as fallback. The tag module receives `label`. `useArdoPublicationTags()` gives site components `label(key)` and `path(key)`. With `tags: true`, post tags link to their archives.
- **Feed discovery.** Index, post and tag `defaults` all end with the RSS and Atom `<link rel="alternate">` entries. The site's `meta` keeps those and replaces the rest with `seoMeta`.
- **Custom shell.** The Software root uses only `ArdoHead`, `ArdoOutlet` and `ArdoScripts`. Since ardo#506, Markdown posts work there without `ArdoProvider`.
- **Custom post fields.** Frontmatter fields Ardo does not read reach the post module as `post.data`. The root reads any page's frontmatter with `useArdoPage().frontmatter`. Listing data has an empty `data`.
- **Read-only data.** Publication data is frozen and typed `readonly`. Site code sorts copies, for example `[...posts].sort()`.
- **Post `meta` exports.** An MDX post that exports `meta` fails the build, because the post module owns every post's metadata.
- **Feeds** keep the tag key as the category. Translated feed categories are not part of #506.
- **Build time and hash.** Set `buildTime` in each variant's Ardo config to the shared build time. Ardo filters drafts and posts that are not yet due by it, and dates feeds and sitemap `lastmod` from the visible posts. `buildHash` can be set the same way (ardo#507); otherwise Ardo detects it from Git.
- **Page data from index and tag modules.** The index and tag modules may export `frontmatter(args)`, called with the same arguments as `meta`. The root reads the result with `useArdoPage().frontmatter`, so tag archives get an exact language switch. Without the export, nothing changes.
- **Staged builds.** The top-level `sourceRoot` names the directory a staged copy mirrors. For Software that is `apps/software`, passed by `build.ts` to each variant build. Route `lastUpdated`, sitemap `lastmod` and the detected `buildHash` then come from the original files' Git history. Both languages get the same dates, and two builds of one commit are byte-identical. Files the source lacks or Git does not track fall back to their file time.
- **Client entry.** Since ardo#508, the client entry no longer carries the route table. A page loads its own chunk from the URL in its page data. Non-blog pages therefore carry only the logical path of each blog route.

### Integration spike against ardo#506

**Date:** 2026-11-08. A local, non-public build of the Software site against a packed ardo#506 (`16406e7`), on the local branch `spike/blog-ardo-506`. Nothing was pushed.

- **Result.** #506 is enough for the launch. The site needs no Ardo workaround.
- **Passed:**
  - one canonical without a slash, `og:url`, and `og:type=article` on posts;
  - reciprocal hreflang for pairs and paired tag archives, none on single-language pages;
  - drafts and future posts absent at one build time, and present in both languages at a later one;
  - strict feed parsing, feed language, qualified entry IDs, and byte-identical feeds across builds with the same visible posts;
  - translated tag labels and post tag links;
  - hydration without errors on hard loads and navigation;
  - `hosting:plan`, `hosting:test` (45 of 45), `pnpm test`, `pnpm agent:check`, and `check:browser` for both languages;
  - no blog chunk, counterpart map or tag list on non-blog pages.
- **Gaps found and fixed in ardo#506** (G1–G5): Markdown in a custom shell, feed links in post defaults, frozen publication data, a build error for post `meta` exports, sitemap `lastmod` from Git, smaller client post data, and `post.data`.
- **Found by the spike and fixed in ardo#506 before the release** (owner decision, November 8):
  - **G6.** Generated tag and index routes gave the root no per-route data, so the language switch on tag archives went to the other blog's overview. Fixed with the `frontmatter` export of the index and tag modules.
  - **G5a for staged builds.** Software builds from staged copies outside Git, so Ardo found no commit for its pages. Non-blog `lastmod` and the route table's `lastUpdated` changed on every run, and the output was not reproducible. Fixed with `sourceRoot`.

### Owner decisions on November 8, 2026

- **Open Graph image.** The shared team photo `shooting-2024/color_09092024-14-retouched.png`, cropped to 1200×630, stays the `og:image` for blog pages until the image plan.
- **Tag registry at launch:** `internationalization` only.
  - The registry in `packages/web-core/src/blogTags.ts` lists six keys today. The launch pull request reduces it to that one key, with its label in both catalogs.
  - More keys are added later, each with its label in both catalogs.
- **`nextStep` targets, confirmed as proposed:**
  - `products`, `open-source`, `contact`
  - `consulting-architecture`, `consulting-internationalization`, `consulting-enablement`
  - `palamedes-docs`, `ferramenta-docs`
  - `none`
- **First post.** The owners write and deliver it in German and English.
  - Until it arrives, the launch pull request stays a draft with test posts.
  - The test posts live only in the fixtures.

### Launch implementation (November 8, 2026)

- **Ardo pin.** `ardo` 6.4.1 and `yaml` are pinned. 6.4.1 adds ardo#511, which spells generated version-root redirect targets with `trailingSlash`. `pnpm-workspace.yaml` exempts `ardo@6.4.1` from `minimumReleaseAge`; remove that once the release has aged past the threshold.
- **Step 4, build plumbing.**
  - `build.ts` and `scripts/blog-staging.ts` set one shared build time per run, from `scripts/build-time.ts`. Staging copies posts unfiltered, writes `counterpart` into each copy, rejects an authored `counterpart`, and rejects symbolic links.
  - The build writes `blog-tags.json` for `virtual:software-blog-tags` and the required `build-time.txt`. It passes `sourceRoot` and `buildTime` to Ardo.
  - `development.ts` restages `content/blog/` on change, debounced and atomically.
  - `check:fixtures` builds the fixtures under `test/fixtures/blog/`, which hold the only test posts.
- **Steps 5 and 6.**
  - Feed discovery: the RSS and Atom links have distinct titles, and the overview has visible subscribe links.
  - Smoke checks for `/blog`, `/blog/rss.xml` and `/blog/atom.xml` with XML media types.
  - `hosting/blog-output.ts` rejects raster images in the blog's `<main>` content, in feed entries and under `assets/posts/`, and requires exactly one `<main>`.
  - CI runs `check:fixtures` and `check:browser:fixtures`. CI and Deploy check out with `fetch-depth: 0`, so `sourceRoot` reads the full Git history.
- **Steps 7 and 8, presentation.**
  - Overview with empty state, post frame, tag archive, the shared founder module and the next-step box. The UI copy is in both catalogs.
  - The tag registry holds `internationalization` only.
  - The `blog` navigation item is behind `BLOG_NAVIGATION` in `packages/web-core/src/blogLaunch.ts`, with the phases `off`, `launching` and `live`; it is currently `off`.
  - Owner decision, November 8: #110 may merge before the first post. While the phase is `off`, the blog pages carry `noindex` and stay out of the sitemap; the hosting gate accepts these dark pages only in `off`. The first post and `launching` follow in their own pull request.
  - Owner decision, November 8: only `launching` fails the build when a language has no published post. `live` shows the empty state.
- **Step 9, documentation.**
  - ADR-0021 is new. ADR-0006, ADR-0009 and ADR-0010 are amended.
  - New guide `docs/operations/blog-publishing.md`, with a pointer from `AGENTS.md`.

### Remaining for the launch

- **First post.** The owners deliver the first post in German and English: same `id` and path, tag `internationalization`, a `nextStep` from the set, no raster images, and a `publishedAt` no later than the CI run.
- **Switch on the navigation.** With that post, set `BLOG_NAVIGATION` to `launching`. Run `check:browser` with screenshots of the header with three items on Software, Open Source, Skills and app-tracking at 390, about 1024 and 1440 px. After the first deploy, set it to `live`.
- **Copy review.** The owners review the UI copy:
  - the overview headline and intro;
  - the next-step texts;
  - the empty state;
  - the tag archive lead, which repeats its heading;
  - the labels "Thema im Blog" and "Themen".
- **CI time.** Record the CI job time of the first run against the 20-minute limit.
- **Finish.** #110 merges with the blog dark (phase `off`). The first post, `launching`, and later `live` follow in their own pull requests; archive this plan with the `live` switch.

### Test results

These are the final independent validation results on the branch, run with the container runner.

| Check                                         | Result                          |
| --------------------------------------------- | ------------------------------- |
| `pnpm agent:check`                            | Passed: 0 errors, warnings only |
| `pnpm test`                                   | Passed                          |
| `pnpm hosting:test`                           | 45 of 45 passed                 |
| `pnpm build`                                  | Passed                          |
| `pnpm hosting:plan`                           | Passed: 10 builds checked       |
| `check:browser` for Software and app-tracking | Passed                          |

Ardo 6.4.0 contains ardo#506, #508 and #509.

- **ardo#506.** It was rebased onto #508 and merged at `f4fa2a8`. It includes the spike fixes G1–G6 and G5a.
  - Locally on Node 26 it passed format, build, typecheck, lint, 1,173 unit tests, 85 integration tests, the i18n check, the docs budgets, and the Chromium e2e suites.
  - CI was green on Node 22, 24 and 26.
  - The entry budget raise of #506 was dropped, because #508 made it unnecessary. The total client JS budget rose from 2.7 MB to 2.85 MB for the 80 new API reference pages.
- **ardo#508 and #509** were each merged with green CI on Node 22, 24 and 26.

## Review findings

**Date:** 2026-11-07
**Reviewer:** effective-flow-nodejs-reviewer (website and Ardo)

### Summary

| Status                 | Count |
| ---------------------- | ----: |
| Fixed                  |    28 |
| Open / Not implemented |     1 |

The open finding is a Note and does not block the launch.

- **Website.** `build-time.txt` becomes required with the launch step.
- **Ardo#506.** Four Notes were listed in the pull request. The API rework after the strategic review resolved them: `_ardoMeta` and the duplicated route-chunk metadata are gone, and dev and preview tests now cover the site modules and redirects. The `ArdoMetaDescriptor` change is described in the pull request.
- **Ardo#506 residual risks**, as listed in the pull request:
  - Post pages with a site post module load the locale's post metadata so that `meta` receives the publication.
  - `meta` and `tagLabel` also run during hydration. A `tagLabel` that throws without a client locale breaks it.
  - `llms.txt` page links did not follow `trailingSlash`. Fixed in ardo#509, which is in 6.4.0. Search result URLs were never affected.

## Open points

- No open points.
