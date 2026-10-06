import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { blocks, button } from "@sebastian-websites/ui"

import werner from "~/assets/photos/shoot-3.jpg"
import fastner from "~/assets/photos/shoot-4.jpg"

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
      name: "Sebastian Werner",
      role: t`Founder · Frontend architecture and developer experience`,
      src: werner,
      text: t`React, TypeScript, internationalization, and code quality. In web development since 2000, formerly architect of the qooxdoo framework at 1&1.`,
    },
    {
      id: "fastner",
      name: "Sebastian Fastner",
      role: t`Founder · Full stack and platform`,
      src: fastner,
      text: t`TypeScript, React, Rust, and infrastructure, from the surface to the backend. In professional software development since 2002.`,
    },
  ]
  return (
    <div className={blocks.persons}>
      {founders.map((founder) => (
        <div className={blocks.person} key={founder.id}>
          <span className={blocks.face}>
            <img
              alt={founder.name}
              className={blocks.photoImage}
              loading="lazy"
              src={founder.src}
              style={{ objectPosition: "center 22%" }}
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
