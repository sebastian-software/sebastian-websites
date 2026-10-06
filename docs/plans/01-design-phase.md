# Design the brand bar and the four home pages together

## Status

- Priority: P1
- Effort: L
- Risk: MEDIUM (taste decisions; the brand bar must work on four sites at once)
- Depends on: none
- State: done for the direction and the Software site on 2026-10-06; Consulting home comp
  approved, Open Source and Skills follow their plans
- Planned at: f007192, 2026-10-06
- Working state: clean

## Why this matters

The concept asks for one visual system across four sites with different audiences. Designing
them one after another would let the first site dictate the system. Drafting the brand bar and
all four home pages together is how the shared shell gets designed for four sites, which is why
[ADR-0008](../adr/0008-technical-baseline-and-workspace.md) shares the shell from the start.

## Current state

- The brand system is binding: wordmark and icon, Sebastian Sans and Sebastian Slab, one hue
  per brand in six lightness steps (`sebastian-brand/README.md`, `sebastian-brand/tokens/*.css`).
- The Consulting site's current look (`sebastian-consulting.de/apps/consulting/app`) is the
  latest variant and not binding. The old Software and Open Source sites carry little weight.
- Values, audiences, and tone: [positioning.md](../concept/positioning.md).
- One light design for all sites, possibly with inverted accent sections; no dark mode.
- Open Source and Skills use the Software logo with the area named in text next to it.
- Icons come from Streamline (Pro licence available); the style is not chosen yet.
- The brand bar shows two groups of equal weight (Software · Open Source · Skills and
  Consulting · Services · Profiles), holds the language switch, and collapses into one
  "Sebastian" menu on narrow screens. On the Consulting site it duplicates two main-navigation
  entries and must therefore read as visibly secondary.

## Scope

In scope:

- A short written design direction: layout principles, type scale, spacing, colour use per
  world, imagery, motion.
- Drafts (static HTML or image comps) for: the brand bar in all four site contexts and in its
  collapsed form; the four home pages in English; one inner page type per site (a product
  page, a profile, a project card grid, a skill page).
- The Streamline icon style, chosen against the drafts.
- How the Software hue is nuanced for Open Source and Skills, if at all.

Out of scope:

- Writing final copy; drafts use working copy from the positioning basis.
- Component implementation; that is plan 02.

## Verification commands

There is no code yet. Verification is review against the checklist in Done criteria.

## Steps

### 1. Record the design direction

Write `design/DIRECTION.md`: the principles above, the role of each brand hue, how inverted
accent sections are used, and what the drafts must prove. Keep it to one page.

### 2. Draft the brand bar

Produce the bar for each site context, marked current, at desktop and phone width, with the
language switch. Show the Consulting site with its main navigation beneath, so the duplication
of Services and Profiles is visible and resolved.

### 3. Draft the four home pages

One pass per site, in this order: Software, Consulting, Open Source, Skills. Each draft shows
the bar, the site's main navigation, its primary call to action, and, for Open Source and
Skills, the Consulting section near the end of the page.

### 4. Draft one inner page type per site

Product page (Software), profile (Consulting, screen view only; the print layout is reused from
the old site), project card grid with a family block (Open Source), skill page (Skills).

### 5. Choose the icon style and review

Pick the Streamline style on the drafts. Review all drafts against Done criteria with both
owners; iterate until approved. Commit the approved drafts under `design/comps/`.

## Done criteria

- [x] Both owners approve the drafts: round 5 on 2026-10-06 (`design/DIRECTION.md`).
- [ ] The bar reads as one family across all four contexts and as secondary to each main
      navigation.
- [ ] Software and Consulting read as equal in weight; Open Source and Skills read as part of
      Software.
- [x] The drafts use only the binding brand system plus documented extensions
      (`design/DESIGN.md`).
- [ ] Every draft works at phone width (deferred: desktop first; grids collapse to one
      column below 900 px as a safety net).
- [x] The direction and drafts are committed; the icon style is still open.

## Stop conditions

- Stop if the drafts need a change to the binding brand system (a new typeface, a changed
  logo); that is a separate decision with the owners.
- Stop if the two-group bar cannot be made to read cleanly at phone width without dropping
  entries; return to the owners with the alternatives.

## Maintenance and review focus

The drafts become the reference for plan 02. Reviewers should watch for a system that only
works for the site it was drafted on first, and for accent sections that drift into a second,
dark theme.

### Existing brand reference page findings

The 2026-10-06 font-host integration changed the stylesheet link and body font family in
`apps/brand/index.html`. The sizes below are unchanged from the committed reference page.
They remain open for the design phase; no detector ignores were added.

- `Name`, `Token`, `Alias`, and `OKLCH` table headers inherit `0.625rem` (10px at the default
  root size) from `.color-table th`. Each falls below the detector's 11px functional-text
  floor. Raise the shared header size when refining the reference page.
- The hierarchy detector compares 11px `h2`/`h3` with 13px content text and reports a largest
  step of 1.18. Review this against the reference page's visual asset hierarchy before
  deciding whether section labels need a stronger size step.
