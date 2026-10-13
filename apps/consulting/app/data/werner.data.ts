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
    Tech.Rust,
    Tech.GraphQL,
    Tech.NextJS,
    Tech.Supabase,
    Tech.Vercel,
    Tech.MCP,
    Tech.AgentAutomation,
  ],
  backend: [Tech.GraphQL, Tech.NodeJS, Tech.REST, Tech.MySQL],
  frontend: [Tech.TypeScript, Tech.React, Tech.ReactRouter, Tech.VanillaExtract],
  specialization: [Tech.i18n, Tech.Monorepo, Tech.ComponentLibraries, Tech.CodeQuality],
  tools: [Tech.Vite, Tech.Turborepo, Tech.Playwright, Tech.Vitest],
}

export function getConsultant(): Consultant {
  return {
    bio: [
      t`I help software teams and large organizations build new frontend platforms. I make early architecture decisions and implement them with the team, drawing on years of work with UI frameworks, internationalization, and developer tooling. I also modernize existing frontends.`,
      t`I led development of the qooxdoo JavaScript UI framework at 1&1 and worked on Deutsche Telekom's Unify framework and early Tolino browser software. Core and Jasy were developed on our own initiative and used extensively at Zynga for our games' base library and build process. Today, my infrastructure work also includes Rust engines with TypeScript/Node.js interfaces.`,
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
      statement: t`Frontend architecture with attention to user and developer experience.`,
    },
    degree: t`IT Specialist (Fachinformatiker) / Advanced Technical College Entrance Qualification (Fachabitur)`,
    email: "s.werner@sebastian-consulting.de",
    focus: t`Frontend Architecture & Developer Experience`,
    id: "werner",
    industryExperience: [],
    languages: [t`German`, t`English`],
    location: "Hirschberg/Bergstraße",
    name: "Sebastian Werner",
    phone: "+49 151 22631309",
    profiles: {
      github: "https://github.com/sebastian-software",
      linkedin: "https://www.linkedin.com/in/swernerx/",
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
