# Site development

## Images

Use Ardo for the product, landscape, and editorial illustrations on Software, Open Source,
and the blog. Import a local `*.image.mdx` through `Illustration` as described in the
[responsive images guide](docs/operations/responsive-images.md). Preserve the original framing.

Use `BunnyImage` from `@sebastian-websites/ui` for raster images that need Bunny
Optimizer transformations. Read
[ADR-0015](docs/adr/0015-shared-bunny-image-component.md) and the
[responsive images guide](docs/operations/responsive-images.md) before adding or
changing image placements.

- Keep repository-owned raster sources alongside their components and import
  them with `?bunny`. `createSiteConfig()` registers the shared Vite plugin; add
  the TypeScript declaration in new apps as described in the guide. SVGs use
  normal Vite imports.
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

Include a visual self-review for every pull request that can change rendered
pages. Capture the base and head in matching conditions using the
change-screenshots route of `effective-web`, and read the Playwright diffs
before describing the change. For covered Software views, reuse
`pr-visual-review` when available for the current PR revision. See the
[Software visual comparison guide](apps/software/README.md#visual-comparisons).

Show only changed areas in the PR's `visual-review` section. Pair the before
and after views. For a copy change, show and frame the enclosing card or
section so the text has context. State what changed, which differences were
intended, and which need attention. Use the technical diff for self-review. Use the rendered pairs for
the PR description. Inspect the images before attaching them. When publishing
an authorized PR, follow the `effective-delivery` attachment workflow and
refresh that marked section after later pushes. Omit the image section when
the compared views match.

Repository facts for the change-screenshots route of `effective-web`:

- `pnpm --filter <app> build` builds an app's variants into
  `apps/<site>/build/<variant>/client`, the brand app into
  `apps/brand/build/client`. The Consulting build needs Playwright's Chromium.
- A page is a directory with an `index.html`; unknown paths resolve to
  `/404/index.html`.
- `?bunny` images load from the asset zone as `/images/<sha256>.<ext>`; images
  the change adds are in the head build's `images/` directory.

## Consulting copy

Read [the Consulting communication guide](apps/consulting/BRAND.md) before revising
Consulting pages, consultant profiles, or their localized PDF copy.

## Blog posts

Read [ADR-0022](docs/adr/0022-tech-blog-as-its-own-site.md),
[ADR-0021](docs/adr/0021-blog-on-the-software-website.md), and the
[blog publishing guide](docs/operations/blog-publishing.md) before adding,
renaming, or withdrawing a post under `apps/blog/content/posts/`, or changing
tags and next steps. Post images and covers go through Ardo's build-time image
pipeline, not Bunny; keep image files beside the post. German
copy on the tech blog addresses readers with „du“; the Software site keeps „Sie“.

**Effective Flow project setup:** docs/adr/0020-effective-flow-project-setup.md
