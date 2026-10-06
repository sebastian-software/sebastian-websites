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

## What a deployment does

For website targets:

1. `provision.ts`: creates or reuses the storage zone (DE, replicated to SE and NY) and the
   pull zone (EU and US delivery, cookies off, query strings ignored), applies the two cache
   rules (hashed `assets/` immutable for a year, everything else purged on publish and kept
   five minutes in browsers), publishes the path-resolving middleware and links it, and
   attaches the canonical hostname with a free certificate when the variant is active.
2. `publish.ts`: uploads new and changed files by checksum, deletes files the build no longer
   contains, and purges the pull zone.
3. `verify.ts`: fetches the home page, one prerendered route with and without a trailing
   slash, a missing path, and one asset per CORS extension on the origin host.

The middleware (`middleware-logic.ts`, bundled by `bundle.ts`) resolves `/imprint` to
`imprint/index.html` on the storage zone and redirects `/imprint/` to `/imprint` permanently,
because prerendering writes directories and Bunny Storage serves files only.

## Running it

```bash
pnpm build
BUNNY_API_KEY=… pnpm deploy
```

Locally the key comes from 1Password; in CI from the secret. `pnpm hosting:check` runs the
type check, lint, and the tests against a fake Bunny account.

## Not yet covered

- Previews per pull request. The old Consulting repository gated them with an HMAC token on a
  shared preview zone; that pattern returns once the first site is live.
- Redirect rules of ADR-0010 beyond the trailing slash; they join the middleware with the
  first domain cutover.

## Assets

`sebastian-websites-assets` has no build directory. CI provisions it with Optimizer and
image and immutable font caching, without HTML rules or middleware, and never uploads or deletes its sources.
Every other pull zone keeps Optimizer disabled. Image query strings remain in the asset
cache key so different widths and crops cannot share the same cached response.

Upload source files manually through Bunny's file manager. Keep local backups outside this repository:

```text
~/Workspace/sebastian-assets/
  shooting-2024/
    shoot-1.jpg
    ...
    shoot-46.jpg
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
immutable cache lifetime. Changed font bytes require a new filename. Font CSS, fallback
metrics, and family stacks are versioned and deployed by the brand application; see
[font hosting](font-hosting.md).

The owners' DNS step is a CNAME from `assets.sebastian-software.com` to
`sebastian-websites-assets.b-cdn.net`. The record is already present in Bunny DNS, but
the domain's authoritative nameservers are Cloudflare (`dina` and `matt`), where the
record still needs to be added. Provisioning attaches the hostname and requests its
certificate; it retries certificate issuance after DNS is live and then forces HTTPS.
Keep `ASSET_HOST.productionActive` false in `packages/web-core/src/image.ts` until DNS,
the certificate, and HTTPS are verified; then switch it to true. Until then the sites
use the Bunny origin hostname.

The font URLs in `apps/brand/public/fonts.css` and `fonts-all.css` also use the Bunny
origin; update those URLs at the same verified cutover.

The shared `image()` helper uses original dimensions to compute the largest focal crop
at the placement's aspect ratio, then requests responsive widths and quality. This follows
[Bunny's crop-before-resize behavior](https://bunny.net/docs/optimizer/dynamic-images/cropping).
Image classes and `OptimizerForceClasses` remain a follow-up after placements stabilize.
