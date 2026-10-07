import type { Portrait } from "~/lib/photos"
import type { ProfileDocumentDescriptor } from "~/lib/untranslated"

export type Project = {
  customer: string
  description: string
  endDate: Date | null
  id: string
  industry: string
  location: string
  logo?: string
  results?: string
  role: string
  startDate: Date
  technologies: string[]
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- numeric literal type
  tier?: 1 | 2 | 3
  title: string
}

export type IndustryExperience = {
  industry: string
  years: number
}

export type CompetencyFocus = {
  signature: string[]
  statement: string
}

export type Consultant = {
  bio: string[]
  bookingUrl?: string
  citizenship?: string
  competencyFocus?: CompetencyFocus
  degree?: string
  email: string
  focus: string
  id: string
  industryExperience?: IndustryExperience[]
  languages: string[]
  location: string
  name: string
  phone?: string
  photo?: Portrait
  profiles?: {
    github?: string
    linkedin?: string
  }
  title: string
  workPreferences?: {
    hybrid: boolean
    onsite: boolean
    preferredRegion: string
    remote: boolean
  }
}

export type Skills = {
  additional?: string[]
  backend?: string[]
  frontend: string[]
  specialization: string[]
  tools?: string[]
}

export type ProfilePrintV2Properties = {
  consultant: Consultant
  lang?: "de" | "en"
  projectProfile?: ProfileDocumentDescriptor
  projects: Project[]
  skills: Skills
}
