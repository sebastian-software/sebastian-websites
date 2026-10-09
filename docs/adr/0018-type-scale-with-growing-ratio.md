---
status: accepted
updated: 2026-10-10
---

# Font sizes come from a type scale whose ratio grows with the step

Every font size is a step of one type scale instead of a size chosen per
component. Step 0 is body text, which is the root
([ADR-0016](0016-fluid-root-font-size.md)); negative steps serve captions and
labels, positive steps leads and headings.

A constant ratio shrinks small sizes too fast and separates display sizes too
little. The ratio therefore grows by a constant factor from step to step, an
ease-in along the scale:

```
ratio from step n to n + 1:  q(n) = r · gⁿ
size of step n:              s(n) = body · rⁿ · g^(n·(n−1)/2)
```

`r` is the ratio at body text, `g` how much it grows per step; `g = 1` is the
classic modular scale. Steps below body text get a smaller ratio, so labels stay
readable; display steps get a larger one. Fitted against the existing designs,
`g` is 1.015 and `r` is 1.125 on phones (400 px) and 1.2 on desktop (from
960 px), interpolated along the layout width in between. The scale reproduces
both designs within one or two pixels; sizes are not rounded.

Components assign a step by role and by the room they have. A heading takes the
largest step at which it needs at most three lines in its column on a laptop;
headings in narrow columns take a smaller step than the same role at full width.

## Considered options

- **Sizes per component, scaled with the root.** Rejected: sizes drifted apart,
  and phone and compact overrides multiplied.
- **A constant ratio.** Rejected: too small at the bottom and too flat at the top.
- **Capping headings by their column width (`100cqi / n`).** Rejected: wide
  columns kept their design size and narrow ones got arbitrary sizes in between.

## Consequences

- On the sites, font sizes are set with `typeStep("3")` only; the editorial
  roles and the first Software design's sizes map to steps. The consultant
  profile sheets keep their own print sizes. Elena body text keeps a fixed
  optical correction of 1.1 against Glober at the same step.
- Running text uses `text-wrap: pretty` to avoid single words on a last line.
