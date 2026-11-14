# Website hosting on Bunny

Every push to `main` runs the `Deploy` workflow, which publishes each target that has a build
([ADR-0009](../adr/0009-delivery-model.md)). The scripts in `hosting/` own the whole chain and
need only `BUNNY_API_KEY` in GitHub Actions secrets.

## Targets

`hosting/targets.ts` derives the targets from the variant list in `packages/web-core`: one
storage and pull zone pair per variant, named like its `deploymentTarget`
(`sebastian-websites-software-en`), plus `sebastian-websites-brand` and the shared `sebastian-websites-assets` zone. Each target is reachable
on its origin host `https://<name>.b-cdn.net/`. A variant's canonical domain is attached only
once it is `productionActive`; until then the origin host is the place to look.

The brand reference site is published at `https://brand.sebastian-software.com/`.
Cloudflare has a DNS-only CNAME from `brand.sebastian-software.com` to
`sebastian-websites-brand.b-cdn.net`. Bunny serves it with a free managed certificate
and redirects HTTP to HTTPS. The brand target declares this hostname so provisioning
maintains its certificate and HTTPS settings. The existing logo, token, and font CSS
paths are available under the canonical domain.

## Consulting www aliases

The active Consulting targets declare `www.sebastian-consulting.de` and
`www.sebastian-consulting.com` as aliases. Bunny DNS has a `www` CNAME to
`sebastian-websites-consulting-de.b-cdn.net` and
`sebastian-websites-consulting-en.b-cdn.net`, respectively. DNS records are managed
separately from deployment; establish them before certificate issuance.

