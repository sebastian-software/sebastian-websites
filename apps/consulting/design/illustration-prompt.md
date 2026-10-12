# Consulting illustration prompt

Use this base prompt to create more illustrations in the technical editorial
direction used on the Consulting services page. Pair it with the
[component grid](../app/components/service-illustrations/component-grid.png) as
a material, color, and lighting reference.

## Create a new motif

1. Choose the service or page passage the image should support.
2. Attach the component-grid PNG as the style reference.
3. Replace `{SERVICE_CONTENT}`, `{SUBJECT}`, and `{REQUIRED_TEXT_OR_NONE}` in
   the prompt below. Describe a distinct subject that makes the content
   recognizable, with a clear arrangement and purposeful relationships.
4. Generate one landscape image with the built-in Image Gen tool. Review its
   subject, spacing, materials, background, and any requested glyphs alongside
   the existing illustrations.

Keep the material language consistent across subjects. Use documents,
typography, tools, or interfaces when they explain the topic. The module grid is
the architecture motif; other topics need their own visual idea.

## Copyable base prompt

```text
Use case: stylized-concept.
Asset type: one editorial service illustration for Sebastian Consulting, landscape 4:3.

Service content: {SERVICE_CONTENT}

Input image: Image 1 is a material, color, lighting, and rendering-quality reference only. Preserve its graphite, off-white, brushed aluminum, smoked glass, warm near-white backdrop, restrained burgundy accent, and precise composition. Create the subject below without copying the reference's component-grid geometry.

Scene/backdrop: seamless almost-white warm-neutral studio background, approximately #f9f8f6, with no horizon line. Soft neutral contact shadows. No large pink, peach, or beige field and no colored light spill.

Subject: {SUBJECT}

Style: sophisticated, restrained photorealistic industrial-design editorial image. One meaningful, coherent composition that supports the specific service content. Recognizable subject, consistent proportions, precise alignment, purposeful relationships, and generous negative space. Fine matte surface texture and subtle crisp chamfers.

Materials/colors: graphite gray, warm off-white, satin brushed aluminum, and limited translucent smoke-gray glass. Burgundy appears only in one or two small accents, less than three percent of the composition. Off-white paper is allowed for document subjects.

Composition: elevated three-quarter, near-orthographic studio view. Keep the whole subject visible at approximately 65 to 70 percent of the frame width, with breathing room on every side. Use a clear hierarchy and deliberate ordering. Let the subject determine its structure.

Lighting: soft directional studio illumination from upper left, delicate neutral shadows, controlled reflections.

Text: {REQUIRED_TEXT_OR_NONE}. Render only the explicitly requested characters or symbols. No invented UI prose or gibberish code.

Avoid: plants, flowers, landscapes, watercolor, ink outlines, wood, cozy rooms, coffee cups, fake team portraits, human faces, generic buildings, random block piles, arbitrary sculptural arrangements, server hardware, circuit boards, sci-fi, neon, logos, watermarks, and ornamental clutter.
```

## Subject examples

| Service content                      | Subject                                                                                                        | Required text  |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------- | -------------- |
| Software architecture                | Six equal modules in a two-by-three grid on one graphite platform, joined by a shared satin-metal spine.       | None           |
| Internationalization and terminology | An ordered catalog of off-white index cards, separated by smoked glass and marked with one small burgundy tab. | `A`, `文`, `ع` |
| Hands-on engineering                 | An off-white code panel, a satin-metal code symbol, one precision stylus, and an aligned specification sheet.  | `</>`          |

Adapt the subject to the actual content. These are editorial metaphors, not
project screenshots or technical diagrams. Inspect generated characters before
using a typography-led image.

## Save and integrate the result

Keep the generated original unchanged and record its actual dimensions. Store
the selected raster beside its consuming component and retain the final prompt
and reference relationship. Use `?bunny` imports and `BunnyImage` following the
[responsive images guide](../../../docs/operations/responsive-images.md).

The [illustration README](../app/components/service-illustrations/README.md)
lists the current assets.
[Their exact prompts](../app/components/service-illustrations/prompts.json)
record the original requests; this document is the reusable template for future
subjects.
