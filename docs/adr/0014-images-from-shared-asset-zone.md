---
status: proposed
updated: 2026-10-06
---

# Images are prepared at build time; Bunny Optimizer stays off

The sites show a small, known set of photographs: the 2024 shoot, client logos as SVG, and
later a few product visuals. Every crop is a design decision. The build therefore produces the
image variants itself: for each placement, a set of widths in AVIF, WebP, and JPEG, with the
crop and focal point declared in code next to the component that uses the image. The output is
plain static files, published with the rest of the build
([ADR-0009](0009-delivery-model.md)).

Bunny Optimizer, the CDN-side image service, is not enabled on the pull zones. It stays an
option for a future shared media zone if the number of images or their sources change.

## What Bunny offers (checked on 2026-10-06)

- **Pricing:** Optimizer is a per-pull-zone add-on at 9.50 USD per month with unlimited
  transformations. The sites use nine pull zones (eight variants and the brand site), so
  enabling it everywhere would cost about 85 USD per month; one shared media zone would cost
  9.50 USD.
- **Dynamic Images API** (URL query parameters, transformed on first request and cached at the
  edge): `width`, `height`; `crop=w,h` or `crop=w,h,x,y` with `crop_gravity` (`center`,
  `north`, `south`, `east`, `west`, `northeast`, `northwest`, `southeast`, `southwest`);
  `focus_crop=w,h,x,y` with absolute or relative (0 to 1) focal coordinates; `quality`;
  `format` (`webp`, `avif`, `jpeg`, `png`, `gif`); `sharpen`, `blur`, `brightness`,
  `contrast`, `saturation`, `gamma`, `hue`, `tint`, `sepia`, `flip`, `flop`, `rotate`. Crops
  run before resizing. Images are not upscaled unless `upscaling=resampling` is set (up to
  24 megapixels). AVIF output is limited to 4 megapixels; larger results fall back to WebP or
  JPEG.
- **Image classes:** named presets such as `?class=hero`; `OptimizerForceClasses` restricts
  the API to presets and answers other transformations with 403, which Bunny recommends for
  production.
- **Automatic optimisation** per pull zone: `OptimizerAutomaticOptimizationEnabled`,
  `OptimizerEnableWebP` (WebP for browsers that accept it, JPEG or PNG otherwise),
  `OptimizerDesktopMaxWidth` and `OptimizerMobileMaxWidth` (0 to 5000),
  `OptimizerImageQuality` and `OptimizerMobileImageQuality`, `EnableAvifVary` on the zone.
  CSS and JavaScript minification are included but redundant next to Vite.
- All of this is configurable through the pull zone API that `hosting/` already uses.

## Why build time

- **Crops are reviewed like code.** The round-2 and round-3 comps live from tight,
  art-directed crops. A focal point and aspect ratio per placement in the repository is
  reviewable in a pull request; a query string on a CDN URL is not.
- **Development and previews match production.** The dev server and every preview show the
  final variants without a CDN in the loop.
- **No runtime dependency and no monthly fee** for a few dozen images. The build already
  exists; adding `sharp` to it costs seconds.
- **Dimensions are known at build time**, so every image gets `width`, `height`, and
  `srcset`/`sizes` without layout shift, and the hero image can be preloaded.

## Considered options

- **Optimizer on every site zone.** Rejected: nine times the fee for the same handful of
  images, and the transformations would happen outside the repository.
- **One shared media pull zone with Optimizer and forced classes.** Deferred: the right shape
  if images ever become numerous or come from outside the repository (neither is planned).
  The hosting scripts could provision it later without changing the sites.
- **Build-time pipeline.** Chosen.

## Consequences

- Source photos enter the repository at a working resolution (2400 px on the long edge, JPEG
  quality 85); the shoot is company property. Portraits of third parties stay out until their
  permission is recorded ([ADR-0012](0012-public-repository.md)).
- A shared image component renders `<picture>` with AVIF, WebP, and JPEG sources, declared
  widths, and the placement's crop. Whether this is `vite-imagetools` or a small `sharp`
  script is decided in plan 06 when the Software site is rebuilt on the approved design.
- The pull zones keep `OptimizerEnabled` at `false`; `hosting/provision.ts` does not touch the
  Optimizer fields.
