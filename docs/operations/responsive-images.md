# Responsive images

`BunnyImage` in `@sebastian-websites/ui` renders a responsive image using the shared
Bunny asset zone. Originals have known dimensions; `srcset` candidates never exceed
the available crop. The browser uses `sizes` and its pixel density to choose a variant.

The decision and a starting example are recorded in
[ADR-0015](../adr/0015-shared-bunny-image-component.md). New site implementations
reuse this component and the shared Vite plugin.

## Repository images

The Software Vite config registers `bunnyImages()` from
`@sebastian-websites/web-core/vite`. Other Vite apps can register the same plugin.
Their TypeScript `compilerOptions.types` must include
`@sebastian-websites/web-core/bunny-images` alongside the existing types to declare
the `?bunny` import type.

Keep raster sources alongside components and import them with `?bunny`:

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

The import returns an `ImageSource` with original dimensions and a path such as
`images/<sha256>.jpg`. Unlike a normal Vite URL import, it carries the metadata
needed to bound responsive variants. The plugin detects the file format, reads
EXIF orientation, and hashes the unchanged source bytes. Identical originals
across filenames, sites, and languages share one path. Supported sources are JPEG,
PNG, WebP, AVIF, and GIF; SVG stays on the normal Vite import path.

Client builds write originals under `images/` and an upload manifest at
`_bunny/images.json`. SSR builds use the same paths without another copy of the
originals. Deployment verifies the manifest hashes, deduplicates across builds,
uploads missing originals to the asset zone, and verifies delivery before publishing
site documents. It preserves older originals, skips unchanged bytes, and does not
purge the image cache. The manifest and these originals are excluded from website
uploads. Hash-addressed files must never be overwritten with different bytes.
Unchanged shared fonts also skip purges. Updates to mutable shared assets, such as
the font stylesheet or manually managed photos, retain the existing zone purge.

Development imports use Vite's local URL and require no Bunny upload. They show the
unprocessed original; Bunny face and focus transformations are visible in built
previews after the originals have been deployed. A local production preview also
uses the asset zone.

## Existing shared originals

Private photo originals remain outside the public repository. Reference them with
an `ImageSource` such as `{ path: "shooting-2024/shoot-19.jpg", width: 3961, height: 5942 }`.
The component supports both these sources and repository imports.

## Display sizes and crops

`width` and `height` describe the fallback placement and its aspect ratio. They
reserve layout space; they do not replace CSS. Set `sizes` to the actual CSS display
width at each breakpoint. The component forwards native image attributes, refs,
events, classes, and styles to the `img` element. With art direction it adds a
`picture` wrapper; layout selectors must account for that wrapper.

By default candidates include 320, 480, 640, 960, 1280, 1920, and 2560 pixels, the
fallback width, and the maximum useful width. Candidates are bounded by both the
source crop and three times the placement width, then deduplicated. `widths` can
override the candidate list, for example `[72, 144, 216]` for a small portrait.
The limit still applies, and width descriptors describe actual output widths.

The default crop is centered. Set `crop` to `{ mode: "faces" }` for face detection,
or `{ mode: "focus", point: [0.45, 0.35] }` for a fixed relative focal point. Add
`zoom` (at least 1) to a focus crop to cut a tighter rectangle around that point, for
example to give two portraits the same head size. A focus crop sends Bunny's
`focus_crop` without `aspect_ratio`; Bunny ignores the focal point when both are present.
Face detection falls back to the center when no faces are found. With multiple
faces it centers between them; an especially narrow crop may exclude some people.
Review important crops, particularly hero images. Crops are calculated from the
original and stay identical across resolution candidates; Bunny resizes afterward.

For different mobile and desktop compositions, set `sources`:

```tsx
<BunnyImage
  src={portrait}
  alt="The founders"
  width={1200}
  height={675}
  sizes="60vw"
  crop={{ mode: "focus", point: [0.5, 0.35] }}
  sources={[
    {
      media: "(max-width: 767px)",
      aspectRatio: [4, 5],
      sizes: "calc(100vw - 32px)",
      crop: { mode: "faces" },
    },
  ]}
/>
```

Each source gets its own `srcset`, `sizes`, and intrinsic dimensions. Order sources
from most specific to least specific; the browser selects the first matching one.
A source can also supply another `src` original and another `widths` list.

Images default to lazy loading and asynchronous decoding. Use `priority` for the
likely LCP hero: it forces eager loading and high fetch priority. Other above-the-fold
images can use `loading="eager"` without high priority.

For preloads or background images, `responsiveImage()` from
`@sebastian-websites/web-core` generates the same variants without React. A preload
must use the same source, crop, widths, and `sizes` as its image. Art-directed images
need matching media-specific preloads if a preload is necessary.
