# Sebastian — Brand System

The brand system of Sebastian Software GmbH, published at
[brand.sebastian-software.com](https://brand.sebastian-software.com). Its value statement is
**"Erfahrung. Klarheit. Begeisterung."** (Experience. Clarity. Enthusiasm.).

**Sebastian** carries two brands of equal rank: **Sebastian Software**, the company and its
products, and **Sebastian Consulting**, its services. The brand is intentionally not generic,
not loud, and not trend-driven. Personality, conviction, and craftsmanship are at its core.

## Brand Architecture

**Sebastian** is the core brand — used as the primary wordmark, fully functional on its own.

The subline (e.g. _Consulting_, _Software Consulting_) explains the field of activity but is **not part of the core brand**. It is optional and should only be used when additional clarity or context is required.

Legal company names (e.g. _Sebastian Software GmbH_) must **not** be part of the logo. They belong in imprint, contracts, invoices, and footers.

## Logo System

Each logo consists of:

1. **Wordmark** "Sebastian" (leading element)
2. **Icon** — abstract, interwoven "S" (equal brand anchor)
3. **Subline** (clearly subordinate, optional)

The icon is organic, balanced but not static, abstract rather than illustrative. It must not be explained or verbally interpreted.

### Icon Variants

**Icon only** (transparent, no container) — favicons, app icons, avatars, small-scale use.

**Icon with container** (rounded square with background, defined padding) — hero sections, slides, key visuals. This is a display variant, not a mandatory logo form.

### Assets

Each brand provides the same set of files in `sebastian-{brand}/`:

| File                     | Format | Use                                                      |
| ------------------------ | ------ | -------------------------------------------------------- |
| `logo-{brand}.svg`       | SVG    | Full logo with wordmark and subline                      |
| `logo-{brand}.png`       | PNG    | Raster fallback                                          |
| `icon-{brand}-light.svg` | SVG    | Icon on a light (paper) container, for light backgrounds |
| `icon-{brand}-light.png` | PNG    | Raster fallback                                          |
| `*-transparent.svg`      | SVG    | The same logo or icon without its container              |

Where `{brand}` is `software`, `holding`, or `consulting`.

Dark-background icon variants have been withdrawn pending a redesign. Only the
light variants and their transparent counterparts are currently published.

## Typography

| Element  | Typeface                                                          | Weight       | Case       | Size   | Tracking |
| -------- | ----------------------------------------------------------------- | ------------ | ---------- | ------ | -------- |
| Wordmark | [Elena](https://processtypefoundry.com/fonts/elena/) (slab serif) | Medium (500) | Mixed case | 130 pt | -20%     |
| Subline  | [Glober](https://www.fontfabric.com/fonts/glober/) (sans serif)   | Light (300)  | Uppercase  | 86 pt  | -40%     |

The wordmark should read as a name, not as an institution. The subline is explanatory and must never compete with the wordmark.

### Logo Metrics

All measurements are relative to the **wordmark cap height = 1 unit**.

| Metric             | Ratio     |
| ------------------ | --------- |
| Subline cap height | 2/3 (66%) |
| Icon height        | 1.87      |
| Slash height       | 0.71      |

### Spacing

| Between              | Gap (relative to wordmark cap height) |
| -------------------- | ------------------------------------- |
| Icon → Wordmark      | 0.40                                  |
| Wordmark → Slash     | 0.05                                  |
| Slash → Subline      | 0.05                                  |
| Canvas padding left  | 0.31                                  |
| Canvas padding right | ~0.45                                 |

### Alignment

- The **icon** is aligned optically, not mathematically — it sits slightly lower than the calculated center
- The **wordmark** is vertically centered within the icon bounds
- The **subline baseline** sits 13 units (in a 1000-unit canvas) above the wordmark baseline — effectively sharing the same baseline with a subtle optical lift
- The **slash** bottom aligns exactly with the wordmark baseline
- Wordmark and subline are visually connected — the subline must not appear as an independent block

### Color Roles

Each brand uses the same mapping from palette to logo element:

| Element         | Token   |
| --------------- | ------- |
| Background      | `paper` |
| Icon accent     | `vivid` |
| Icon + Wordmark | `dark`  |
| Slash + Subline | `base`  |

## Color Palettes

Each brand variant has a dedicated palette built on a single OKLCH hue with six lightness steps.

| Brand      | Hue |
| ---------- | --- |
| Software   | 218 |
| Holding    | 78  |
| Consulting | 2   |

### CSS Tokens

Tokens and logos are served with open CORS and immutable caching:

```css
/* All palettes */
@import "https://brand.sebastian-software.com/tokens/index.css";

/* Single palette */
@import "https://brand.sebastian-software.com/tokens/software.css";
@import "https://brand.sebastian-software.com/tokens/consulting.css";
@import "https://brand.sebastian-software.com/tokens/holding.css";
```

### Web Fonts

`Glober` and `Elena` are licensed for the company's own
websites. The font files are not part of this repository; the sites load them from the
shared asset CDN. Its base CSS combines the Latin and extended subsets and exposes
`--font-glober` and `--font-elena`:

```css
@import "https://assets.sebastian-software.com/fonts/fonts.css";

body {
  font-family: var(--font-glober);
}
h1 {
  font-family: var(--font-elena);
}
```

For the brand's adjusted fallbacks, load `https://brand.sebastian-software.com/fonts.css`
instead. That wrapper imports the asset definitions followed by the versioned
`typography.css`. The single base stylesheet includes all weights and character subsets;
the browser downloads only the binaries needed for the text. There is no separate
core/all selection or per-family stylesheet; see [font hosting](../../docs/operations/font-hosting.md).

### Software

<img src="sebastian-software/icon-software-light.svg" height="96" alt="Icon Software"> <img src="sebastian-software/logo-software.svg" height="96" alt="Logo Software">

**Mood:** cool · calm · technical<br>
**Character:** factual · structured · dependable

|                                            | Name     | Alias    | Hex       | OKLCH                  |
| ------------------------------------------ | -------- | -------- | --------- | ---------------------- |
| ![](tokens/swatches/software-space.svg)    | Space    | `night`  | `#030d11` | `oklch(0.15 0.02 218)` |
| ![](tokens/swatches/software-midnight.svg) | Midnight | `dark`   | `#002731` | `oklch(0.25 0.05 218)` |
| ![](tokens/swatches/software-teal.svg)     | Teal     | `base`   | `#005164` | `oklch(0.4 0.08 218)`  |
| ![](tokens/swatches/software-lagoon.svg)   | Lagoon   | `vivid`  | `#00718d` | `oklch(0.5 0.11 218)`  |
| ![](tokens/swatches/software-signal.svg)   | Signal   | `bright` | `#38afcc` | `oklch(0.7 0.11 218)`  |
| ![](tokens/swatches/software-frost.svg)    | Frost    | `paper`  | `#e7f0f3` | `oklch(0.95 0.01 218)` |

### Holding

<img src="sebastian-holding/icon-holding-light.svg" height="96" alt="Icon Holding"> <img src="sebastian-holding/logo-holding.svg" height="96" alt="Logo Holding">

**Mood:** refined · restrained · institutional<br>
**Character:** clear · enduring · trustworthy

|                                         | Name   | Alias    | Hex       | OKLCH                 |
| --------------------------------------- | ------ | -------- | --------- | --------------------- |
| ![](tokens/swatches/holding-pitch.svg)  | Pitch  | `night`  | `#120900` | `oklch(0.15 0.03 78)` |
| ![](tokens/swatches/holding-walnut.svg) | Walnut | `dark`   | `#2c1f09` | `oklch(0.25 0.04 78)` |
| ![](tokens/swatches/holding-brass.svg)  | Brass  | `base`   | `#5c4215` | `oklch(0.4 0.07 78)`  |
| ![](tokens/swatches/holding-amber.svg)  | Amber  | `vivid`  | `#825b0c` | `oklch(0.5 0.1 78)`   |
| ![](tokens/swatches/holding-gild.svg)   | Gild   | `bright` | `#c19652` | `oklch(0.7 0.1 78)`   |
| ![](tokens/swatches/holding-sand.svg)   | Sand   | `paper`  | `#f2eee7` | `oklch(0.95 0.01 78)` |

### Consulting

<img src="sebastian-consulting/icon-consulting-light.svg" height="96" alt="Icon Consulting"> <img src="sebastian-consulting/logo-consulting.svg" height="96" alt="Logo Consulting">

**Mood:** warm · confident · reflective<br>
**Character:** personal · advisory · opinionated

|                                              | Name     | Alias    | Hex       | OKLCH                |
| -------------------------------------------- | -------- | -------- | --------- | -------------------- |
| ![](tokens/swatches/consulting-plum.svg)     | Plum     | `night`  | `#1b0209` | `oklch(0.15 0.05 2)` |
| ![](tokens/swatches/consulting-mulberry.svg) | Mulberry | `dark`   | `#44011e` | `oklch(0.25 0.1 2)`  |
| ![](tokens/swatches/consulting-burgundy.svg) | Burgundy | `base`   | `#880040` | `oklch(0.4 0.17 2)`  |
| ![](tokens/swatches/consulting-ruby.svg)     | Ruby     | `vivid`  | `#b5045a` | `oklch(0.5 0.2 2)`   |
| ![](tokens/swatches/consulting-ember.svg)    | Ember    | `bright` | `#fc5c95` | `oklch(0.7 0.2 2)`   |
| ![](tokens/swatches/consulting-linen.svg)    | Linen    | `paper`  | `#f5ecee` | `oklch(0.95 0.01 2)` |

### Token Naming

Each palette provides two ways to reference colors:

**By name** — the unique color name, e.g. `--software-lagoon`

**By role** — a semantic alias consistent across all palettes:

| Alias    | Lightness | Role                         |
| -------- | --------- | ---------------------------- |
| `night`  | 0.15      | Near-black, deepest tone     |
| `dark`   | 0.25      | Dark backgrounds, heavy text |
| `base`   | 0.40      | Primary brand color          |
| `vivid`  | 0.50      | Strongest chroma, accents    |
| `bright` | 0.70      | Lighter accent, highlights   |
| `paper`  | 0.95      | Near-white, backgrounds      |

```css
var(--consulting-burgundy)  /* by name */
var(--consulting-base)      /* by role — same color */
```

## Guidelines

### Do

- Use the logo without subline when context is clear
- Use the icon-only version for small or technical applications
- Respect optical alignment
- Use the wordmark color from the `dark` or `base` step of the respective palette
- Use the subline color as a darker accent from the same palette

### Don't

- Make the subline larger or more dominant than the wordmark
- Force the container background in all contexts
- Modify or "optimize" the logo further
- Explain or over-interpret the icon
- Desaturate the subline to the point where it matches the wordmark
