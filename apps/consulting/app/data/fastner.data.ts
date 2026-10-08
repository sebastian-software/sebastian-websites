import { t } from "@palamedes/core/macro"

import type { Consultant, Project, Skills } from "./types"

import { getAdditionalProjects } from "./fastner.projects-additional"
import { getFeaturedProjects } from "./fastner.projects-featured"
import { Tech } from "./technologies"

export function getProjects(): Project[] {
  return [...getFeaturedProjects(), ...getAdditionalProjects()]
}

export const skills: Skills = {
  additional: [Tech.GraphQL, Tech.Temporal, Tech.BetterAuth, Tech.Relanto],
  backend: [Tech.Convex, Tech.NodeJS, Tech.CloudInfrastruktur, Tech.IaC],
  frontend: [Tech.TypeScript, Tech.React, Tech.ReactRouter, Tech.VanillaExtract],
  specialization: [Tech.LLM, Tech.Lokalisierung, Tech.EnterpriseFrontend, Tech.MobileApps],
  tools: [Tech.Vite, Tech.Vitest, Tech.Playwright, Tech.CICD],
}

function getExperienceYears(projectList: Project[]): number {
  const oldestYear = Math.min(...projectList.map((p) => p.startDate.getFullYear()))
  return new Date().getFullYear() - oldestYear
}

export function getConsultant(): Consultant {
  const experienceYears = getExperienceYears(getProjects())
  const experience = String(experienceYears)
  return {
    bio: [
      t`${experience} years of software development leave a mark – in my case, products running in more than ten countries. At DWS Group, I built an investment platform serving European and Asian markets. At Witt, I laid the technical foundation for 17 online shops. For Regrello, I developed an AI translation pipeline that enables users of different languages to collaborate seamlessly.`,
      t`I am at home in TypeScript, React, and Convex. Alongside that comes a tooling stack that shows frontend has long been more than just UI: Vite, Vitest, Playwright, Infrastructure as Code, CI/CD, authentication, secure deployments, and production-grade backends. But technology alone does not interest me much. What drives me: architectures that can grow without collapsing under their own weight. Code that the next team can understand too. And an honest assessment of when a new tool adds real value – and when it merely adds complexity.`,
      t`At Sebastian Software, I work as a Senior Technology Consultant where frontend architecture, full-stack SaaS, mobile, and internationalization intersect. Not as an external contractor who simply delivers code, but as a partner who shares knowledge, makes product decisions technically robust, and helps teams move forward.`,
    ],
    bookingUrl: "https://terminaro.eu/book/dcca7115-3a88-47c9-8a51-b461baa94e55",
    citizenship: t`German`,
    competencyFocus: {
      signature: [Tech.TypeScript, Tech.React, Tech.NodeJS, Tech.Convex, Tech.IaC],
      statement: t`Full-stack approach across the entire application – from frontend to infrastructure.`,
    },
    degree: t`Diplom-Informatiker (FH) – German diploma in computer science`,
    email: "s.fastner@sebastian-consulting.de",
    focus: t`Frontend & Fullstack`,
    id: "fastner",
    industryExperience: [
      { industry: t`Telecommunications`, years: 10 },
      { industry: t`Fintech`, years: 7 },
      { industry: t`E-Commerce`, years: 3 },
      { industry: t`Enterprise Software / SaaS`, years: 3 },
    ],
    languages: [t`German`, t`English`],
    location: t({ context: "contact location", message: "Mainz, Germany" }),
    name: "Sebastian Fastner",
    phone: "+49 176 32042696",
    profiles: {
      github: "https://github.com/sebastian-software",
      linkedin: "https://linkedin.com/in/sebastianfastner",
    },
    title: t`Senior Technology Consultant`,
    workPreferences: {
      hybrid: true,
      onsite: false,
      preferredRegion: t`preferably remote + occasional on-site`,
      remote: true,
    },
  }
}
