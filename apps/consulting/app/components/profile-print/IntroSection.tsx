import type { ReactNode } from "react"

import { BunnyImage } from "@sebastian-websites/ui"

import { SHEET_PHOTO } from "~/lib/photos"

import type { Consultant } from "./types"

import * as styles from "../ProfilePrintV2.css"

export function IntroSection({ consultant }: { consultant: Consultant }): ReactNode {
  return (
    <section className={styles.introSection}>
      {consultant.photo === undefined ? (
        <div className={styles.photoFrame} />
      ) : (
        <div className={styles.photoFrame}>
          <BunnyImage
            alt={consultant.name}
            className={styles.photoFrameImg}
            crop={consultant.photo.crop}
            height={SHEET_PHOTO.height}
            priority
            sizes="171px"
            src={consultant.photo.src}
            width={SHEET_PHOTO.width}
            widths={[SHEET_PHOTO.width]}
          />
        </div>
      )}
      <div className={styles.nameBlock}>
        <h1 className={styles.name}>{consultant.name}</h1>
        {consultant.degree === undefined ? null : (
          <span className={styles.nameDegree}>{consultant.degree}</span>
        )}
      </div>
      <div className={styles.bioText}>
        {consultant.bio.map((paragraph) => (
          <p className={styles.paragraph} key={paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  )
}
