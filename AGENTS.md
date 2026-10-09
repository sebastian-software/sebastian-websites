# Site development

## Images

Use `BunnyImage` from `@sebastian-websites/ui` for raster images that need Bunny
Optimizer transformations. Read
[ADR-0015](docs/adr/0015-shared-bunny-image-component.md) and the
[responsive images guide](docs/operations/responsive-images.md) before adding or
changing image placements.

- Keep repository-owned raster sources alongside their components and import
  them with `?bunny`. Register the shared Vite plugin and TypeScript declaration
  in new apps as described in the guide. SVGs use normal Vite imports.
- Supply `alt`, placement `width` and `height`, and `sizes` matching the CSS layout.
  Reuse the component's responsive candidates, crop options, and `sources` for
  art direction. Use `priority` for the page's LCP image.
- Use `responsiveImage()` from `@sebastian-websites/web-core` for matching URLs
  and preloads outside JSX; do not assemble Bunny query strings in app code.
- Private photo originals stay outside the public repository. Reference existing
  shared originals using an `ImageSource`, following
  [ADR-0014](docs/adr/0014-images-from-shared-asset-zone.md).

## Sizes and spacing

Type, space, and layout are fluid. Read
[ADR-0016](docs/adr/0016-fluid-root-font-size.md),
[ADR-0017](docs/adr/0017-space-scale-and-page-grid.md), and
[ADR-0018](docs/adr/0018-type-scale-with-growing-ratio.md) before changing sizes.

- Set font sizes with `typeStep()`; give a heading the largest step at which it
  needs at most three lines in its column on a laptop.
- Use `SPACE_SCALE` steps for rhythm and gaps, `scaled()` for other design
  lengths, and `bleed()` for anything that reaches beyond the page edge.
- Keep hairlines, shadows, and small radii in px; do not add breakpoint
  overrides for sizes.

## Pull request screenshots

Repository facts for the change-screenshots route of `effective-web`:

- `pnpm --filter <app> build` builds an app's variants into
  `apps/<site>/build/<variant>/client`, the brand app into
  `apps/brand/build/client`. The Consulting build needs Playwright's Chromium.
- A page is a directory with an `index.html`; unknown paths resolve to
  `/404/index.html`.
- `?bunny` images load from the asset zone as `/images/<sha256>.<ext>`; images
  the change adds are in the head build's `images/` directory.
