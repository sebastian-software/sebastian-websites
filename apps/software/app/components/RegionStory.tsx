import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { BunnyImage, editorial, editorialSizes } from "@sebastian-websites/ui"

import region from "~/assets/illustrations/mainz-heidelberg-region.png?bunny"

import * as styles from "./RegionStory.css.ts"

/** The drawing's rendered desktop width in CSS pixels. */
const MAP_WIDTH = 720

/** Positions in percent of the drawing, beside the landmark each name belongs to. */
const PLACES = [
  { id: "mainz", x: 49, y: 10 },
  { id: "rhine-main", x: 84, y: 27 },
  { id: "rhine-neckar", x: 22, y: 72 },
  { id: "heidelberg", x: 86, y: 88 },
] as const

/**
 * The company and its region: Mainz and Heidelberg in Rhine-Main and
 * Rhine-Neckar, beside the year of founding and the three values.
 *
 * @returns The regional story.
 */
export function RegionStory(): ReactElement {
  const names = {
    heidelberg: "Heidelberg",
    mainz: "Mainz",
    "rhine-main": t`Rhine-Main`,
    "rhine-neckar": t`Rhine-Neckar`,
  }
  return (
    <section aria-labelledby="company-story" className={styles.region}>
      <figure className={styles.map}>
        <BunnyImage
          alt={t`A drawn landscape with the cathedral of Mainz above and Heidelberg castle with its old bridge below.`}
          className={editorial.media}
          height={480}
          sizes={editorialSizes(MAP_WIDTH)}
          src={region}
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
