# Font hosting integration

The shared `sebastian-websites-assets` zone stores WOFF2 font binaries under
`fonts/Glober/` and `fonts/Elena/`, using the actual family and original face names.
Upload them manually through Bunny's file manager. No CSS or license records belong
in these public folders. Local sources and correspondence stay outside this repository.

## Subsetting from licensed originals

`scripts/prepare-fonts.py` reads the 18 licensed Glober OTF faces and the 11 original
Elena WOFF2 faces (including three Elena Basic faces). Use Python 3.11 or newer.
It generates a Latin subset and
an extended subset for every face, plus both versioned stylesheets. Install
the pinned dependencies in a local Python environment, then run:

```bash
python -m pip install -r scripts/requirements-fonts.txt
python scripts/prepare-fonts.py \
  --glober "/path/to/Glober Font (Licensed 2014)" \
  --elena "/path/to/Elena Font (Commercial 2024 Extended)/webfont" \
  --output "/private/path/to/prepared-fonts" \
  --css apps/brand/public
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

## Versioned CSS

The brand application's public files own the typography contract:

- `apps/brand/public/fonts.css`: eight core Glober and Elena faces used by the websites.
- `apps/brand/public/fonts-all.css`: all 29 faces for consumers needing other weights.
- `apps/brand/public/typography.css`: metric-adjusted Glober and Elena fallback faces, family stacks,
  `.sebastian-sans`, `.sebastian-serif` and slab aliases, and letter-spacing variables.

Both font stylesheets import `typography.css`. Their WOFF2 URLs point directly to the
shared asset host without image transformation parameters. The Software site uses
`FONT_STYLESHEET` from `packages/ui`; the brand page loads its own `/fonts.css`.
CSS changes are reviewed in this repository and published through the normal website CI,
with open CSS CORS and a five-minute browser lifetime. Site-specific sizes and line heights
remain with each site.

Until canonical domains are activated, consumers load
`https://sebastian-websites-brand.b-cdn.net/fonts.css` (or `/fonts-all.css`) and the CSS
references `https://sebastian-websites-assets.b-cdn.net/fonts/...`.
The asset hostname's Cloudflare CNAME, certificate, and cutover are described in
[website hosting](website-hosting.md). Update both font stylesheets' source URLs when
switching the asset host; update `FONT_STYLESHEET` when the brand hostname becomes active.

## Binary delivery and updates

`hosting/targets.ts` adds WOFF2 to the shared asset zone's open CORS extensions.
`hosting/zone-settings.ts` defines one-year immutable font caching separately from image
caching. Bunny Optimizer's image transformations do not process these font files.
Content hashes in the generated filenames make changed bytes receive new URLs.
Font updates require a reviewed CSS URL change; existing immutable
URLs must never be overwritten with different bytes.

Bunny is the delivery store. Keep a local source backup. The optional asset upload script
preserves remote files absent from its local folder, so a photo upload cannot delete fonts.
CI provisions the asset zone but never publishes or deletes its manually managed sources.
The existing organization `BUNNY_API_KEY` is sufficient for infrastructure provisioning.

## Previous font host

The private `sebastian-fonts` repository and `fonts.sebastian-software.com` previously
published binaries and CSS together through their own pipeline. Keep that host available
for existing external consumers during migration. The rebuilt Software and Brand sites
use the new contract above; deleting the old zone or repository is a separate cleanup.

## Verification and immutable file names

Generated names include the first 12 hexadecimal characters of the file's SHA-256,
for example `GloberRegular-latin-<hash>.woff2`. The font's original modification time
is retained, so rerunning the same pinned toolchain and sources produces the same
bytes. Changed sources or toolchain output receive new URLs; never overwrite a
previously published immutable file. Run Prettier on the generated CSS before committing.

The CSS family names remain `Glober`, `Elena`, and `Elena Basic`. The split is a
Unicode partition of each original face, not a list extracted from today's website
text. This keeps future copy, accented names, and existing non-Latin characters
available. Ligature/layout closure retains glyphs that have no direct Unicode mapping.
Keep both files for every face and publish the CSS only after both uploads pass
SHA-256, `font/woff2`, CORS, and immutable cache-header checks. Inspect representative
Latin, ligature, and extended-script text in a browser as well.
