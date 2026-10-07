import { t } from "@palamedes/core/macro"

import type { Consultant, Project } from "./types"

export const PROJECT_PROFILE_PROJECT_IDS = [
  "dws-morgenfund",
  "witt-gruppe",
  "dws-wise",
  "regrello-i18n",
  "terminaro",
  "palamedes",
] as const

type ProjectProfileProjectId = (typeof PROJECT_PROFILE_PROJECT_IDS)[number]

export type ProjectProfileProject = {
  readonly outcomes: readonly string[]
  readonly productUrl?: `https://${string}`
  readonly summary: string
} & Pick<Project, "customer" | "endDate" | "id" | "role" | "startDate" | "technologies" | "title">

export type ProjectProfileCareerEntry = Pick<
  Project,
  "customer" | "endDate" | "id" | "role" | "startDate"
>

export type FastnerProjectProfile = {
  readonly availability: {
    readonly availableFrom: "2026-09"
    readonly capacity: string
    readonly contract: string
    readonly status: string
    readonly workModel: string
  }
  readonly careerHistory: readonly ProjectProfileCareerEntry[]
  readonly consultant: Consultant
  readonly focusSkills: readonly string[]
  readonly projects: readonly ProjectProfileProject[]
  readonly role: "Senior React & TypeScript Developer · Frontend Architect"
  readonly summary: string
}

type StaffingCopy = {
  readonly outcomes: readonly string[]
  readonly productUrl?: `https://${string}`
  readonly summary: string
}

function staffingCopy(id: ProjectProfileProjectId): StaffingCopy {
  switch (id) {
    case "dws-morgenfund": {
      return {
        outcomes: [
          t`Implemented the migration to Azure and a continuous deployment strategy.`,
          t`Ported a React dashboard to React Native, covered it with Jest and React Testing Library, and rolled it out to additional European and Asian markets.`,
        ],
        summary: t`Long-term development of an international investment management platform as Senior Frontend Architect.`,
      }
    }
    case "dws-wise": {
      return {
        outcomes: [
          t`Delivered from sales prototype through to a production white-label robo-advisor.`,
          t`Owned a React/TypeScript component library, REST integration, and CI/CD on Microsoft Azure.`,
        ],
        summary: t`Built the WISE white-label investment platform for more than ten European and Asian investment portals.`,
      }
    }
    case "palamedes": {
      return {
        outcomes: [
          t`Designed and implemented a CLI-first workflow, translation pipeline, QA reports, and terminology features.`,
          t`Delivered the website, newsletter backend, authentication, and API and pipeline infrastructure.`,
        ],
        productUrl: "https://palamedes.dev",
        summary: t`Developer-first platform for AI-assisted localization within Git and release workflows.`,
      }
    }
    case "regrello-i18n": {
      return {
        outcomes: [
          t`Translated new and changed content within seconds using an event-driven workflow, prioritizing participants' native languages before rolling out to all available languages.`,
          t`A one-off on-site assignment in the US demonstrates willingness to travel internationally.`,
        ],
        summary: t`Near-real-time internationalization of an enterprise SaaS platform using React, TypeScript, Go, GraphQL, encrypted Temporal workflows, and AI-assisted translation.`,
      }
    }
    case "terminaro": {
      return {
        outcomes: [
          t`Implemented public booking, administration, calendar integration, email delivery, and secure deployments.`,
          t`Used React Router, TypeScript, Convex, and automated tests as an end-to-end product stack.`,
        ],
        productUrl: "https://terminaro.eu",
        summary: t`Multilingual appointment scheduling system with a public booking page and integrated administration.`,
      }
    }
    case "witt-gruppe": {
      return {
        outcomes: [
          t`Established the technical foundation for 17 multi-brand online shops across international markets.`,
          t`Built a Next.js/React/TypeScript frontend, an Apollo GraphQL layer, and automated test infrastructure.`,
        ],
        summary: t`Led the frontend rebuild for the Witt Group within the Otto Group.`,
      }
    }
  }
}

function resolveProject(projects: readonly Project[], id: ProjectProfileProjectId): Project {
  const matches = projects.filter((project) => project.id === id)
  if (matches.length !== 1) {
    throw new Error(`Expected one project with id ${id}, found ${String(matches.length)}.`)
  }
  return matches[0]
}

function projectWithStaffingCopy(
  projects: readonly Project[],
  id: ProjectProfileProjectId
): ProjectProfileProject {
  const project = resolveProject(projects, id)
  return {
    customer: project.customer,
    endDate: project.endDate,
    id: project.id,
    role: project.role,
    startDate: project.startDate,
    technologies: project.technologies,
    title: project.title,
    ...staffingCopy(id),
  }
}

export function createFastnerProjectProfile(
  consultant: Consultant,
  projects: readonly Project[]
): FastnerProjectProfile {
  const selectedIds = new Set<string>(PROJECT_PROFILE_PROJECT_IDS)
  const careerHistory = projects
    .filter((project) => !selectedIds.has(project.id))
    .toSorted((left, right) => right.startDate.getTime() - left.startDate.getTime())
    .map(({ customer, endDate, id, role, startDate }) => ({
      customer,
      endDate,
      id,
      role,
      startDate,
    }))

  return {
    availability: {
      availableFrom: "2026-09",
      capacity: t`Full-time`,
      contract: t`Engagement via Sebastian Software GmbH`,
      status: t`Available immediately`,
      workModel: t`Remote-first; occasional on-site work throughout Germany, Austria, Switzerland, and the Benelux. More distant locations by arrangement.`,
    },
    careerHistory,
    consultant,
    focusSkills: ["React", "TypeScript", "Next.js", "Node.js", "GraphQL", "Testing", "CI/CD"],
    projects: PROJECT_PROFILE_PROJECT_IDS.map((id) => projectWithStaffingCopy(projects, id)),
    role: "Senior React & TypeScript Developer · Frontend Architect",
    summary: t`Hands-on frontend architect and senior React/TypeScript developer with more than 20 years of project experience. Builds and modernizes international platforms in banking and asset management, e-commerce, and enterprise SaaS – from component architecture and testing to CI/CD and cloud migration. Particularly effective in demanding product and transformation phases where architectural decisions and hands-on delivery need to come together.`,
  }
}
