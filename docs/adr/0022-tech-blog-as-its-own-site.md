---
status: accepted
updated: 2026-11-12
---

# Technical writing has its own site, the tech blog

Technical writing (how we build software, our open-source projects, coding agents, and
architecture) is published on a site of its own: `blog.sebastian-software.com` in English and
`blog.sebastian-software.de` in German (owner decision of 2026-11-12). Its readers are developers
and technical leads, and its German copy addresses them with „du“. The Software site
(`sebastian-software.com`) keeps products and product news in „Sie“ for the buyers of its
products. Each site follows one reader and one form of address, as the brand's `VOICE.md`
records.

## The site

- **One app, `apps/blog`, with the site ID `blog`.** It has the variants `blog-de` and `blog-en`
  and the hosting targets `sebastian-websites-blog-de` and `sebastian-websites-blog-en`
  ([ADR-0009](0009-delivery-model.md)). The language follows the TLD
  ([ADR-0006](0006-language-by-tld-english-source.md)). The site is an area of the Software
  brand, like Open Source: the Software logo, header, and page ending, its own imprint and
  privacy pages, and German frame copy in „du“ from the app's own catalog.
- **The publication moves from the Software site to the tech blog.** Posts, tags, next steps,
  feeds, drafts, scheduling, counterparts, the image rules, the launch phases, and the
  hosting checks of [ADR-0021](0021-blog-on-the-software-website.md) now belong to the tech blog.
  The code moved with them: the blog components, build scripts, fixtures, and browser checks
  live in `apps/blog`, and `BLOG_SITE` in `packages/web-core` names `blog`. The repository still
  has exactly one site with a publication, so the hosting gate keeps one rule for
  single-language pages.
- **URLs.** The home page is `/`: what the blog is about, the newest five posts, and the feeds.
  Ardo generates the publication below `/posts`: the overview of all posts at `/posts`, posts at
  `/posts/<slug>`, tag archives at `/posts/tags/<key>`, and the feeds at `/posts/rss.xml` and
  `/posts/atom.xml`. Ardo's publication needs a route directory and cannot sit at the site root;
  `/posts` also keeps post slugs clear of `/imprint`, `/privacy`, and `/404`. Paths follow
  [ADR-0010](0010-url-and-redirect-contract.md).
- **Navigation.** The Blog item of the Software brand navigation leads to the tech blog's home
  and appears on Software, Open Source, app-tracking, Skills, and the tech blog itself. It
  follows the launch phase of ADR-0021 (`BLOG_NAVIGATION`); the first post in both languages
  sets it to `launching`.

## The Software site

The Software site has no publication until it has product news to publish. Its former
`/blog` was built but dark: unlinked, `noindex`, out of the sitemap, and without a single post.
It is removed. `/blog`, `/blog/rss.xml`, and `/blog/atom.xml` on both Software domains stay
404, including after the tech blog goes live. The owner confirmed on 2026-11-12 that these
paths need no migration redirects: the publication was never launched and had no posts.

Product news returns as a publication of the Software site when the first announcement is due.
That change gives the site its own route directory (such as `/news`), tag registry, and launch
phase, and turns the single `BLOG_SITE` into a list of publication sites. It is decided with
that first announcement, not ahead of it.

## Considered options

- **A Software site in „du“ throughout.** Rejected by the owners: the product pages address
  buyers, who read „Sie“.
- **A separate news subdomain for product news.** Rejected by the owners: product news stays
  on the Software site.
- **The tech blog as a variant of the Software app.** Rejected: a variant is one language of a
  site, and the repository derives app directories, hosting targets, and the SEO pairing from
  the site ID. A second site in the same app would break each of those rules.
- **Keeping both publications now.** Rejected: the Software publication has no post and no
  planned one, and every gate and check would need a second publication only to keep an
  empty page dark.
- **Posts at the site root (`/<slug>`).** Deferred: Ardo's publication needs a route directory,
  and root slugs would collide with the legal pages. Moving later would need a redirect for
  every post.

## Consequences

- The essay workflow in `sebastian-content` targets `apps/blog/content/posts/<locale>/`.
- DNS and certificate steps happen outside the repository; until they are done, both variants
  stay `productionActive: false` and live on their Bunny origin hosts. The steps are in
  [the tech blog runbook](../operations/tech-blog-site.md).
- Legal texts on the tech blog keep the reviewed wording of the Software sites until the owners
  decide whether they follow the site's „du“ as well.
