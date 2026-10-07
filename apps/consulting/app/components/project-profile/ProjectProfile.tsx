/* eslint-disable max-lines -- the five-page recruiter document composition stays collocated */
import type { ReactNode } from "react"

import { t } from "@palamedes/core/macro"
import { Trans } from "@palamedes/react/macro"
import { BunnyImage } from "@sebastian-websites/ui"

import type { FastnerProjectProfile, ProjectProfileProject } from "~/data/fastner.project-profile"
import type { Locale } from "~/lib/i18n"
import type { Portrait } from "~/lib/photos"
import type { ProfileDocumentDescriptor } from "~/lib/untranslated"

import { CompanyContact } from "~/components/profile-print/CompanyContact"
import { formatDateRange, formatList, formatPeriod } from "~/components/profile-print/helpers"
import { SHEET_PHOTO } from "~/lib/photos"
import { cn } from "~/lib/utilities"

import * as styles from "./projectProfile.css"
import * as pageStyles from "./projectProfilePage.css"
import { ProjectProfileRail } from "./ProjectProfileRail"

const MAX_VISIBLE_TECHNOLOGIES = 7

const PRIMARY_EVIDENCE_END_INDEX = 3
const RECENT_PRODUCT_START_INDEX = PRIMARY_EVIDENCE_END_INDEX + 1

function formatAvailabilityMonth(value: `${number}-${number}`, lang: Locale): string {
  const [year, month] = value.split("-").map(Number)
  return new Intl.DateTimeFormat(lang, {
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1)))
}

function PageMarker({ page }: { page: number }): ReactNode {
  return (
    <p
      className={cn(styles.pageMarker, pageStyles.screenOnlyPageMarker)}
      data-project-profile-marker={String(page)}
    >
      <Trans>Project Profile</Trans> · {String(page)} / 5
    </p>
  )
}

function ProjectCard({
  lang,
  project,
}: {
  lang: Locale
  project: ProjectProfileProject
}): ReactNode {
  return (
    <article className={styles.project}>
      <h3 className={styles.projectHeading}>
        {project.customer} · {project.title}
      </h3>
      <p className={styles.projectMeta}>
        {project.role} · {formatDateRange(project.startDate, project.endDate)}
      </p>
      <p className={styles.projectSummary}>{project.summary}</p>
      <ul className={styles.outcomeList}>
        {project.outcomes.map((outcome) => (
          <li className={styles.outcome} key={outcome}>
            {outcome}
          </li>
        ))}
      </ul>
      <p className={styles.technologies}>
        {formatList(project.technologies.slice(0, MAX_VISIBLE_TECHNOLOGIES), lang)}
      </p>
      {project.productUrl === undefined ? null : (
        <p>
          <a className={styles.link} href={project.productUrl}>
            {new URL(project.productUrl).hostname}
          </a>
        </p>
      )}
    </article>
  )
}

function EvidencePage({
  heading,
  lang,
  projects,
  role,
}: {
  heading: ReactNode
  lang: Locale
  projects: readonly ProjectProfileProject[]
  role: string
}): ReactNode {
  return (
    <section className={styles.page} data-project-profile-page="2">
      <p className={styles.eyebrow}>{role}</p>
      <h2 className={styles.sectionHeading}>{heading}</h2>
      <div className={styles.projectGrid} data-project-profile-projects="">
        {projects.map((project) => (
          <ProjectCard key={project.id} lang={lang} project={project} />
        ))}
      </div>
      <PageMarker page={2} />
    </section>
  )
}

function EvidenceAndProductsPage({
  lang,
  projects,
  role,
}: {
  lang: Locale
  projects: readonly ProjectProfileProject[]
  role: string
}): ReactNode {
  return (
    <section className={styles.page} data-project-profile-page="3">
      <p className={styles.eyebrow}>{role}</p>
      <h2 className={styles.sectionHeading}>
        <Trans>Selected Project Experience · Enterprise SaaS &amp; Internationalization</Trans>
      </h2>
      <div className={styles.projectGrid} data-project-profile-projects="">
        {projects.slice(PRIMARY_EVIDENCE_END_INDEX, RECENT_PRODUCT_START_INDEX).map((project) => (
          <ProjectCard key={project.id} lang={lang} project={project} />
        ))}
      </div>

      <section className={cn(styles.section, pageStyles.recentProductsSection)}>
        <h2 className={styles.sectionHeading}>
          <Trans>Recent Hands-on Products</Trans>
        </h2>
        <div className={styles.projectGrid} data-project-profile-projects="">
          {projects.slice(RECENT_PRODUCT_START_INDEX).map((project) => (
            <ProjectCard key={project.id} lang={lang} project={project} />
          ))}
        </div>
      </section>
      <PageMarker page={3} />
    </section>
  )
}

