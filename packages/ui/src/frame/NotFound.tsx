import type { SiteFrame } from "@sebastian-websites/web-core"
import type { ReactElement } from "react"

import type { FrameCopy } from "./copy.ts"

import { Arrow } from "../editorial/Arrow.tsx"
import * as styles from "./NotFound.css.ts"

export type NotFoundProps = {
  readonly copy: FrameCopy
  readonly frame: SiteFrame
}

/** Marks the not-found route, so the layout leaves out canonical and language links to it. */
export const NOT_FOUND_HANDLE = { notFound: true } as const

/**
 * Tells whether a matched route is the not-found page.
 *
 * @param handle - A route match's handle.
 * @returns Whether the route renders the not-found page.
 */
export function isNotFoundHandle(handle: unknown): boolean {
  return typeof handle === "object" && handle !== null && "notFound" in handle
}

/**
 * The page for unknown addresses: a short explanation and the ways back, the
 * home page first and then the site index. The frame around it stays intact,
 * so the header and page ending lead on as well.
 *
 * @param props - The resolved frame of the site's home page and the labels.
 * @returns The page's main content.
 */
export function NotFound(props: NotFoundProps): ReactElement {
  const { copy, frame } = props
  const destinations = [
    { href: frame.home, id: "home", label: copy.notFound.home },
    ...frame.index.map((link) => ({ href: link.href, id: link.id, label: copy.links[link.id] })),
  ]
  return (
    <main className={styles.main} data-not-found="" id="main">
      <p className={styles.eyebrow}>{copy.notFound.eyebrow}</p>
      <h1 className={styles.title}>{copy.notFound.title}</h1>
      <p className={styles.text}>{copy.notFound.text}</p>
      <ul className={styles.links}>
        {destinations.map((destination) => (
          <li key={destination.id}>
            <a className={styles.link} href={destination.href}>
              {destination.label}
              <Arrow
                className={styles.arrow}
                direction={destination.href.startsWith("https://") ? "outward" : "forward"}
              />
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
