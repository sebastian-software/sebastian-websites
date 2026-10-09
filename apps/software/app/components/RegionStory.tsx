import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { BunnyImage, editorial, editorialSizes } from "@sebastian-websites/ui"

import * as styles from "./RegionStory.css.ts"

/** The drawing's rendered desktop width in CSS pixels. */
const MAP_WIDTH = 720

/** The pastel map of the region from the shared asset zone (ADR-0014). */
const REGION = { height: 1024, path: "images/11-pastel-palette-r6.png", width: 1536 } as const

/**
 * Positions in percent of the complete drawing, beside the landmark each name
 * belongs to. Only the two cities are named; the drawing itself has no text.
 */
const PLACES = [
  { id: "mainz", x: 29, y: 37.5 },
  { id: "heidelberg", x: 50, y: 81.5 },
] as const

/**
 * The company and its region: Mainz and Heidelberg in Rhine-Main and
 * Rhine-Neckar, beside the year of founding and the three values.
 *
 * @returns The regional story.
 */
export function RegionStory(): ReactElement {
  const names = { heidelberg: "Heidelberg", mainz: "Mainz" }
  return (
    <section aria-labelledby="company-story" className={styles.region}>
      <figure className={styles.map}>
        <BunnyImage
          alt={t`A drawn map of the region with Mainz Cathedral at the top, a river through fields and vineyards, and Heidelberg Castle at the bottom.`}
          className={editorial.media}
          height={480}
          sizes={editorialSizes(MAP_WIDTH)}
          src={REGION}
          width={MAP_WIDTH}
        />
        {PLACES.map((place) => (
          <span
            aria-hidden="true"
            className={styles.place}
            key={place.id}
            style={{ left: `${place.x}%`, top: `${place.y}%` }}
          >
            {names[place.id]}
          </span>
        ))}
      </figure>
      <div className={styles.aside}>
        <h2 className={styles.since} id="company-story">
          {t`Independent since 2014.`}
        </h2>
        <p className={editorial.bodySerif}>
          {t`Based in Mainz and Heidelberg, rooted in the Rhine-Main and Rhine-Neckar regions. Two founders run the company themselves.`}
        </p>
        <hr className={styles.rule} />
        <p className={styles.values}>
          {t`Experience.`}
          <br />
          {t`Clarity.`}
          <br />
          {t`Enthusiasm.`}
        </p>
        <hr className={styles.rule} />
      </div>
    </section>
  )
}
