import { t } from "@palamedes/core/macro"

import type { Consultant, Project, Skills } from "./types"

import { Tech } from "./technologies"
import { projects as additionalProjects } from "./werner.projects-additional"
import { getFeaturedProjects } from "./werner.projects-featured"

export function getProjects(): Project[] {
  return [...getFeaturedProjects(), ...additionalProjects]
}

export const skills: Skills = {
  additional: [
    Tech.GraphQL,
    Tech.NextJS,
    Tech.Supabase,
    Tech.Vercel,
    Tech.MCP,
    Tech.AgentAutomation,
  ],
  backend: [Tech.Convex, Tech.ReactRouterBackend, Tech.CloudInfrastruktur, Tech.IaC],
  frontend: [Tech.TypeScript, Tech.React, Tech.ReactRouter, Tech.VanillaExtract],
  specialization: [Tech.i18n, Tech.Monorepo, Tech.ComponentLibraries, Tech.CodeQuality],
  tools: [Tech.Vite, Tech.Turborepo, Tech.Playwright, Tech.Vitest],
}

function getExperienceYears(projectList: Project[]): number {
  const oldestYear = Math.min(...projectList.map((p) => p.startDate.getFullYear()))
  return new Date().getFullYear() - oldestYear
}

export function getConsultant(): Consultant {
  const experience = String(getExperienceYears(getProjects()))
  return {
    bio: [
      t`${experience} years of frontend work – I started when web applications did not have frameworks yet. At 1&1 I led the development of qooxdoo, one of the first large open-source UI frameworks for the web, publicly maintained for more than a decade. Since then I have helped build interfaces for millions of users: Deutsche Telekom's set-top boxes, the ARD Mediathek, and the national ticket booking flow of the Swiss Federal Railways.`,
      t`Today I am at home where codebases grow large: internationalization that goes beyond translation files. Monorepos that make teams faster, not slower. Component libraries that keep design and code together. Most recently I led the internationalization of Regrello's enterprise platform – acquired by Salesforce in late 2025 – reorganizing more than 2,000 files along the way. Code quality is not an end in itself to me but developer experience: you can tell good architecture by how easy the next change is.`,
      t`At Sebastian Software – founded together with Sebastian Fastner – I advise teams as Principal Technology Consultant on making their frontend sustainable. No slideware architecture, but work in the code: analysis, refactoring, enablement. And an honest answer on when the simpler solution is the better one.`,
    ],
    bookingUrl: "https://calendly.com/swernerx/15min",
    citizenship: t`German`,
    competencyFocus: {
      signature: [
        Tech.React,
        Tech.TypeScript,
        Tech.VanillaExtract,
        Tech.ComponentLibraries,
        Tech.CodeQuality,
      ],
      statement: t`Frontend focus with an eye on user and developer experience.`,
    },
    degree: t`IT Specialist (Fachinformatiker) / Advanced Technical College Entrance Qualification (Fachabitur)`,
    email: "s.werner@sebastian-software.de",
    focus: t`Frontend-Architektur & Developer Experience`,
    id: "werner",
    industryExperience: [
      { industry: t`Fintech`, years: 6 },
      { industry: t`E-Commerce`, years: 5 },
      { industry: t`Telecommunications`, years: 8 },
      { industry: t`Energy`, years: 4 },
    ],
    languages: [t`German`, t`English`],
    location: "Hirschberg/Bergstraße",
    name: "Sebastian Werner",
    phone: "+49 151 22631309",
    profiles: {
      github: "https://github.com/sebastian-software",
      linkedin: "https://linkedin.com/in/anthropicsebastian",
    },
    title: t`Principal Technology Consultant`,
    workPreferences: {
      hybrid: true,
      onsite: false,
      preferredRegion: t`preferably remote + occasional on-site`,
      remote: true,
    },
  }
}
