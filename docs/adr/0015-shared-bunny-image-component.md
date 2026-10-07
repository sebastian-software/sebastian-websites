---
status: accepted
updated: 2026-10-07
---

# Site images use the shared BunnyImage component

All sites use `BunnyImage` from `@sebastian-websites/ui` for raster images that need
Bunny Optimizer transformations. The component implements the shared asset-zone
decision in [ADR-0014](0014-images-from-shared-asset-zone.md). It keeps responsive
widths, crops, loading behavior, and layout dimensions consistent across sites.
SVG logos and illustrations keep their normal Vite imports.

Repository-owned raster sources stay beside the components that use them. Import
them with `?bunny`; the shared Vite plugin reads original dimensions and produces
an immutable `images/<sha256>.<extension>` path. Deployment uploads new originals
to the shared asset zone before publishing site documents, skips unchanged bytes,
and preserves older hashes. Private photo originals remain outside this public
repository and use the same component through an `ImageSource` descriptor.

## Usage

Register `bunnyImages()` from `@sebastian-websites/web-core/vite` in the app's Vite
plugins. Add `@sebastian-websites/web-core/bunny-images` to TypeScript's
`compilerOptions.types`, preserving existing entries. The Software app already
includes both settings.

```tsx
import { BunnyImage } from "@sebastian-websites/ui"
import illustration from "./images/illustration.jpg?bunny"

export function Illustration() {
  return (
    <BunnyImage
      src={illustration}
      alt="A diagram of the application"
      width={800}
      height={600}
      sizes="(max-width: 900px) calc(100vw - 32px), 800px"
    />
  )
}
```

- `width` and `height` describe the placement's aspect ratio and reserve layout
  space. CSS controls its displayed size; `sizes` must match that size at each
  breakpoint. Supply descriptive `alt` text, or `alt=""` for decorative images.
- The component generates width-based `srcSet` candidates. The browser chooses
  the appropriate resolution for the display width and pixel density; candidates
  never exceed the available original crop. Use `widths` when a placement needs
  a different set of candidate widths.
- Crops default to center. Use `crop={{ mode: "faces" }}` for face detection or
  `crop={{ mode: "focus", point: [0.45, 0.35] }}` for a reviewed focal point.
- Use `sources` for art direction: each variant supplies `media`, `aspectRatio`,
  and `sizes`, with an optional alternative `src`, crop, and candidate widths.
  The component renders a `picture`; account for its wrapper in layout selectors.
- Images are lazy-loaded and decoded asynchronously by default. Use `priority`
  for the page's LCP image to request eager loading with high fetch priority.
  Other visible images can use `loading="eager"`.
- Use `responsiveImage()` from `@sebastian-websites/web-core` when image URLs or
  matching preload attributes are needed outside JSX. Components do not assemble
  Bunny query strings themselves.

The [responsive images guide](../operations/responsive-images.md) contains the
complete setup, private-photo example, art-direction example, and preload rules.
The component and its exported types live in
[packages/ui/src/BunnyImage.tsx](../../packages/ui/src/BunnyImage.tsx).

## Considered options

- **Plain image elements and transformation helpers in each app.** Rejected:
  every site would have to maintain responsive candidates, crop behavior, and
  loading defaults independently.
- **A general image-provider component.** Libraries such as Unpic can cover
  responsive images, but our shared source metadata, deployment paths, and crop
  rules still need an adapter. A small component over the existing shared helper
  keeps this contract in one place without another runtime dependency.
- **A shared BunnyImage component.** Chosen: one typed API serves existing shared
  photos and repository-owned images, including prerendered pages.

## Consequences

- New sites reuse the shared component and plugin instead of maintaining an
  image pipeline per application. New responsive or crop behavior belongs in the
  shared packages, with usage documented in the guide.
- Repository imports work locally without uploading originals. Development
  displays the unprocessed source; verify Bunny face and focus crops in a built
  preview after its originals have been deployed.
- Content hashes keep old deployments valid and avoid image-cache purges for
  immutable uploads. The shared asset zone accumulates originals; deleting older
  hashes requires a separate retention decision.
- The component depends on the shared Optimizer configuration in ADR-0014.
  Original files remain unchanged; Bunny creates and caches delivery variants.