Provisioning attaches each alias, issues its certificate, enables forced HTTPS only
once a certificate exists, and maintains a 301 edge rule matching only that alias.
The redirect target is `https://<canonical-host>%{Request.Path}`. Bunny's
[variable expansion](https://bunny.net/docs/cdn/edge-rules/variable-expansion)
retains the original path and query before the cache lookup. Rules are reconciled by
description, so existing matching dashboard rules are adopted and unrelated rules
are preserved. A certificate waiting for DNS is retried on a later deployment.

Both aliases were activated on October 8, 2026. Public HTTPS redirects passed for
root, profile, PDF, and encoded asset paths with query strings; HTTP requests
followed through to the canonical HTTPS site. MX, SPF, DKIM, DMARC, profile aliases,
CAA, and nameservers were compared before and after and remained unchanged.

## What a deployment does

Before changing remote files, `check-builds.ts` loads every buildable target and
`seoPlans()` in `seo.ts` compares the two language builds of each site:

- A site with a build in one language only fails.
- Both builds must record the same build time in `build-time.txt`, next to their
  `client/` directory and therefore never uploaded. The value is an RFC 3339
  timestamp with seconds and a time zone. Every build writes it; the check
  requires it for the tech blog, because Ardo decides by it which posts are due.
  Two builds of another site without it count as built together.
- A path in both builds needs the German, English, and English `x-default`
  alternates. Only the tech blog may have a path in one build only, and only posts
  (`/posts/<slug>` marked `og:type=article`) and tag archives (`/posts/tags/<key>`)
  qualify. Such a page links no alternates (ADR-0010). Every other unpaired path
  fails.

The comparison yields one plan per variant, and each build is then checked against
its plan. Its sitemap must list exactly the canonical HTML pages, excluding the
not-found page and downloads. Each page must have one self-referencing canonical,
the alternates from the plan, the correct document language, and no indexing block.
Software and tech blog pages also need exactly one `og:type` and one `og:url` equal
to the canonical. On other sites these tags are optional but must not repeat or name
another page. Its robots file must allow crawling and name its own sitemap. The
brand catalog and shared asset zone are outside this variant contract.

Before publishing websites, deployment collects Vite's `?bunny` image manifests,
verifies content hashes, and publishes the deduplicated originals to the shared
asset zone. These uploads preserve old files and skip cache purges. Original
delivery is verified before website documents are uploaded. See
[responsive images](responsive-images.md).

For website targets:

1. `provision.ts`: creates or reuses the storage zone (DE, replicated to SE and NY) and the
   pull zone (EU and US delivery, cookies off, query strings ignored), applies the two cache
   rules (hashed `assets/` immutable for a year, everything else purged on publish and kept
   five minutes in browsers), publishes the path-resolving middleware and links it, and
   attaches each declared canonical and alias hostname with a free certificate and forced
   HTTPS. Alias edge rules redirect to the canonical hostname with status 301. Site variants
   declare their hostnames only when active; the brand site is already active. A content-type
   rule serves `*.webmanifest` as `application/manifest+json`. Site variants point the storage
   zone's custom 404 file at their prerendered not-found page (`/404/index.html`), so a missing
   path answers 404 with the branded page in the site's language; redirects and 410 answers of
   the middleware come first.
2. `publish.ts`: uploads new and changed files by checksum, deletes files the build no longer
   contains, and purges the pull zone.
3. `verify.ts`: fetches the home page, one prerendered route with and without a trailing
   slash, a missing path, and one asset per CORS extension on the origin host. With the
   plan computed before upload, `verifySeo` then checks the variant's own origin: its
   sitemap and robots file, and every page of the plan. Documents must return 200
   without a redirect, carry the canonical and alternates the plan expects, and carry
   no meta or HTTP `X-Robots-Tag` indexing block. The other language's single-language
   pages must answer 404 on this origin. All website targets are published before
   verification, so each origin is checked against the state of both builds. Checks
   fetch the Bunny origin hosts while validating canonical URLs on the public domains,
   including before DNS cutover.

The middleware (`middleware-logic.ts`, bundled by `bundle.ts`) resolves `/imprint` to
`imprint/index.html` on the storage zone and redirects `/imprint/` to `/imprint` permanently,
because prerendering writes directories and Bunny Storage serves files only.

## First-party analytics path

A target may declare `collector` in `hosting/targets.ts` with the Tereon collector's hostname,
its site name there, and optionally a path prefix (default `/_s`, see
`DEFAULT_COLLECTOR_PREFIX`). No target declares one yet: switching the sites from Rybbit to
Tereon is a separate decision (ADR-0011), and until then every middleware bundle is byte for byte
the plain one.

For a target with a collector, `bundle.ts` builds `middleware-first-party.ts` instead of
`middleware.ts`. Its origin-request hook forwards `/<prefix>/t.js` and `/<prefix>/e` to the
collector's `/t.js` and `/e` and returns the collector's answer; every other path is resolved as
before. The forwarded request carries only `Accept`, `Content-Type`, `DNT`, `Sec-GPC`, and
`User-Agent` from the visitor, never cookies or `Authorization`, plus the visitor's address and
country in `Tereon-*` headers signed with HMAC-SHA-256. Tereon's ADR-0009 defines the header
format and the signed text; `hosting/first-party.test.ts` checks the shared test vector.
Provisioning then also excludes `/<prefix>/e` from the document cache rule, adds a rule that
never caches it and sets `Cache-Control: no-store`, and verification fetches `/<prefix>/t.js`.
The script itself is cached like a document.

The signing secret is not part of this repository or any bundle. Before a target's collector is
declared, set it by hand on that target's middleware script, `<target>-middleware`, as the script
secret `TEREON_FORWARD_SECRET` (in the Bunny panel, or with Bunny's CLI:
`bunny scripts env set TEREON_FORWARD_SECRET <value> --secret`), and add the same value for the
site to the collector's `TEREON_FORWARDERS`. Use at least 32 random characters, such as
`openssl rand -hex 32`. Without the secret the middleware answers `503` below the prefix and
forwards nothing, and verification fails.

Not yet run on Bunny: whether a `POST` below the prefix reaches the origin-request hook with its
body, which headers carry the visitor's address and country there, whether `process.env` holds
the script secret, and whether `fetch` from the middleware passes `User-Agent` on unchanged.

## Running it

```bash
pnpm build
pnpm hosting:plan
BUNNY_API_KEY=… pnpm deploy
```

`pnpm hosting:plan` runs the pre-upload checks of a deployment without credentials:
the build comparison, the SEO plans, and the Bunny
image manifests. CI runs it after `pnpm build`, and `pnpm deploy` repeats it before
changing any remote file. Build both languages of a site before running either
command; a one-language build, such as `build:de`, fails the check.
`node hosting/check-builds.ts <root>` checks builds laid out like a checkout below
another root; `pnpm --filter @sebastian-websites/blog check:fixtures` uses it for
its fixture builds.

`pnpm hosting:smoke blog-de` and `blog-en` also request `/posts`,
`/posts/rss.xml`, and `/posts/atom.xml`: the overview must be served as `text/html`,
the feeds as `application/rss+xml` or `application/atom+xml`, or as a generic XML
type.

Locally the key comes from 1Password; in CI from the secret. `pnpm hosting:check` runs the
type check, lint, and the tests against a fake Bunny account.

## Not yet covered

- Previews per pull request. The old Consulting repository gated them with an HMAC token on a
  shared preview zone; that pattern returns once the first site is live.
- Redirect rules of ADR-0010 beyond the trailing slash; they join the middleware with the
  first domain cutover.

## Assets

`sebastian-websites-assets` uses `assets/` as its public source directory. CI provisions
it with Optimizer, image and immutable font caching, and short-lived font CSS caching,
without HTML rules or middleware. It publishes the versioned base font stylesheet
and verifies their public delivery and CORS. It never deletes remote files or uploads
manually managed font binaries and images.
Every other pull zone keeps Optimizer disabled. Image query strings remain in the asset
cache key so different widths and crops cannot share the same cached response.

Upload source files manually through Bunny's file manager. Keep local backups outside this repository:

```text
~/Workspace/sebastian-assets/
  shooting-2024/
    shoot-1.jpg
    ...
    shoot-46.jpg
    color_09092024-1.jpg
    color_09092024-1-retouched.png
    ...
  fonts/
    Glober/
      GloberRegular-latin-<hash>.woff2
      ...
    Elena/
      Elena-Medium-latin-<hash>.woff2
      ...
  products/
    product-name.png
```

All 46 photographs from the 2024 shoot are published as unchanged original JPEGs. The
source `color_09092024-N.jpg` maps to `shooting-2024/shoot-N.jpg`; no recompression or
resizing occurs during publishing. Only the requested CDN variants are resized. The
initial local upload folder is `~/Workspace/sebastian-photos-2024/publish`, containing
byte-identical copies of the originals in `shooting-2024/`.

Retouched edits of all 46 photographs are uploaded manually to `shooting-2024/` beside the
originals as `color_09092024-N-retouched.png` (2352 × 3520 or 3520 × 2352). The sites reference
these edits; crops keep their relative focal points, so a replaced edit only needs its path and
dimensions updated in the app's `photos.ts`.

```bash
BUNNY_API_KEY=… node hosting/publish-assets.ts
# Use the prepared local collection instead of the default:
ASSETS_DIR="$HOME/Workspace/sebastian-photos-2024/publish" BUNNY_API_KEY=… node hosting/publish-assets.ts
```

The script is an optional upload tool. It refuses CI and empty folders, skips hidden files
and symbolic links, compares SHA-256 checksums, uploads changed files, and purges the pull
zone. It never deletes remote files absent locally, so uploading photos cannot remove
manually maintained fonts or product visuals. A second unchanged run uploads nothing.
Delete obsolete assets explicitly in Bunny after checking consumers. Everything uploaded is public; third-party portraits
require recorded permission before publishing (ADR-0012).

Only WOFF2 binaries are uploaded under `fonts/Glober/` and `fonts/Elena/`. Latin and
extended subsets preserve the original faces' combined Unicode coverage and load on
demand. They are served without image transformations, with open CORS and a one-year
immutable cache lifetime. Changed font bytes require a new filename. Base font CSS and
family variables are served beside the binaries from `fonts/fonts.css`, with all
faces in one stylesheet. Brand fallback metrics and typography choices remain in the
brand application's versioned CSS, which imports this base; see
[font hosting](font-hosting.md).

The authoritative Cloudflare DNS has a DNS-only CNAME from
`assets.sebastian-software.com` to `sebastian-websites-assets.b-cdn.net`.
Bunny's managed certificate and forced HTTPS were verified on October 6, 2026.
The Cloudflare proxy stays off so Bunny handles image optimization and font delivery.
Provisioning maintains the hostname, certificate, and HTTPS settings.
`ASSET_HOST.productionActive` is true in `packages/web-core/src/image.ts`, and the
font stylesheets and preparation script use the same canonical asset hostname.
The Bunny origin hostname remains available as a fallback for a reviewed rollback.

The shared `image()` helper uses original dimensions to compute the largest focal crop
at the placement's aspect ratio, then requests responsive widths and quality. This follows
[Bunny's crop-before-resize behavior](https://bunny.net/docs/optimizer/dynamic-images/cropping).
Image classes and `OptimizerForceClasses` remain a follow-up after placements stabilize.
