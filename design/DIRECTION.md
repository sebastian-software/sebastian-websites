# Design direction, round 1

**Status:** three directions drafted on 2026-10-06 as static comps under `comps/`; the owners
choose or combine. Nothing here is built into the sites yet.

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

## Next

The owners pick a direction or name what to combine. Round 2 refines that direction on four
page types (Software home, product page, company page, Consulting home) and defines
`DESIGN.md` and the token package from it (plan 01, steps 3 to 5).
