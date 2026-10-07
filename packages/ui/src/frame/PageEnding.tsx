import type { SiteFrame } from "@sebastian-websites/web-core"
import type { ReactElement } from "react"

import type { FrameCopy } from "./copy.ts"
import type { SubscribeAction } from "./subscribe.ts"

import { page } from "../editorial/editorial.css.ts"
import { Newsletter } from "./Newsletter.tsx"
import { SiblingInvitation } from "./SiblingInvitation.tsx"
import { SiteFooter } from "./SiteFooter.tsx"

export type PageEndingProps = {
  readonly copy: FrameCopy
  readonly frame: SiteFrame
  readonly subscribe?: SubscribeAction
}

/**
 * Every page ends the same way: the shared newsletter, the editorial invitation
 * to the other brand, and the current site's own footer, in that order.
 *
 * @param props - The resolved frame, the translated labels, and the subscribe action.
 * @returns The three ending areas.
 */
export function PageEnding(props: PageEndingProps): ReactElement {
  const { copy, frame, subscribe } = props
  return (
    <>
      <div className={page}>
        <Newsletter copy={copy.newsletter} subscribe={subscribe} />
        <SiblingInvitation
          brand={frame.outbound.brand}
          copy={copy.invitation[frame.outbound.brand]}
          href={frame.outbound.href}
        />
      </div>
      <SiteFooter copy={copy} frame={frame} />
    </>
  )
}
