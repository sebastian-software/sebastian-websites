import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ArrowLink, BunnyImage } from "@sebastian-websites/ui"

import type { Consultant } from "~/components/profile-print/types"
import type { Portrait } from "~/lib/photos"

import { Closing } from "~/components/Closing"
import { getConsultant as getFastner } from "~/data/fastner.data"
import { getConsultant as getWerner } from "~/data/werner.data"
import { activeLocale } from "~/lib/i18n"
import { PORTRAITS, TEAM_PHOTO } from "~/lib/photos"
import { getProfileDocument } from "~/lib/untranslated"

import type { Route } from "./+types/team"

import * as styles from "./team.css.ts"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads meta from the route module
export function meta(): Route.MetaDescriptors {
  return [
    { title: t`Team – Sebastian Consulting` },
    {
      content: t`Sebastian Werner and Sebastian Fastner: two senior architects for React, TypeScript, and complex web applications, with their focus areas and full profiles.`,
      name: "description",
    },
  ]
}

type Member = {
  readonly consultant: Consultant
  readonly portrait: Portrait
  readonly projectProfile: boolean
}

function MemberLinks({ member }: { readonly member: Member }): ReactElement {
  const { id } = member.consultant
  const pdf = getProfileDocument("consultant_profile", id).pdfs[activeLocale]
  return (
    <ul className={styles.actions}>
      <li>
        <ArrowLink href={`/${id}`}>{t`Full Consultant Profile`}</ArrowLink>
      </li>
      {member.projectProfile ? (
        <li>
          <ArrowLink href={getProfileDocument("project_profile", id).route}>
            {t`Concise Project Profile`}
          </ArrowLink>
        </li>
      ) : null}
      <li>
        <ArrowLink download={pdf.downloadName} href={pdf.href}>
          {t`Download PDF`}
        </ArrowLink>
      </li>
    </ul>
  )
}

function TeamMember({ member }: { readonly member: Member }): ReactElement {
  const { consultant } = member
  const headingId = `${consultant.id}-name`
  return (
    <li>
      <article aria-labelledby={headingId} className={styles.member}>
        <div className={styles.portraitFrame}>
          <BunnyImage
            alt={consultant.name}
            className={styles.portrait}
            crop={member.portrait.crop}
            height={471}
            sizes="330px"
            src={member.portrait.src}
            width={330}
          />
        </div>
        <div className={styles.memberText}>
          <p className={styles.role}>{consultant.title}</p>
          <h2 className={styles.name} id={headingId}>
            {consultant.name}
          </h2>
          <p className={styles.focus}>{consultant.focus}</p>
          {consultant.competencyFocus === undefined ? null : (
            <>
              <p className={styles.statement}>{consultant.competencyFocus.statement}</p>
              <ul aria-label={t`Signature skills`} className={styles.skills}>
                {consultant.competencyFocus.signature.map((skill) => (
                  <li className={styles.skill} key={skill}>
                    {skill}
                  </li>
                ))}
              </ul>
            </>
          )}
          <MemberLinks member={member} />
        </div>
      </article>
    </li>
  )
}

/**
 * The two consultants side by side in their own words: focus, signature
 * skills, and the way to each full profile and PDF.
 *
 * @returns The team page.
 */
export default function Team(): ReactElement {
  const members: readonly Member[] = [
    { consultant: getWerner(), portrait: PORTRAITS.werner, projectProfile: false },
    { consultant: getFastner(), portrait: PORTRAITS.fastner, projectProfile: true },
  ]
  return (
    <main className={styles.main} id="main">
      <section aria-labelledby="team-title" className={styles.hero}>
        <h1 className={styles.heroTitle} id="team-title">
          {t`The two people you work with.`}
        </h1>
        <div className={styles.heroAside}>
          <p className={styles.heroText}>
            {t`Sebastian Werner and Sebastian Fastner founded Sebastian Software together. As Sebastian Consulting, both work directly in your project: architecture, hands-on development, and enablement, with no juniors and no handovers.`}
          </p>
        </div>
      </section>
      <figure className={styles.photoFrame}>
        <BunnyImage
          alt={t`Sebastian Fastner and Sebastian Werner in conversation in front of a sandstone wall`}
          className={styles.photo}
          crop={TEAM_PHOTO.crop}
          height={520}
          priority
          sizes="1040px"
          src={TEAM_PHOTO.src}
          width={1040}
        />
      </figure>
      <ul className={styles.members}>
        {members.map((member) => (
          <TeamMember key={member.consultant.id} member={member} />
        ))}
      </ul>
      <div className={styles.closing}>
        <Closing />
      </div>
    </main>
  )
}
