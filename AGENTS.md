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
