import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import {
  alternate,
  ArrowLink,
  BunnyImage,
  editorial,
  editorialSizes,
  Story,
} from "@sebastian-websites/ui"

import type { FeaturedId, FeaturedProject } from "~/data/featured"

import ardoMark from "~/assets/brands/ardo-mark.svg"
import daloMark from "~/assets/brands/dalo-mark.svg"
import daloWordmark from "~/assets/brands/dalo-wordmark.svg"
import ferramentaMark from "~/assets/brands/ferramenta-mark.svg"
import ferramentaWordmark from "~/assets/brands/ferramenta-wordmark.svg"
import palamedesMark from "~/assets/brands/palamedes-mark.svg"
import palamedesWordmark from "~/assets/brands/palamedes-wordmark.svg"

import * as styles from "./FeaturedStory.css.ts"

type Artwork = { readonly height: number; readonly src: string; readonly width: number }

/** Each project's original mark and wordmark at its display size. */
const IDENTITIES: Readonly<
  Record<FeaturedId, { readonly mark: Artwork; readonly wordmark?: Artwork }>
> = {
  ardo: { mark: { height: 68, src: ardoMark, width: 68 } },
  dalo: {
    mark: { height: 62, src: daloMark, width: 71 },
    wordmark: { height: 44, src: daloWordmark, width: 172 },
  },
  ferramenta: {
    mark: { height: 60, src: ferramentaMark, width: 60 },
    wordmark: { height: 40, src: ferramentaWordmark, width: 272 },
  },
  palamedes: {
    mark: { height: 92, src: palamedesMark, width: 92 },
    wordmark: { height: 38, src: palamedesWordmark, width: 319 },
  },
}

function Identity(props: {
  readonly project: FeaturedProject
  readonly side: "end" | "start"
}): ReactElement {
  const { project, side } = props
  const { mark, wordmark } = IDENTITIES[project.id]
  return (
    <div className={styles.identity[side]}>
      <img
        alt=""
        className={styles.artwork}
        height={mark.height}
        src={mark.src}
        width={mark.width}
      />
      {wordmark === undefined ? (
        <span className={styles.ardoName}>{project.name}</span>
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

const MEDIA = {
  end: { height: 480, width: 640 },
  start: { height: 420, width: 560 },
} as const

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
  const media = MEDIA[side]
  const headingId = `project-${project.id}`
  return (
    <Story
      aria-labelledby={headingId}
      media={
        <BunnyImage
          alt={project.illustration.alt}
          className={editorial.media}
          height={media.height}
          priority={index === 0}
          sizes={editorialSizes(media.width)}
          src={project.illustration.src}
          width={media.width}
        />
      }
      mediaPosition={side}
    >
      <p className={styles.eyebrow}>{t`Open source project`}</p>
      <Identity project={project} side={side} />
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
