# Blog publishing

The tech blog (`apps/blog`) publishes posts on `blog.sebastian-software.de` and
`blog.sebastian-software.com`. Its readers are developers and technical leads; German posts and
copy address them with „du“. The decisions are recorded in
[ADR-0022](../adr/0022-tech-blog-as-its-own-site.md) and
[ADR-0021](../adr/0021-blog-on-the-software-website.md); this guide is the routine for writing,
reviewing, scheduling, and withdrawing a post. Hosting and the checks that run before
publication are described in [website hosting](website-hosting.md).

## Writing a post

Posts are Markdown (`.md`) or MDX (`.mdx`) files, one per language:

```text
apps/blog/content/posts/de/<slug>.md    # blog.sebastian-software.de
apps/blog/content/posts/en/<slug>.md    # blog.sebastian-software.com
```

The file name is the slug and the post lives at `/posts/<slug>`. Slugs are lowercase, hyphenated
English words, in both languages ([ADR-0010](../adr/0010-url-and-redirect-contract.md)). `tags`
is not a valid slug, because `/posts/tags/` belongs to the tag archives. Prefer plain Markdown;
an MDX post that uses components or expressions, `{/* comments */}` included, must also set
Ardo's `feedContent`.

Every post starts with frontmatter:

```yaml
---
id: why-we-localize-in-the-build
title: Why we localize in the build
description: One sentence for the overview, feeds, and social previews.
publishedAt: 2026-11-17T09:00:00+01:00
updatedAt: 2026-11-24T14:30:00+01:00
authors: [fastner, werner]
tags: [internationalization]
nextStep: contact
draft: false
---
```

