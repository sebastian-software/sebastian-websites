import type { ReactNode } from "react"

import type { Experience } from "./experienceLogos"

import * as styles from "./wernerProfile.css"

export function ExperienceHighlight({
  children,
  experience,
  title,
}: {
  children: ReactNode
  experience: Experience
  title: ReactNode
}): ReactNode {
  return (
    <section className={styles.experience} data-experience-highlight={experience.id}>
      <header className={styles.experienceHeader}>
        <div aria-hidden="true" className={styles.experienceLogos}>
          {experience.logos.map((logo) => (
            <img
              alt=""
              className={styles.experienceLogo}
              height={logo.height}
              key={logo.name}
              src={logo.source}
              width={logo.width}
            />
          ))}
        </div>
        <h3 className={styles.experienceTitle}>{title}</h3>
      </header>
      <p>{children}</p>
    </section>
  )
}