function ContactDetails({ data, lang }: { data: FastnerProjectProfile; lang: Locale }): ReactNode {
  const { consultant } = data
  return (
    <>
      <dt className={styles.detailLabel}>
        <Trans>Email</Trans>
      </dt>
      <dd className={styles.detailValue}>
        <a className={styles.link} href={`mailto:${consultant.email}`}>
          {consultant.email}
        </a>
      </dd>
      <dt className={styles.detailLabel}>
        <Trans>Phone</Trans>
      </dt>
      <dd className={styles.detailValue}>
        <a className={styles.link} href={`tel:${consultant.phone.replaceAll(/\s/gv, "")}`}>
          {consultant.phone}
        </a>
      </dd>
      <dt className={styles.detailLabel}>
        <Trans>Location</Trans>
      </dt>
      <dd className={styles.detailValue}>{consultant.location}</dd>
      <dt className={styles.detailLabel}>
        <Trans>Languages</Trans>
      </dt>
      <dd className={styles.detailValue}>{formatList(consultant.languages, lang)}</dd>
    </>
  )
}

function ProfileHeader({
  data,
  headshot,
}: {
  data: FastnerProjectProfile
  headshot: Portrait
}): ReactNode {
  return (
    <header
      className={cn(styles.profileHeader, pageStyles.firstPageSectionGap)}
      data-project-profile-section="header"
    >
      <div>
        <p className={styles.eyebrow}>
          <Trans>Project Profile</Trans>
        </p>
        <h1 className={styles.name}>{data.consultant.name}</h1>
        <p className={styles.role}>{data.role}</p>
      </div>
      <BunnyImage
        alt=""
        className={styles.portrait}
        crop={headshot.crop}
        height={SHEET_PHOTO.height}
        priority
        sizes="91px"
        src={headshot.src}
        width={SHEET_PHOTO.width}
        widths={[SHEET_PHOTO.width]}
      />
    </header>
  )
}