| Field         | Rule                                                                                                                                                                                                                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`          | Required and stable. Unique within a language, drafts included. The translation of a post uses the same `id`.                                                                                                                                                                            |
| `title`       | Set it on every post: the heading, overview, feeds, and previews use it.                                                                                                                                                                                                                 |
| `description` | Set it on every post: one sentence for the overview, feeds, and previews.                                                                                                                                                                                                                |
| `publishedAt` | Required. A timestamp with a time zone; one without a zone is rejected. A date in the future schedules the post (see below).                                                                                                                                                             |
| `updatedAt`   | Optional. A timestamp with a time zone, not earlier than `publishedAt`.                                                                                                                                                                                                                  |
| `authors`     | `fastner` and/or `werner`, the authors configured in `apps/blog/ardo.config.ts`.                                                                                                                                                                                                         |
| `tags`        | Optional list of keys from the registry in `packages/web-core/src/blogTags.ts`. At launch the only key is `internationalization`.                                                                                                                                                        |
| `nextStep`    | Required. One of `products`, `open-source`, `contact`, `consulting-architecture`, `consulting-internationalization`, `consulting-enablement`, `palamedes-docs`, `ferramenta-docs`, or `none` for a development report. The closed set lives in `packages/web-core/src/blogNextSteps.ts`. |
| `draft`       | Optional, `false` by default. See "Review" before merging a draft.                                                                                                                                                                                                                       |
| `path`        | Optional. Overrides the path derived from the file name; it must still be `/posts/<slug>`. Leave it out.                                                                                                                                                                                 |

Do not write `counterpart`. The build computes it and rejects a source that sets it.

A post carries no raster images until the image plan has shipped: no `coverImage`, `images`,
`ogImage`, or `twitterImage`, no PNG, JPEG, or WebP in Markdown or `<img>`, `<picture>`,
`<source>`, or `<Image>` elements, no raster imports in MDX, and no author avatars. SVG is
allowed. Code blocks and code spans may show image syntax as an example. The build fails with
the offending file, and `pnpm hosting:plan` repeats the check on the output. Social previews
use one shared Open Graph image.

### Check it locally

```bash
pnpm install
pnpm --filter @sebastian-websites/blog build
pnpm hosting:plan
```

The build validates the sources of both languages, drafts and future posts included, and lists
every problem together. `hosting:plan` needs both language builds. Both builds share one build
time, which is "now" unless you pass one. To see how the site looks on a later date, for
example to check a scheduled post, pass an RFC 3339 timestamp with seconds and a time zone:

```bash
pnpm --filter @sebastian-websites/blog build --build-time=2026-12-01T09:00:00+01:00
```

`pnpm --filter @sebastian-websites/blog dev` serves the tech blog and restages the posts when a
file below `apps/blog/content/posts/` changes. The development server keeps the build time of its
start, so a post that falls due while it runs appears only after a restart. The commands are defined in
`apps/blog/package.json`.

## Translation and counterparts

Posts are not translated by default. A post that exists in one language only appears on that
domain only; the other domain answers its path with 404 and the language switch links to the
other blog overview.

To translate a post, add a file with the same slug in the other language and give it the same
`id`. Both files then need the same path, and a shared path must share one `id`; the build fails
on a mismatch. Dates, `tags`, and `nextStep` are set per file, so each language keeps its own.
The build links the pair through hreflang and the language switch, and the pair appears on both
domains once both files are due. A tag archive exists in a language when a due post of that
language uses the tag; it is linked across languages when both have one.

## Adding a tag

Tags are English, lowercase keys, the same in both languages. A new key needs three changes
in one pull request, before a post uses it:

1. Add the key to `BLOG_TAGS` in `packages/web-core/src/blogTags.ts`.
2. Add a `case` for it to `apps/blog/app/components/blog/tagLabel.ts` with the label as a
   Palamedes `t` message.
3. Extract the messages and translate the German label in
   `apps/blog/app/locales/de.po`:

```bash
pnpm --filter @sebastian-websites/blog palamedes:extract
pnpm --filter @sebastian-websites/blog check:translations
pnpm --filter @sebastian-websites/blog lint:messages
```

An unknown tag key in a post fails the build.

## Review

A reviewer checks the following before a post is merged. The pull request branch is public, and
so is `main`.

- [ ] **ADR-0012 content rules** ([ADR-0012](../adr/0012-public-repository.md)). The rules apply
      when the post is merged, not on its `publishedAt` date:
  - no unannounced product by name;
  - no personal data of third parties beyond what the sites publish, and no portraits or client
    logos without recorded permission;
  - no internal analyses, such as customer counts or weighed contradictions;
  - no secrets and no font files.
- [ ] **Drafts.** `draft: true` hides a post from the site, not from GitHub. Draft copy stays
      outside the repository, pull-request branches included, until it may be public.
- [ ] **Frontmatter.** `id`, `title`, `description`, `publishedAt` with a time zone, `authors`,
      and a `nextStep` that suits the post. `none` is for development reports only.
- [ ] **Language.** The post is written in the language of its folder, with an English slug.
      A translation shares `id` and slug with its original.
- [ ] **Images.** None, except SVG.
- [ ] **Checks.** CI is green: `pnpm hosting:plan` and `check:fixtures` run there after the
      build. Locally: `pnpm agent:check`.
- [ ] **Date.** A future `publishedAt` is intended (see below). Otherwise it is not later than
      the time of the merge.

## Scheduling

A post with a future `publishedAt` may be merged into `main`. Ardo leaves out a post that is
not yet due at the build time, so it is absent from every page, feed, sitemap, and archive until
a build runs after its date. Nothing builds on a clock. The post goes live with the first
deployment after its date:

- the next merge into `main`, or
- a manual run of the Deploy workflow on `main`: in GitHub, Actions, Deploy, Run workflow, or
  `gh workflow run deploy.yml --ref main` ([deploy.yml](../../.github/workflows/deploy.yml)
  has a `workflow_dispatch` trigger).

For a post that is due at a given hour, start the run at that time. Afterwards check the
deployment: the `Deploy` run must succeed, including `verify` and `verifySeo`. Then run
`pnpm hosting:smoke blog-de` and `pnpm hosting:smoke blog-en`, which also request
`/posts`, `/posts/rss.xml`, and `/posts/atom.xml`. The text of a scheduled post is readable in the
public repository before its date; only merge text that may be public by then.

## Renaming a post

Keep the `id`, rename the file (and so the slug) in each language that has the post, and add a
redirect for the old path. Redirects are rules in `hosting/redirects.ts`. Give each rule the
`locale` of the domain where the old path existed, because the other domain has never had it
and must keep answering 404:

```ts
{
  destination: { path: "/posts/new-slug", site: "blog" },
  id: "BLOG-RENAME",
  locale: "de",
  path: "/posts/old-slug",
},
```

Add the rule to the `blog` list in `PATH_RULES` and extend the table-driven tests in
`hosting/hosting.test.ts`. Rename both files of a translated pair together, so the pair keeps one
shared path.

## Withdrawing a post

Delete the source file in each language that has it, and add a locale-scoped rule so the old
path answers 410 on its own domain only:

```ts
{ gone: true, id: "BLOG-GONE", locale: "de", path: "/posts/withdrawn-post" },
```

The other domain's path stays 404, as ADR-0010 requires. If the post had a counterpart, the
other language's post stays up and loses its hreflang link; the build computes that. A tag
archive disappears when its last post goes. Remove or correct text that must not stay public
with a new commit; Git history keeps the earlier text ([ADR-0012](../adr/0012-public-repository.md)).
Run `pnpm hosting:test` after changing redirect rules.

## Turning on the navigation item

The Blog item stays out of the Software brand navigation (Software, Open Source, app-tracking,
Skills, and the tech blog) until the first post is published in both languages. It links the
tech blog's domain, so the blog must be live first: both variants `productionActive`, as the
[tech blog runbook](tech-blog-site.md) describes. A unit test rejects any other phase than
`off` while they are not. Its launch phase is
`BLOG_NAVIGATION` in `packages/web-core/src/blogLaunch.ts`: `off`, `launching`, or `live`. The
blog pages, feeds, and archives are built in every phase. While the phase is `off`, the
publication pages below `/posts` carry `noindex` and the sitemap leaves them out; from
`launching` on they are indexed, and the hosting gate fails on a publication page that still
blocks indexing.

In the pull request that carries the first post:

1. Add the post in `de` and `en` with a shared `id`, and a `publishedAt` that is not later than
   the CI run of the pull request.
2. Set `BLOG_NAVIGATION` to `"launching"`. The item appears, and the build fails if either
   language has no published post at the build time, so the item cannot go live on one domain
   only.
3. Check the header with three items at 390px on Software, Open Source, app-tracking, Skills,
   and the tech blog. CI has browser checks for Software, app-tracking, and the tech blog only,
   so look at Open Source and Skills by hand.

The frame tests need no change: `frame.test.ts` checks the frame with the phase `off`, and
`frame.blog.test.ts` with `launching` and `live`.

After the first deployment with the item:

1. Read both feeds in a feed reader and in the W3C Feed Validation Service, and run the post URLs
   through LinkedIn's Post Inspector.
2. Set `BLOG_NAVIGATION` to `"live"` in a follow-up pull request.

From then on, a language without a published post (for example after a withdrawal) shows the
empty state on `/` and `/posts` with valid, empty feeds, and the build no longer fails for it.
