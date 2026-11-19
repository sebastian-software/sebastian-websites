import type { ReactElement } from "ardo/react"

import {
  alternate,
  ArrowLink,
  editorial,
  FerramentaLogo,
  KerameikosLogo,
  Story,
  StoryIllustration,
} from "@sebastian-websites/ui"

import type { FeaturedId, FeaturedProject } from "~/data/featured"

import ardoMark from "~/assets/brands/ardo-mark.svg"
import daloMark from "~/assets/brands/dalo-mark.svg"
import daloWordmark from "~/assets/brands/dalo-wordmark.svg"
import effectiveAgentMark from "~/assets/brands/effective-agent-mark.svg"

import * as styles from "./FeaturedStory.css.ts"

type Artwork = { readonly height: number; readonly src: string; readonly width: number }

/**
 * Each project's original mark at its display size, with its wordmark where it
 * has one; otherwise the name is set as text in the project's own style.
 */
const IDENTITIES: Readonly<
  Record<
    Exclude<FeaturedId, "ferramenta" | "palamedes">,
    { readonly mark: Artwork; readonly nameClassName?: string; readonly wordmark?: Artwork }
  >
> = {
  ardo: { mark: { height: 68, src: ardoMark, width: 68 }, nameClassName: styles.ardoName },
  dalo: {
    mark: { height: 62, src: daloMark, width: 71 },
    wordmark: { height: 44, src: daloWordmark, width: 172 },
  },
  "effective-agent": {
    mark: { height: 64, src: effectiveAgentMark, width: 64 },
    nameClassName: styles.textName,
  },
}

function Identity(props: { readonly project: FeaturedProject }): ReactElement {
  const { project } = props
  if (project.id === "ferramenta" || project.id === "palamedes") {
    return (
      <div className={editorial.storyIdentity}>
        <span className={styles.familyName}>
          {project.id === "ferramenta" ? <FerramentaLogo /> : <KerameikosLogo name="Palamedes" />}
        </span>
      </div>
    )
  }
  const { mark, nameClassName, wordmark } = IDENTITIES[project.id]
  return (
    <div className={editorial.storyIdentity}>
      <img
        alt=""
        className={styles.artwork}
        height={mark.height}
        src={mark.src}
        width={mark.width}
      />
      {wordmark === undefined ? (
        <span className={nameClassName}>{project.name}</span>
      ) : (
        <img
          alt={project.name}
          className={styles.artwork}
          height={wordmark.height}
          src={wordmark.src}
          width={wordmark.width}
        />
      )}
    </div>
  )
}

export type FeaturedStoryProps = {
  readonly index: number
  readonly project: FeaturedProject
}

/**
 * A featured project as an illustrated story in its own identity: original
 * mark and wordmark, a headline, what it does, and where to go next.
 *
 * @param props - The project and its editorial position.
 * @returns The project story.
 */
export function FeaturedStory(props: FeaturedStoryProps): ReactElement {
  const { index, project } = props
  const side = alternate(index)
  const headingId = `project-${project.id}`
  return (
    <Story
      aria-labelledby={headingId}
      media={<StoryIllustration {...project.illustration} />}
      mediaPosition={side}
    >
      <Identity project={project} />
      <h2 className={styles.title} id={headingId}>
        {project.title}
      </h2>
      <p className={styles.text}>{project.description}</p>
      <div className={styles.actions}>
        {project.actions.map((action) => (
          <ArrowLink
            className={styles.projectLink[project.id]}
            href={action.href}
            key={action.href}
            underline
          >
            {action.label}
          </ArrowLink>
        ))}
      </div>
    </Story>
  )
}
