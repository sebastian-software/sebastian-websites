---
status: accepted
updated: 2026-11-08
---

# The Software website carries a blog built on Ardo's publication feature

`sebastian-software.de` and `sebastian-software.com` publish a blog that answers buyer and
adoption questions and is distributed by hand. Posts are Markdown or MDX files in
`apps/software/content/blog/<locale>/` ([ADR-0004](0004-content-as-files-no-cms.md)). The blog
uses the `publication` feature of Ardo 6.4.0 ([ADR-0019](0019-software-site-on-ardo.md)), which
provides the overview, post pages, tag archives, RSS 2.0 and Atom feeds, drafts, and future-dated
posts. There is no CMS, fork, or custom feed generator. Where the feature lacked a reusable
capability, Ardo gained it first; the launch pins the release that contains them.

## Posts and languages

- **Posts are language-specific.** The `.de` build lists the German posts and the `.com` build
  the English ones. A post is not translated by default
  ([ADR-0006](0006-language-by-tld-english-source.md)). A translated pair shares one `id` and
  one English slug; the build fails when a shared `id` has different paths or a shared path has
  different IDs. A post without a counterpart exists on one domain only, and the other domain
  answers its path with the branded 404.
- **Counterparts are computed at build time.** `build.ts` reads every post of both languages,
  validates them, and writes `counterpart` (the shared path, or `null`) into each staged copy.
  Sources must not set it. The post module reads it for hreflang and the root reads it for the
  language switch, so no page carries a cross-language index. A tag archive gets its
  counterpart the same way through the `frontmatter` export of the tag module and the build
  data `virtual:software-blog-tags`. Without a counterpart, the language switch links to the
  other language's blog overview.
- **Tags are English keys with translated labels.** Keys come from one registry in
  `packages/web-core/src/blogTags.ts`; labels are Palamedes `t` macros in
  `apps/software/app/components/blog/tagLabel.ts`, so they stay in both catalogs and in the
  translation checks. URLs, the sitemap, and feed categories carry the key. The registry holds
  one key at launch, `internationalization`; each further key comes with its label in both
  catalogs.
- **Every post names a next step.** `nextStep` is required and takes one value from a closed
  set in `packages/web-core/src/blogNextSteps.ts`: `products`, `open-source`, `contact`, three
  Consulting offers, the documentation of Palamedes and Ferramenta, or `none` for a development
  report. The post ends with one box for the target, except for `none`.
- **No raster images before the image plan.** Post bodies, cover images, and author avatars
  carry no raster images, so Bunny's image pipeline does not reach the publication
  ([ADR-0014](0014-images-from-shared-asset-zone.md),
  [ADR-0015](0015-shared-bunny-image-component.md)). The source check rejects image
  frontmatter fields, non-SVG Markdown images, image elements, non-SVG MDX imports, and
  avatars; the output check rejects raster images in the blog documents and feeds. SVG stays
  allowed. A separate plan adds images once Ardo has an image provider. Until then every blog
  page uses one Open Graph image, the shared team photo cropped to 1200 by 630, resolved with
  `responsiveImage()`.

## URLs, feeds, and the hosting gate

- **One publication per language build.** Each variant sets `publication.from` to its staged
  post directory and `to` to `blog`. Ardo's `i18n` option stays off, because its locale prefixes
  contradict [ADR-0010](0010-url-and-redirect-contract.md). A top-level `trailingSlash: false`
  gives canonicals, links, the sitemap, and feed URLs the spelling of ADR-0010.
- **Feeds** are `/blog/rss.xml` and `/blog/atom.xml` on each domain. Entry IDs are unique per
  publication, so a translated pair does not collide, and the tag key is the entry category.
  The overview, posts, and archives advertise both feeds in the head.
- **Single-language page classes.** The hosting gate (`hosting/seo.ts`,
  [ADR-0009](0009-delivery-model.md)) compares the two builds of a site. Only Software may have
  a path in one build only, and only two classes qualify: a post, a path `/blog/<one segment>`
  other than `tags` whose head carries `og:type=article`, and a tag archive at
  `/blog/tags/<key>`. Both declare themselves as canonical and link no alternates. Every other
  unpaired path fails, and the gate has no exception for `/blog`.
