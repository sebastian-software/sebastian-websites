import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { blocks, BunnyImage, button } from "@sebastian-websites/ui"

import { fastnerPhoto, wernerPhoto } from "~/lib/photos"

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
  const founders = [
    {
      id: "werner",
      image: wernerPhoto,
      name: "Sebastian Werner",
      role: t`Founder · Frontend architecture and developer experience`,
      text: t`React, TypeScript, internationalization, and code quality. In web development since 2000, formerly architect of the qooxdoo framework at 1&1.`,
    },
    {
      id: "fastner",
      image: fastnerPhoto,
      name: "Sebastian Fastner",
      role: t`Founder · Full stack and platform`,
      text: t`TypeScript, React, Rust, and infrastructure, from the surface to the backend. In professional software development since 2002.`,
    },
  ]
  return (
    <div className={blocks.persons}>
      {founders.map((founder) => (
        <div className={blocks.person} key={founder.id}>
          <span className={blocks.face}>
            <BunnyImage
              alt={founder.name}
              className={blocks.photoImage}
              loading="lazy"
              {...founder.image}
              sizes="72px"
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
