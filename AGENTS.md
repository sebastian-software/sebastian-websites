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

## Pull request screenshots

When a pull request can change how a site looks, add annotated before/after
screenshots to its description with the change-screenshots route of
`effective-web`. These repository facts apply:

- `pnpm --filter <app> build` builds both language variants of an app into
  `apps/<site>/build/<variant>/client`; the brand app builds into
  `apps/brand/build/client`. Build the merge base in a separate Git worktree.
  The Consulting build renders PDFs and needs Playwright's Chromium.
- Every prerendered page is a directory with an `index.html`; serve a directory
  as its `index.html` and unknown paths as `/404/index.html`, like the Bunny
  middleware.
- Serve both revisions from the same origin: the brand page prints its own URL.
- Images imported with `?bunny` load from the shared asset zone as
  `/images/<sha256>.<ext>`. Images added by the change are not uploaded yet;
  serve those from the head build's `images/` directory.