- **Withdrawn and renamed posts.** Redirect and 410 rules for blog paths carry a locale, so a
  withdrawn single-language post answers 410 on its own domain while the other domain stays 404. A renamed post keeps its `id`.

## Publishing

- **One build time.** `build.ts` fixes one build time per run, an RFC 3339 timestamp with a time
  zone, and passes it to both Ardo builds as `buildTime`. Ardo leaves out drafts and posts that
  are not yet due, and dates feeds and sitemap `lastmod` from the visible posts. The build
  records it in `build-time.txt` next to `client/`, and the gate rejects a pair whose build
  times differ. A staged build sets `sourceRoot`, so Git history still dates its pages. Two
  builds of one commit produce identical blog pages, feeds and sitemap when they share the same
  `--build-time` and run in a checkout with the full Git history; CI and Deploy check out with
  `fetch-depth: 0` for that. Pages with live data, such as the metrics on `/open-source`, can
  still differ.
- **Future-dated posts are merged early.** A post whose `publishedAt` lies ahead may be merged.
  It appears with the first Deploy run after its date, which is the next merge to `main` or a
  manual run of the workflow. Scheduled builds are not used. The owners accept that such a post
  can be read in the public repository before its date.
- **The repository is public** ([ADR-0012](0012-public-repository.md)). `draft: true` hides a
  post from the site, not from GitHub. Draft copy stays outside the repository, pull-request
  branches included, until it may be public. The content rules of ADR-0012 apply when a post is
  merged, not on its `publishedAt` date.

## Launch

The navigation item is part of the Software brand navigation, so it also appears on Open Source,
app-tracking, and Skills; Consulting is unchanged. `BLOG_NAVIGATION` in
`packages/web-core/src/blogLaunch.ts` sets the launch phase (owner decision of 2026-11-08):

- `off` (current): the navigation does not link the blog.
- `launching`: the item is shown, and the Software build fails when either language has no
  published post at the build time, so the item cannot go live on one domain only. The phase is
  set in the pull request that carries the first post in both languages.
- `live`: the item is shown, and a language without a published post shows the empty state on
  `/blog` with valid, empty feeds. The phase is set after the first deployment with the item.

The blog pages and feeds are built in every phase. The guard is an explicit option of the
staging step; `build.ts` turns it on only for the site's own posts while the phase is
`launching`, so fixture builds and tests behave the same in every phase. The owners write the
first post in both languages. The repository holds no sample post; test posts live only in
`apps/software/test/fixtures/blog/`.

How to write, review, schedule, and withdraw posts is described in the
[blog publishing guide](../operations/blog-publishing.md).

## Considered options

- **Locale prefixes for the blog (`/de/blog`, Ardo's `i18n`).** Rejected: the domain already
  carries the language (ADR-0010).
- **Translating every post.** Rejected: the blog talks about the work, and a forced translation
  would delay posts or publish machine text under the company's name.
- **A gate exception for `/blog`, or post-processing Ardo's output.** Rejected: the launch waited
  for the Ardo release instead, so the gate keeps its single rule.
- **A cross-language post index in every page.** Rejected: every page would carry it, and it
  grows with each post; build-time counterparts keep it out of the client bundle.
- **Scheduled CI builds for future-dated posts.** Rejected: a post that falls due goes live with
  the next deployment, and a manual run of the workflow covers the gap.
- **Images through Bunny from the start.** Deferred to the image plan, which needs a generic
  image provider in Ardo first.

## Consequences

- A post is validated in both languages, drafts and future posts included, so a broken draft
  fails every build.
- Adding a tag or a next step is a code change in `packages/web-core`, reviewed with the post.
- Turning on the navigation item takes two one-line changes: `launching` with the first post,
  which the build guards, and `live` after its deployment.
- The Deploy workflow, not a clock, decides when a scheduled post appears.