function FirstPage({
  consultantProfileUrl,
  data,
  headshot,
  lang,
}: {
  consultantProfileUrl: string
  data: FastnerProjectProfile
  headshot: Portrait
  lang: Locale
}): ReactNode {
  const availabilityMonth = formatAvailabilityMonth(data.availability.availableFrom, lang)
  const consultantProfileLink = new URL(consultantProfileUrl)
  return (
    <section className={styles.page} data-project-profile-page="1">
      <ProfileHeader data={data} headshot={headshot} />

      <section
        className={cn(styles.section, pageStyles.firstPageSectionGap)}
        data-project-profile-section="summary"
      >
        <h2 className={styles.sectionHeading}>
          <Trans>Profile Summary</Trans>
        </h2>
        <p className={styles.profileSummary}>{data.summary}</p>
        <p className={pageStyles.fullProfileReference}>
          <Trans>Full Consultant Profile</Trans>:{" "}
          <a
            className={styles.link}
            data-project-profile-full-profile-link=""
            href={consultantProfileUrl}
          >
            {consultantProfileLink.host}
            {consultantProfileLink.pathname}
          </a>
        </p>
      </section>

      <div
        className={cn(styles.availability, pageStyles.firstPageSectionGap)}
        data-project-profile-section="availability"
      >
        <div className={pageStyles.availabilityTopRow}>
          <p
            className={cn(styles.availabilityItem, styles.availabilityPrimary)}
            data-project-profile-availability-item="status"
          >
            {data.availability.status} (<Trans>as of {availabilityMonth}</Trans>)
          </p>
          <p
            className={cn(styles.availabilityItem, pageStyles.availabilityCapacity)}
            data-project-profile-availability-item="capacity"
          >
            {data.availability.capacity}
          </p>
        </div>
        <p className={styles.availabilityItem} data-project-profile-availability-item="contract">
          {data.availability.contract}
        </p>
        <p className={styles.availabilityItem} data-project-profile-availability-item="work-model">
          {data.availability.workModel}
        </p>
      </div>

      <section
        className={cn(styles.section, pageStyles.firstPageSectionGap)}
        data-project-profile-section="technical-focus"
      >
        <h2 className={styles.sectionHeading}>
          <Trans>Technical Focus</Trans>
        </h2>
        <ul className={styles.skillList}>
          {data.focusSkills.map((skill) => (
            <li className={styles.skill} key={skill}>
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} data-project-profile-section="contact">
        <h2 className={styles.sectionHeading}>
          <Trans>Direct Contact</Trans>
        </h2>
        <dl className={styles.details} data-project-profile-details="contact">
          <ContactDetails data={data} lang={lang} />
        </dl>
      </section>
      <PageMarker page={1} />
    </section>
  )
}

function CareerPage({ data, lang }: { data: FastnerProjectProfile; lang: Locale }): ReactNode {
  return (
    <section className={styles.page} data-project-profile-page="4">
      <p className={styles.eyebrow}>{data.role}</p>
      <section className={styles.section} data-project-profile-section="career-history">
        <h2 className={styles.sectionHeading}>
          <Trans>Further experience · complete career history</Trans>
        </h2>
        <ul className={styles.careerList}>
          {data.careerHistory.map((project) => (
            <li className={styles.careerItem} key={project.id}>
              <span className={styles.careerPeriod}>
                {formatPeriod(project.startDate, project.endDate)}
              </span>
              <span>
                {project.customer} · {project.role}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>
          <Trans>Education, Languages &amp; Contact</Trans>
        </h2>
        <dl className={styles.details} data-project-profile-details="education-contact">
          {data.consultant.degree === undefined ? null : (
            <>
              <dt className={styles.detailLabel}>
                <Trans>Degree</Trans>
              </dt>
              <dd className={styles.detailValue}>{data.consultant.degree}</dd>
            </>
          )}
          <ContactDetails data={data} lang={lang} />
        </dl>
      </section>
      <PageMarker page={4} />
    </section>
  )
}

function ClosingPage({ lang }: { lang: Locale }): ReactNode {
  return (
    <section className={cn(styles.page, pageStyles.lastPage)} data-project-profile-page="5">
      <div className={pageStyles.closingPageContent}>
        <CompanyContact lang={lang} />
      </div>
      <PageMarker page={5} />
    </section>
  )
}

export function ProjectProfile({
  consultantProfileUrl,
  data,
  document,
  headshot,
  lang,
}: {
  consultantProfileUrl: string
  data: FastnerProjectProfile
  document: ProfileDocumentDescriptor
  headshot: Portrait
  lang: Locale
}): ReactNode {
  const documentLabel = t`Project Profile`

  return (
    <div className={cn(pageStyles.body, lang === "de" ? pageStyles.langDe : pageStyles.langEn)}>
      <div className={styles.shell}>
        <article
          aria-label={`${data.consultant.name} – ${documentLabel}`}
          className={styles.document}
        >
          <FirstPage
            consultantProfileUrl={consultantProfileUrl}
            data={data}
            headshot={headshot}
            lang={lang}
          />
          <EvidencePage
            heading={<Trans>Selected Project Experience · Fintech &amp; E-Commerce</Trans>}
            lang={lang}
            projects={data.projects.slice(0, PRIMARY_EVIDENCE_END_INDEX)}
            role={data.role}
          />
          <EvidenceAndProductsPage lang={lang} projects={data.projects} role={data.role} />
          <CareerPage data={data} lang={lang} />
          <ClosingPage lang={lang} />
        </article>
        <ProjectProfileRail
          bookingUrl={data.consultant.bookingUrl}
          consultantId={data.consultant.id}
          document={document}
          lang={lang}
        />
      </div>
    </div>
  )
}
