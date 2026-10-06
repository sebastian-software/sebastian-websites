# Design direction, round 1

**Status:** round 1 (three directions) was reviewed on 2026-10-06; the owners chose
direction B, "Statement", with its pastel-teal background. Round 2 refines it on four page
types under `comps/r2-*.html`. Nothing here is built into the sites yet.

## What the owners asked for

- Very professional and business-oriented, in the manner of well-made SaaS sites.
- Lighter type weights; the heavy slab headings of the structural build were rejected.
- The founders' photos may be used freely (the 2024 shoot: colour, black-and-white, headshots).
- References named: VoidZero and Vite, Vercel, Stripe, Aura, Thinkmill, Set.Studio, plus the
  Evil Martians study of 100 developer-tool landing pages and a landing-page inspiration
  article.

## What the references have in common

Screenshots were taken on 2026-10-06 at 1440 px.

- **Type does the work.** Large, light or regular geometric sans with tight tracking, one
  idea per headline, a one-sentence subline, then two calls to action. Nobody uses a serif
  for display; Stripe and Vercel colour one word of the headline.
- **Proof comes right after the hero.** Logo rows (Vercel, Stripe, Vite's "Trusted by"),
  then numbers or curated quotes. The Evil Martians study confirms it: logos for B2B,
  metrics for individual users, curated testimonials rather than feeds, problem-oriented
  storytelling over feature lists, no "salesy BS", few animations.
- **Quiet structure instead of decoration.** Hairline grid frames (Aura), bordered sections
  (Vite), generous whitespace and centred max-width containers.
- **The mark as the hero object.** VoidZero's cube, Vite's isometric stack, Vercel's glowing
  triangle: the logo becomes an abstract illustration instead of stock imagery.
- **One accent colour on a neutral base.** Violet for the Void/Vite world, red for Thinkmill;
  light pages for business audiences, dark for developer tools.
- **Consultancies add warmth.** Thinkmill leads with "Design. Build. Ship." and a text-rich
  hero with inline links; Set.Studio with expressive type and framed work.

## The tension to resolve

The brand system says "not generic, not loud, not trend-driven", Terminaro lists the generic
SaaS startup as an anti-reference, and the owners now ask for SaaS-grade polish. The
resolution: take the discipline of the references (typography, whitespace, proof first, quiet
structure) and leave their clichés (neon gradients, glassmorphism, floating metric cards,
auto-pulled feeds). Polish is craft; the clichés are costume.

## What stays binding

Wordmark and icon, Sebastian Sans and Sebastian Slab from the font host, and the Software
palette: Space, Midnight, Teal, Lagoon, Signal, Frost on hue 218 (ADR-0008, plan 01).

## Proposed decisions

1. **Display type is Sebastian Sans Light (300) and Regular (400)** with tight tracking.
   Bold (600/700) appears only in buttons, labels, and small caps. The slab stays in the
   wordmark and may return for small accents later; it carries no headlines.
2. **Light base, Midnight for emphasis.** Pages are white or Frost; inverted Midnight or Space
   sections carry live numbers and the final call to action. No dark mode for now (Q29).
3. **Lagoon is the single accent**: one coloured word in the headline, links, status marks.
4. **Proof over adjectives, in this order:** client logos, live open-source numbers from the
   metrics service, curated testimonials from `packages/content`, the products.
5. **Photos are real and large.** The founders appear once per page at most, in colour or
   black-and-white depending on the direction, never as a cut-out stock figure.
6. **The brand bar stays a hairline strip** in Frost above the header, two groups, language
   switch right, visibly secondary to the site's own navigation.

## The three directions

All three use the same content and the same brand bar; only the design differs. The comps are
German because the owners read them; the photos are placeholders until the shoot is available
locally.

|           | A · Klar                                     | B · Statement                                         | C · Werkstatt                                                              |
| --------- | -------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------- |
| Lineage   | Vercel, Stripe, Aura                         | Thinkmill, Set.Studio                                 | VoidZero, Vite                                                             |
| Hero      | centred, one coloured word, pill, two CTAs   | left, three-line value statement, founder photo right | left, the icon as a large faint mark, meta row of products and families    |
| Structure | hairline grid frame, bordered card grids     | Frost background, rounded white panels, chess layout  | bordered "shelf" cards, full-bleed Midnight sections with monospace labels |
| Mood      | precise, corporate, quiet                    | warm, personal, confident                             | technical, workshop, developer-facing                                      |
| Risk      | can feel interchangeable with the references | the statement hero needs an excellent photo           | dark sections pull toward the developer world, away from business buyers   |

Files: `comps/a-klar.html`, `comps/b-statement.html`, `comps/c-werkstatt.html`, shared
foundation in `comps/shared.css`. Open any file in a browser; the fonts load from the host.

## Round 2: direction B refined

- **Chosen:** B "Statement". The value statement as a three-line hero, the pastel Frost
  background, white panels with large radii, the chess layout for the three themes.
- **Desktop first.** The owners decided on 2026-10-06 to design for desktop first: the
  audiences evaluate on large screens, and the designs should use that space well. Containers
  grow to 1480 px above 1700 px viewports. Phone layouts follow once the desktop design is
  settled and are a launch requirement, not optional.
- **Real photos** from the 2024 shoot, exported at 1800 px: the two founders at the concrete
  wall for the Software hero, at the laptop for the company theme, in front of the building
  for the company page, and in conversation for the Consulting hero. Portraits of individuals
  are not placed until the owners confirm who is who.
- **Two worlds, one system.** The Consulting comp applies the same components with the
  Consulting palette (hue 2, Linen background, Ruby accent) and the formal register.

Files: `comps/r2-software-home.html`, `r2-software-products.html`, `r2-software-company.html`,
`r2-consulting-home.html`.

## Round 3: richer, and the Consulting route motif

Feedback on round 2 (2026-10-06): the layout holds, everything may become richer, and the
photos may be cropped tightly. The owners also asked to build on the route animation of the
current Consulting site: many paths lead to the goal, with our help.

- **Software home, richer.** A faint icon mark and a soft glow behind the hero, a caption
  pill on the photo, a facts row under the calls to action, product tiles with glyphs and
  status pills, live numbers with sparklines and a short list of highlighted projects, a
  two-photo collage for the company theme, quote cards with initials, and a Midnight closing
  band with the building photo. Every photo is cropped to its subject with `object-position`.
- **Consulting, the route motif.** The hero carries a route map: several paths start at the
  left edge, two end as marked dead ends, three converge on a ringed goal that breathes and
  pings; a luminous dot travels each carrying path, and the main path draws in on load. The
  headline reads "Viele Wege führen zum Ziel. Wir kennen die, die tragen." The motif returns
  as the path of three steps under "Zusammenarbeit" and as the goal marker above the closing
  call to action. Two variants for the owners to choose from: the light Linen hero that stays
  within the one-light-design rule, and the "drenched" dark Ruby hero with a dark header that
  carries the mood of the current site into the new system; everything below the hero is
  identical.
- **Images.** The photos are served from one shared asset zone with Bunny Optimizer, so the
  public repository carries no photographs and every crop is a query string
  ([ADR-0014](../docs/adr/0014-images-from-shared-asset-zone.md), proposed).
- Still open: who is who on the individual portraits, so the Consulting profiles use the duo
  photo for now.

Files: `comps/r3-software-home.html`, `r3-consulting-home.html`, `r3-consulting-home-dark.html`.
The route map is plain SVG with CSS motion (`offset-path`, `stroke-dashoffset`); the
production version would honour `prefers-reduced-motion` and fall back to a static line as the
current site does.

## Round 4: fewer boxes, more words, the terrain stays

Feedback on round 3 (2026-10-06): the current Consulting hero with the terrain and the
particles running along the route is far better than the new route maps, because it is more
abstract and brings real movement; build on it. The richer Software home is going in the right
direction and the crops are better, but photos must not overlap and cut each other, the hero
photo shows too much wall and too little face, the page repeats one shape (boxes, boxes inside
boxes), sparklines are a gimmick, and the whole site is too short on words: explain what we do,
what it brings, and what drives us, informed by the recommendations clients have written.

- **Hairlines instead of boxes.** Sections are separated by rules, not surfaces: a section
  head with eyebrow and headline on the left and an introductory paragraph on the right, then
  three text columns, hairline rows for products and results, big numbers on a ruled band.
  The only remaining surfaces are the logo strip and the Midnight closing band.
- **Photos cropped to the subject.** The hero is a square cropped to the founders' faces; the
  company theme shows one photo, not a collage; the individual portraits now carry names:
  the owners confirmed on 2026-10-06 that the shoot's frames 4, 6, 7, 17, 18, 22, 23, 31, 36,
  42, 43 show Sebastian Fastner and frames 3, 8, 12, 15, 16, 20, 21, 24, 25, 32, 33, 37, 40,
  44, 45 show Sebastian Werner.
- **No sparklines.** Live numbers stand as numbers with a source line.
- **Twice the words.** Every section now explains: what the stance is and why, what each
  product is for and where it came from, why the open-source families exist, how the founders
  work and how clients describe the collaboration. The description of the collaboration is
  a synthesis of the recommendations (broad and current knowledge, reasoned and traceable
  recommendations, a view of the whole system, honest communication, teams left stronger),
  not a quote. Product copy is a draft the owners must verify; nothing in it is published
  fact yet.
- **Consulting keeps the terrain.** The hero is the current site's: the tinted relief, the
  route drawn in on load, the luminous flow and the travelling pulse, the breathing summit.
  The comp reproduces the static SVG fallback of the current implementation and loads the
  relief from the live site; the production build takes the component and the WebGL flow
  field over from the Consulting repository. The rights to the relief image are recorded as
  unknown in that repository's inventory and must be confirmed before it enters this public
  repository. Below the hero the page follows the hairline system and carries the current
  site's copy, extended: approach in three steps, six fields of work, three results, the two
  architects, three quotes, the closing call.

Files: `comps/r4-software-home.html`, `comps/r4-consulting-home.html`.

## Round 5: rhythm, spacing, alignment

Feedback on round 4 (2026-10-06): the pendulum swung too far. Boxes are fine where they fit;
what the owners want is variety, with each design element matching its content, generous
spacing so sections keep their context, and clean alignment wherever text is meant to line
up.

- **Each content type gets its own form.** Prose themes stand as three open text columns with
  numerals; products and services, which are objects, sit in cards; live numbers sit on a
  Midnight band; results and recurring work are ruled list rows; people are portrait rows;
  quotes are open columns with a slab quotation mark. Sections alternate Frost and white.
- **One spacing scale** on an 8 px base: 24, 40, 64, 96, 128. Sections are 128 px tall at the
  top and bottom, section heads sit 72 px above their content, columns are 64 px apart,
  list rows have 36 px of padding.
- **One alignment rule.** Whatever shares a row shares font size and line height, so first
  lines meet: the section head puts the eyebrow above both columns and offsets the intro by
  10 px to the headline's cap height; list rows set one size for title and text; big numbers
  align at the top; ghost links lose the stray inline padding that had indented them in every
  earlier round; links under columns of unequal length are pushed to a common bottom edge.
- Each section was rendered and checked on its own before the pages were sent.

Files: `comps/r5-software-home.html`, `comps/r5-consulting-home.html` (the terrain hero from
round 4 unchanged).

## Next

The owners review round 5. Then `DESIGN.md` and the token package are written from the
approved comps, and the Software app is rebuilt on the new system, desktop first (plan 01,
steps 3 to 5; plan 06). Phone layouts follow once the desktop design is settled.
