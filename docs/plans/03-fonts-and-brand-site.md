# Serve the fonts from the CDN and move the brand assets here

## Status

- Priority: P2
- Effort: M
- Risk: MEDIUM (licence boundary for the fonts; external consumers of the brand package)
- Depends on: 02
- Planned at: f007192, 2026-10-06
- Working state: clean

## Why this matters

The repository is public ([ADR-0012](../adr/0012-public-repository.md)), so the licensed
typefaces cannot live in it, and the brand package was private only because of them.
[ADR-0013](../adr/0013-brand-assets-in-monorepo-fonts-on-cdn.md) moves logos and tokens here
as `brand.sebastian-software.com` and serves the fonts from one CDN host.

## Current state

- `sebastian-brand/fonts/`: woff2 files (Sans 100 to 900, Slab 300 to 700, each with italics),
  `fonts.css` (8 core faces), `fonts-all.css` (26 faces), `SUBSET-SPEC.md`, and the licence
  texts in `sans-serif/LICENSE.md` and `slab-serif/LICENSE.md`. The Fontfabric licence forbids
  handing the font files to third parties; web embedding on company sites is licensed.
- `sebastian-brand/tokens/*.css`, `sebastian-brand/sebastian-{software,holding,consulting}/`
  (SVG and PNG logos and icons), `sebastian-brand/index.html` (the reference page, deployed on
  Vercel as `sebastian-brand.vercel.app` with open CORS per `vercel.json`).
- Consumers of the npm package `@sebastian-gmbh/assets` 1.6.0: the old Consulting repository
  (`packages/brand`), `sebastian-brand/presentation-template`, and
  `palamedes-website-temp`. The Vercel URL is hot-linked from several READMEs; the README
  theme (`sebastian-theme/markdown/footer.md`) loads the logo from the old Open Source
  repository on raw GitHub.
- The brand README describes the light and dark icons the wrong way round; the dark
  Consulting icon's background is `#110306`, not Plum `#1b0209`.
- The export paths in `sebastian-brand/package.json` were renamed after v1.6.0 and are not
  released; publishing them would break the old Consulting repository.

## Scope

In scope:

- A private repository `sebastian-fonts` with the woff2 files, the licence texts, the subset
  spec, and the two CSS files, plus a workflow that uploads them to a Bunny storage zone.
- A pull zone and host `fonts.sebastian-software.com` with `Access-Control-Allow-Origin: *`
  and a long immutable cache; defined as configuration here per ADR-0009.
- `apps/brand`: tokens, logos, icons, and the reference page, English only, outside the
  bilingual variant list, published at `brand.sebastian-software.com` with open CORS for
  `tokens/*.css` and `*.svg`. The README corrections travel with the move.
- Switching `packages/ui` to the font host.
- Repointing the README theme and the presentation template to the new URLs.

Out of scope:

- Publishing a new version of `@sebastian-gmbh/assets`; it stays frozen at 1.6.0.
- Retiring the `sebastian-brand` repository and the Vercel project; that is plan 10.

## Verification commands

| Purpose    | Command                                                        | Expected result                                                            |
| ---------- | -------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Font host  | `curl -sI https://fonts.sebastian-software.com/sans/400.woff2` | 200, `access-control-allow-origin: *`, `cache-control` with a long max-age |
| Brand site | `pnpm --filter @sebastian-websites/brand build`                | `dist/brand/index.html` and `dist/brand/tokens/software.css` exist         |
| Shell      | `pnpm --filter @sebastian-websites/ui test`                    | fixtures pass with font URLs pointing at the host                          |

## Steps

### 1. Create the fonts repository and host

Create the private repository, move the font files and licences, add the upload workflow and
the Bunny storage and pull zone configuration. Choose stable file names so the URLs never
change.

### 2. Move the brand assets

Create `apps/brand` with tokens, logos, icons, and the reference page. Fix the icon
descriptions and the Consulting dark icon background. Publish at
`brand.sebastian-software.com`.

### 3. Switch consumers

Point `packages/ui` at the font host. Update `sebastian-theme/markdown/footer.md` to load the
logo from the brand site, and the presentation template to the token and font URLs. Leave the
old Consulting repository on the frozen package.

## Done criteria

- [ ] No font file exists in any public repository.
- [ ] All sites built from this repository load fonts from the host.
- [ ] The brand site serves the same tokens and SVGs the Vercel page served.
- [ ] The README theme no longer depends on the old Open Source repository.

## Stop conditions

- Stop if the licence texts contradict serving the fonts from a shared host; the owners
  confirmed web use, but the hosting form should be read against the licence once.
- Stop before deleting anything in `sebastian-brand`; it stays until plan 10.

## Maintenance and review focus

The font URLs are a contract for every site and the presentation template. Reviewers should
check cache headers, CORS, and that the brand site's assets are byte-identical to the moved
originals except for the two documented fixes.
