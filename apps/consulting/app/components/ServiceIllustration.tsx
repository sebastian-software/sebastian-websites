import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { BunnyImage, editorial, editorialSizes } from "@sebastian-websites/ui"

import architectureWorkshop from "./service-illustrations/architecture-workshop.png?bunny"
import internationalizationGlobe from "./service-illustrations/internationalization-globe.png?bunny"
import sharedWorkspace from "./service-illustrations/shared-workspace.png?bunny"

export type ServiceKind = "architecture" | "enablement" | "internationalization"

type Props = { readonly kind: ServiceKind }

/** The six-column placement is half of the design page, less half its gutter. */
const ART_WIDTH = 508
const ART_HEIGHT = 381

/**
 * Original watercolor artwork in the established product illustration style.
 *
 * @param props - The service whose illustration accompanies the copy.
 * @returns A responsive, transparent illustration delivered through the shared asset pipeline.
 */
export function ServiceIllustration(props: Props): ReactElement {
  const illustrations = {
    architecture: {
      alt: t`A watercolor architectural model, drawings, and drafting tools on a wooden table.`,
      src: architectureWorkshop,
    },
    enablement: {
      alt: t`A watercolor shared workspace with two chairs, a laptop, and an open notebook.`,
      src: sharedWorkspace,
    },
    internationalization: {
      alt: t`A watercolor desk globe beside an open book and a stack of books.`,
      src: internationalizationGlobe,
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
