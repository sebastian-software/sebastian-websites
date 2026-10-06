---
status: proposed
updated: 2026-10-06
---

# Images are served from one shared asset zone with Bunny Optimizer

The sites show a small, known set of photographs: the 2024 shoot, portraits, and later a few
product visuals. These sources live on one shared Bunny storage zone with its own pull zone,
`assets.sebastian-software.com`, with Bunny Optimizer enabled on that zone alone. Each
placement requests the variant it needs through the Dynamic Images API (width, aspect ratio,
focal crop, quality); the zone converts to WebP or AVIF for browsers that accept them and
caches every variant at the edge. The sites' own pull zones stay without the Optimizer.

Client logos stay in the repository as SVG; they need no transformation.

## What Bunny offers (checked on 2026-10-06)

- **Pricing:** Optimizer is a per-pull-zone add-on at 9.50 USD per month with unlimited
  transformations. One shared asset zone costs it once; enabling it on the nine site zones
  would cost about 85 USD per month for the same images.
- **Dynamic Images API** (URL query parameters, transformed on first request and cached at the
  edge): `width`, `height`; `crop=w,h` or `crop=w,h,x,y` with `crop_gravity` (`center`,
  `north`, `south`, `east`, `west`, `northeast`, `northwest`, `southeast`, `southwest`);
  `focus_crop=w,h,x,y` with absolute or relative (0 to 1) focal coordinates; `quality`;
  `format` (`webp`, `avif`, `jpeg`, `png`, `gif`); `sharpen`, `blur`, `brightness`,
  `contrast`, `saturation`, `gamma`, `hue`, `tint`, `sepia`, `flip`, `flop`, `rotate`. Crops
  run before resizing. Images are not upscaled unless `upscaling=resampling` is set (up to
  24 megapixels). AVIF output is limited to 4 megapixels; larger results fall back to WebP or
  JPEG, which never affects web sizes.
- **Image classes:** named presets such as `?class=hero`; `OptimizerForceClasses` restricts
  the API to presets and answers other transformations with 403, which Bunny recommends for
  production.
- **Zone settings** through the pull zone API that `hosting/` already uses:
  `OptimizerEnabled`, `OptimizerEnableManipulationEngine`, `OptimizerEnableWebP`,
  `EnableAvifVary`, `OptimizerAutomaticOptimizationEnabled`, `OptimizerDesktopMaxWidth` and
  `OptimizerMobileMaxWidth` (0 to 5000), `OptimizerImageQuality`, `OptimizerEnableUpscaling`,
  `OptimizerClasses`, `OptimizerForceClasses`.

## Why a shared asset zone

- **The public repository stays free of photographs.** Portraits of third parties need a
  recorded permission before they appear anywhere ([ADR-0012](0012-public-repository.md)),
  and large binaries do not belong in a public Git history. Sources are uploaded from a
  private location by a hosting script, the same way the fonts are
  ([ADR-0013](0013-brand-assets-in-monorepo-fonts-on-cdn.md)).
- **One fee, every variant.** Eight site variants and the brand site reference the same
  URLs, so the edge cache is shared and a new crop costs nothing but a query string.
- **Crops stay reviewable.** The focal point and aspect ratio of a placement are parameters
  in the component's code, visible in every pull request, exactly as a build-time crop would
  be.
- **Development and previews match production** without local image processing: they load
  the same public URLs.
- **Dimensions are known without a manifest.** A requested width and aspect ratio determine
  the height, so every image gets `width`, `height`, `srcset`, and `sizes`, and the hero
  image can be preloaded.

## Considered options

- **Optimizer on every site zone.** Rejected: nine fees for one set of images.
- **Build-time pipeline with `sharp`.** Rejected for now: it needs the sources in the build,
  which means either in the public repository or in a private build input, and it adds image
  processing to every build. It remains the fallback if the asset host ever goes away.
- **One shared asset zone with Optimizer.** Chosen; the owners pointed to it on 2026-10-06.

## Consequences

- `hosting/` gains the target `sebastian-websites-assets` with the hostname
  `assets.sebastian-software.com`. Provisioning sets `OptimizerEnabled`,
  `OptimizerEnableManipulationEngine`, `OptimizerEnableWebP`, and `EnableAvifVary` to `true`,
  and `OptimizerAutomaticOptimizationEnabled` and `OptimizerEnableUpscaling` to `false`: the
  sites request variants explicitly.
- A `publish-assets` script uploads sources with checksums from a private folder or
  repository and purges changed paths. Everything on the asset host is public, so the
  clearance rule of ADR-0012 applies to the upload, not only to the repository.
- Sources are stored at a working resolution of about 3000 px on the long edge as JPEG.
- A shared `image()` helper in `packages/web-core` composes the URL and the `width`/`height`
  pair for a placement; components never write query strings by hand.
- Image classes are defined once the placements are stable, and `OptimizerForceClasses` is
  then switched on.
