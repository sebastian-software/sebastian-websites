import type { ReactElement } from "ardo/react"

import { t } from "@palamedes/core/macro"
import { blocks, BunnyImage, button, scaledSizes } from "@sebastian-websites/ui"

import type { FounderId } from "~/lib/founderNames"

import { getFounders } from "~/lib/founders"
import { fastnerPhoto, type PhotoPlacement, wernerPhoto } from "~/lib/photos"

const PHOTOS: Readonly<Record<FounderId, PhotoPlacement>> = {
  fastner: fastnerPhoto,
  werner: wernerPhoto,
}

export type FoundersProps = {
  /** Links to the Consulting profiles, when the page offers them. */
  readonly profileOrigin?: string
}

/**
 * The two founders as portrait rows: name, role, and a line on their work.
 *
 * @param props - The Consulting origin for profile links, if any.
 * @returns The two rows.
 */
export function Founders(props: FoundersProps): ReactElement {
  const { profileOrigin } = props
  const founders = getFounders()
  return (
    <div className={blocks.persons}>
      {founders.map((founder) => (
        <div className={blocks.person} key={founder.id}>
          <span className={blocks.face}>
            <BunnyImage
              alt={founder.name}
              className={blocks.photoImage}
              loading="lazy"
              {...PHOTOS[founder.id]}
              sizes={scaledSizes("72px")}
            />
          </span>
          <div>
            <b className={blocks.personName}>{founder.name}</b>
            <span className={blocks.personRole}>{founder.role}</span>
            <p className={blocks.personText}>{founder.text}</p>
            {profileOrigin === undefined ? null : (
              <a
                className={`${button.ghost} ${blocks.columnLink}`}
                href={`${profileOrigin}/${founder.id}`}
              >
                {t`Profile and project list →`}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
