# Font hosting integration

The shared `sebastian-websites-assets` zone stores WOFF2 font binaries under
`fonts/Glober/` and `fonts/Elena/`, using the actual family and original face names.
Upload binaries manually through Bunny's file manager. The same `fonts/` folder serves
one generated base stylesheet; CI publishes its source from `assets/fonts/`.
License records, local sources, and correspondence stay outside this public repository.

## Subsetting from licensed originals

`scripts/prepare-fonts.py` reads the 18 licensed Glober OTF faces and the eight original
full-featured Elena WOFF2 faces. Elena Basic is excluded: it duplicates the full
family's design and language coverage with fewer OpenType features
([foundry comparison](https://processtypefoundry.com/help/base/full-vs-basic-fonts/)),
and no consumer uses it. Existing Basic binaries on the CDN may remain unused.
Use Python 3.11 or newer.
It generates a Latin subset and
an extended subset for every face, plus the asset stylesheet and brand wrapper. Install
the pinned dependencies in a local Python environment, then run:

```bash
python -m pip install -r scripts/requirements-fonts.txt
python scripts/prepare-fonts.py \
  --glober "/path/to/Glober Font (Licensed 2014)" \
  --elena "/path/to/Elena Font (Commercial 2024 Extended)/webfont" \
  --output "/private/path/to/prepared-fonts" \
  --css apps/brand/public \
  --asset-css assets/fonts
```

Only upload the generated `Glober` and `Elena` directories, not `manifest.json`.
The manifest records byte sizes, hashes, and character coverage for local verification.
Use this tooling only for sources whose license allows conversion and subsetting.

The Latin selection intersects each original Unicode map with these blocks:

| Range         | Content                                  |
| ------------- | ---------------------------------------- |
| `U+0000–024F` | Basic Latin, Latin-1, Latin Extended A/B |
| `U+0300–036F` | Combining diacritics                     |
| `U+1E00–1EFF` | Latin Extended Additional                |
| `U+2000–206F` | General punctuation                      |
| `U+20A0–20CF` | Currency symbols                         |
| `U+FB00–FB06` | Common Latin presentation ligatures      |

Everything else mapped by the original goes into the extended file. The stylesheet
uses the exact actual codepoints, not entire blocks containing unsupported characters.

The Latin files include Latin characters, combining diacritics, extended Latin,
punctuation, currencies, and common ligatures. CSS `unicode-range` loads the extended
files only when their characters occur. Both subsets together retain every Unicode
character mapped by the original face; no character is intentionally dropped.
The generator checks exact combined coverage, character advance widths, glyph outlines, and vertical
metrics after reopening each WOFF2. It retains all OpenType layout features, hinting,
and original name records. Coverage is limited by the original font: absent scripts
still use the CSS fallback stack.

The unchanged vendor Elena files previously uploaded under `fonts/elena/` and older
neutral-name subsets remain available for compatibility. New CSS uses the explicit
family paths above. Keep license correspondence in a separate private storage zone
with no connected pull zone, never under the publicly served asset zone.

## Base font CSS and brand typography

One stable base stylesheet lives beside the binaries:
`https://assets.sebastian-software.com/fonts/fonts.css`. Its source is versioned in
`assets/fonts/fonts.css` and includes all 26 Glober and full-featured Elena faces.
There is no separate core/all selection or per-family stylesheet.

Each face has Latin and extended `@font-face` rules with matching family, weight,
and style and disjoint `unicode-range` values. The browser combines these into one
face and downloads the subsets needed for the text. Declaring unused weights does
not download their WOFF2 files. Relative binary paths resolve next to the CSS without
image transformation parameters. Unused binary files on the CDN need no cleanup.

The base exposes `--font-glober` and `--font-elena`, with simple
system font fallbacks. It has no classes, metric adjustments, letter spacing, font
sizes, line heights, or imports from the brand application. A standalone consumer uses:

```html
<link rel="stylesheet" href="https://assets.sebastian-software.com/fonts/fonts.css" />
```

```css
body {
  font-family: var(--font-glober);
}
h1 {
  font-family: var(--font-elena);
}
```

The brand application owns the typography choices that may evolve:

- `apps/brand/public/fonts.css`: imports the asset stylesheet, followed by `typography.css`.
- `apps/brand/public/typography.css`: metric-adjusted fallback faces, overrides for
  the base family variables, semantic aliases such as `--sebastian-font-sans`, and
  letter-spacing variables. Existing `.sebastian-sans`, `.sebastian-serif`, and slab
  utility classes remain available for compatibility.

Consumers wanting the brand adjustments load `https://brand.sebastian-software.com/fonts.css`.
The Software site uses this URL through `FONT_STYLESHEET` from `packages/ui`; the brand
page loads its own `/fonts.css`. The existing `/fonts.css` entry point on the Bunny
origin hostname remains compatible. Sizes and line heights belong to each site.

Both CSS layers are reviewed in this repository and published through the normal CI,
with open CORS and a five-minute browser lifetime. The canonical hostnames have
Cloudflare DNS-only CNAMEs and Bunny certificates with forced HTTPS; see
[website hosting](website-hosting.md).

## Binary delivery and updates

`hosting/targets.ts` adds WOFF2 to the shared asset zone's open CORS extensions.
`hosting/zone-settings.ts` defines one-year immutable font caching separately from image
caching. Bunny Optimizer's image transformations do not process these font files.
Content hashes in the generated filenames make changed bytes receive new URLs.
Font updates require a reviewed CSS URL change; existing immutable
URLs must never be overwritten with different bytes.

Bunny is the delivery store. Keep a local source backup. The optional asset upload script
preserves remote files absent from its local folder, so a photo upload cannot delete fonts.
CI provisions the asset zone and publishes only the CSS source in `assets/`; it never
deletes remote files or uploads the manually managed font and image sources.
The existing organization `BUNNY_API_KEY` is sufficient for infrastructure provisioning.

## Retiring the previous font host

The previous font host was retired on October 6, 2026, after the shared-host migration
was deployed and its public CSS and font URLs were verified. The authoritative
`fonts.sebastian-software.com` DNS record and the `fonts-sebastian-software` pull zone
were removed. The private `sebastian-fonts` repository is archived, its publishing
workflow is disabled, and its Git history is backed up locally.

The Software and Brand applications and the design comps use the versioned brand CSS
above. Licensed originals, prepared files, and private license records remain backed
up outside this public repository. The old storage zone remains a private backup
without a connected pull zone; it is not part of the new deployment.

## Verification and immutable file names

Generated names include the first 12 hexadecimal characters of the file's SHA-256,
for example `GloberRegular-latin-<hash>.woff2`. The font's original modification time
is retained, so rerunning the same pinned toolchain and sources produces the same
bytes. Changed sources or toolchain output receive new URLs; never overwrite a
previously published immutable file. Run Prettier on the generated CSS before committing.

The CSS family names remain `Glober` and `Elena`. The split is a
Unicode partition of each original face, not a list extracted from today's website
text. This keeps future copy, accented names, and existing non-Latin characters
available. Ligature/layout closure retains glyphs that have no direct Unicode mapping.
Keep both files for every face and publish the CSS only after both uploads pass
SHA-256, `font/woff2`, CORS, and immutable cache-header checks. Inspect representative
Latin, ligature, and extended-script text in a browser as well.
