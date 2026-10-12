import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { BunnyImage, editorial, editorialSizes } from "@sebastian-websites/ui"

import componentGrid from "./service-illustrations/component-grid.png?bunny"
import handsOnEngineering from "./service-illustrations/hands-on-engineering.png?bunny"
import terminologyCatalog from "./service-illustrations/terminology-catalog.png?bunny"

export type ServiceKind = "architecture" | "enablement" | "internationalization"

type Props = { readonly kind: ServiceKind }

/** The six-column placement is half of the design page, less half its gutter. */
const ART_WIDTH = 508
const ART_HEIGHT = 381

/**
 * Technical editorial artwork for the three Consulting service areas.
 *
 * @param props - The service whose illustration accompanies the copy.
 * @returns A responsive illustration delivered through the shared asset pipeline.
 */
export function ServiceIllustration(props: Props): ReactElement {
  const illustrations = {
    architecture: {
      alt: t`Six modules arranged in a regular grid and linked by a shared interface.`,
      src: componentGrid,
    },
    enablement: {
      alt: t`A code symbol, a stylus, and a specification panel.`,
      src: handsOnEngineering,
    },
    internationalization: {
      alt: t`A structured terminology catalog with cards in different writing systems.`,
      src: terminologyCatalog,
    },
  }
  const illustration = illustrations[props.kind]
  return (
    <BunnyImage
      alt={illustration.alt}
      className={editorial.media}
      height={ART_HEIGHT}
      sizes={editorialSizes(ART_WIDTH)}
      src={illustration.src}
      width={ART_WIDTH}
    />
  )
}
