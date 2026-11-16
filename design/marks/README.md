# Product marks

The marks of our products with ancient-Greek names share one frame: a motif in a bronze ring.
This is the rule for that frame, so that a new mark sits beside the existing ones without
adjustment. It covers the frame and the placement of the motif, not what the motif shows.

- [`ring-template.svg`](ring-template.svg) shows the frame with its guides.
- [`ring-blank.svg`](ring-blank.svg) is the empty frame to draw a motif into.

## The frame

Everything is measured on a 240-unit square with its center at 120/120. One number sets the
rest: the ring width **W = 10**.

| Part       | Measure                                 | Rule                                                      |
| ---------- | --------------------------------------- | --------------------------------------------------------- |
| Gold ring  | center line radius 112, width W         | bronze `#BC8A45`; drawn last, on top of everything        |
| Paper ring | radius 97 to 107, width W               | stays empty; navy never touches gold                      |
| Window     | radius 97                               | the motif lives inside it                                 |
| Top limit  | y = 38, which is 1.5 W below the window | the motif's highest point                                 |
| Side limit | radius 92, which is W/2 inside          | parts of the motif that are not its base stay inside this |
| Base zone  | below y = 170                           | here the motif may run to the window's edge and is cut    |

## Placing a motif

1. **Stand it on its base.** A bust, a ground, a coastline: the base runs past the window's
   lower edge and is cut on it, as a figure stands on the ground line of an ancient coin.
2. **Size it from the base upward** until its highest point reaches the top limit.
3. **Keep the rest free.** Head, flame, tower, or whatever the motif is about touches nothing
   and stays inside the side limit.
4. **Cut or clear, never almost.** A part either runs past the window and is cut, or keeps
   its distance. A part that nearly touches the window's edge is moved or redrawn.

## Drawing

- Navy `#0E2A4D` carries the mass. Paper `#FAF9F4` appears as lines cut out of it, never as
  an outline drawn around it.
- Bronze marks the one element the motif is about, such as a laurel or a flame, and nothing
  else inside the window.
- Flat shapes only: no gradients, shading, or texture.
- Cut-out lines are at least 2.5 units wide, so they stay open at 32 pixels.
- One main motif and at most one supporting plane such as ground or water.

## Versions

- **On paper:** as drawn.
- **On dark:** a paper disc of radius 117 lies under the mark; the motif is not inverted.
- **One color:** ring and motif in the same color; the paper ring keeps them apart.

## Where the rule comes from

It was worked out in November 2026 on the Palamedes head and the Tereon beacon. With the motif
standing on the window and its top 1.5 W below the window's edge, both marks carry about the
same weight at the same size. Tereon's mark follows the rule. The published Palamedes mark
predates it: its bust ends freely inside the ring. Bringing it in line is a separate decision.
