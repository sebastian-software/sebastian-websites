# Tech blog

`apps/blog` is the tech blog of Sebastian Software: technical writing for developers and
technical leads, with German copy in „du“ ([ADR-0022](../adr/0022-tech-blog-as-its-own-site.md)).
How the publication works is in [ADR-0021](../adr/0021-blog-on-the-software-website.md); how to
write, schedule, and withdraw posts is in the [blog publishing guide](blog-publishing.md).

## Languages and domains

| Variant   | Canonical domain              | Bunny origin                           | Authoritative DNS |
| --------- | ----------------------------- | -------------------------------------- | ----------------- |
| `blog-en` | `blog.sebastian-software.com` | `sebastian-websites-blog-en.b-cdn.net` | Bunny DNS         |
| `blog-de` | `blog.sebastian-software.de`  | `sebastian-websites-blog-de.b-cdn.net` | Cloudflare        |

| Path                                | Page                                              |
| ----------------------------------- | ------------------------------------------------- |
| `/`                                 | Home: what the blog is about and the newest posts |
| `/posts`                            | Every post, newest first                          |
| `/posts/<slug>`                     | A post                                            |
| `/posts/tags/<key>`                 | A tag archive                                     |
| `/posts/rss.xml`, `/posts/atom.xml` | The feeds                                         |
| `/imprint`, `/privacy`              | Legal pages, shared with the other Software areas |

Both variants are `productionActive: false` until the cutover below. Until then every push to
`main` builds, checks, and publishes them to their origin hosts, where the site can be reviewed
before the domains exist. Provisioning creates both storage and pull zones on the first
deployment; nothing needs to be created in the Bunny dashboard.

## Cutover

1. **Review the origin hosts.** After the merge, open
   `https://sebastian-websites-blog-en.b-cdn.net/` and `…-blog-de.b-cdn.net/`: home, `/posts`,
   both feeds, imprint, privacy, and a missing path (branded 404).
2. **Confirm the privacy notice.** `apps/blog/app/lib/legal.ts` records
   `review-required-before-production`: the tech blog reuses the Open Source notice and adds no
   processing. Record the outcome there before activation. Decide whether the legal texts
   follow the site's „du“; they keep the reviewed „Sie“ wording until then.
3. **Create two DNS-only CNAME records.** These are new names; leave mail records and every
   other entry unchanged.
   - Bunny DNS, zone `sebastian-software.com`: `blog` → `sebastian-websites-blog-en.b-cdn.net`,
     with DNS routing on and CDN acceleration off.
   - Cloudflare, zone `sebastian-software.de`: `blog` → `sebastian-websites-blog-de.b-cdn.net`,
     proxy off (DNS only).
4. **Activate both variants together.** In a pull request, set `productionActive: true` for
   `blog-de` and `blog-en` in `packages/web-core/src/sites.ts`. The deployment attaches both
   hostnames, issues Bunny-managed certificates once DNS resolves, and forces HTTPS; a
   certificate still waiting for DNS is retried on the next deployment. The same change turns
   on the `SW-BLOG` redirects in `hosting/redirects.ts`: `/blog` and its two feeds on the
   Software domains lead to the tech blog's home and feeds.
5. **Check the public domains.** Run `pnpm hosting:smoke blog-de`, `pnpm hosting:smoke blog-en`,
   `pnpm hosting:smoke software-de`, and `pnpm hosting:smoke software-en`. Confirm HTTPS, the
   canonical and alternate links, the 404 page, and that `https://sebastian-software.de/blog`
   answers 301 to `https://blog.sebastian-software.de/`.
6. **Launch with the first post.** The pull request with the first post in both languages sets
   `BLOG_NAVIGATION` to `launching`, as the publishing guide describes. A unit test rejects that
   phase while either variant is still inactive, so the header never links an unresolved
   domain.

No other Bunny setting needs a manual change: cache rules, middleware, the 404 file, and
certificates are applied by `hosting/provision.ts`. Analytics needs no new site entry either,
because the websites load no analytics script yet ([ADR-0011](../adr/0011-cookieless-analytics.md)).

## Verify and maintain

```sh
pnpm --filter @sebastian-websites/blog agent:check
pnpm --filter @sebastian-websites/blog build
pnpm hosting:plan
pnpm --filter @sebastian-websites/blog check:browser
pnpm --filter @sebastian-websites/blog check:fixtures
pnpm --filter @sebastian-websites/blog check:browser:fixtures
```

`check:browser` covers every page of both language builds at desktop and phone width,
including the home page's feeds, the header and language switch, the 404 page, static
rendering, and catalog recovery. `check:fixtures` builds the test posts in
`apps/blog/test/fixtures/blog/` at two build times and runs the hosting gate on them;
`check:browser:fixtures` then checks the home page, posts, next steps, tag archives, and feeds
of that build. Screenshots go to `apps/blog/build/evidence` and `build/evidence-fixtures`.
