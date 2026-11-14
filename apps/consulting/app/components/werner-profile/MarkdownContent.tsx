import type { ComponentType, ReactNode } from "ardo/react"
import type { ArdoMDXComponents } from "ardo/ui"

import { t } from "@palamedes/core/macro"
import { createContext, createElement, use } from "ardo/react"

import showcases from "~/data/werner.showcases.json"

import { ExperienceHighlight } from "./ExperienceHighlight"
import { getExperience } from "./experienceLogos"
import * as styles from "./wernerProfile.css"

export type ProfileMarkdown = ComponentType<{ components?: ArdoMDXComponents }>
type ContentProps = { children: ReactNode }

const ProfileTitleContext = createContext<string | undefined>(undefined)

const showcaseUrls = new Set(
  showcases.showcases.flatMap((entry) => (entry.url === undefined ? [] : [entry.url]))
)

/**
 * Keep public profile links within the same allowed protocols as the authored copy.
 * @param props - The compiled link and its text.
 * @param props.children - The compiled label.
 * @param props.href - The authored destination.
 * @returns The public link, including its curated showcase marker.
 */
export function ProfileLink({ children, href }: { children?: ReactNode; href: string }): ReactNode {
  if (!href.startsWith("https://") && !href.startsWith("mailto:"))
    throw new Error("Unsupported profile link protocol.")
  return (
    <a href={href}>
      {showcaseUrls.has(href) ? (
        <>
          <svg aria-label={t`Showcase`} height="12" role="img" viewBox="0 0 24 24" width="12">
            <path
              d="m12 2 3.1 6.3 7 .9-5 4.9 1.2 6.9-6.3-3.3-6.3 3.3 1.2-6.9-5-4.9 7-.9Z"
              fill="currentColor"
            />
          </svg>{" "}
        </>
      ) : null}
      {children}
    </a>
  )
}

function ProfileProse({ children }: ContentProps): ReactNode {
  return <div className={styles.prose}>{children}</div>
}

function ProfileProject({ children }: ContentProps): ReactNode {
  return (
    <section className={styles.project} data-profile-project="">
      {children}
    </section>
  )
}

function ProfileExperience({
  children,
  id,
  title,
}: { id: string; title: string } & ContentProps): ReactNode {
  return (
    <ExperienceHighlight experience={getExperience(id)} title={title}>
      {children}
    </ExperienceHighlight>
  )
}

function ProfileTable({ children }: ContentProps): ReactNode {
  return (
    <div className={styles.tableWrapper}>
      <table>{children}</table>
    </div>
  )
}

function ProfileName({ children }: ContentProps): ReactNode {
  const title = use(ProfileTitleContext)
  return title === undefined ? <h1>{children}</h1> : <h2>{title}</h2>
}

const components: ArdoMDXComponents = {
  a: ProfileLink,
  Experience: ProfileExperience,
  h1: ProfileName,
  h2: ({ children }: ContentProps) => <h2>{children}</h2>,
  h3: ({ children }: ContentProps) => <h3>{children}</h3>,
  Project: ProfileProject,
  table: ProfileTable,
  th: ({ children }: ContentProps) => <th scope="col">{children}</th>,
  wrapper: ProfileProse,
}

/**
 * Render profile prose compiled by Ardo's ordinary Ferromark MDX pipeline.
 * @param props - The localized compiled document and optional embedded title.
 * @param props.content - The document component emitted by Ardo.
 * @param props.title - A replacement heading when embedded in the full profile.
 * @returns The existing profile document structure.
 */
export function MarkdownContent({
  content,
  title,
}: {
  content: ProfileMarkdown
  title?: string
}): ReactNode {
  return (
    <ProfileTitleContext value={title}>
      {createElement(content, { components })}
    </ProfileTitleContext>
  )
}
