/**
 * Shared types for consultant profile data
 */

import type { Technology } from "./technologies"

export type Tier = 1 | 2 | 3

export type WorkPreferences = {
  hybrid: boolean
  onsite: boolean
  preferredRegion: string
  remote: boolean
}

export type Profiles = {
  github: string
  linkedin: string
}

export type IndustryExperience = {
  industry: string
  years: number
}

export type Education = {
  degree: string
  institution: string
  year: string
}

export type Project = {
  customer: string
  description: string
  endDate: Date | null
  id: string
  industry: string
  location: string
  logo: string
  results: string
  role: string
  startDate: Date
  technologies: string[]
  tier: Tier
  title: string
}

export type CompetencyFocus = {
  signature: Technology[]
  statement: string
}

type ConsultantBase = {
  bio: string[]
  bookingUrl?: string
  citizenship: string
  competencyFocus?: CompetencyFocus
  email: string
  focus: string
  id: string
  industryExperience: IndustryExperience[]
  languages: string[]
  location: string
  name: string
  phone: string
  profiles: Profiles
  title: string
  workPreferences: WorkPreferences
}

// Degree and education are optional — a consultant without academic records
// simply omits them (no placeholder data in the files).
export type Consultant = {
  degree?: string
  education?: Education[]
} & ConsultantBase

type FourString = [Technology, Technology, Technology, Technology]

export type Skills = {
  additional?: Technology[]
  backend: FourString
  frontend: FourString
  specialization: FourString
  tools: FourString
}

export type ProfileData = {
  consultant: Consultant
  projects: Project[]
  skills: Skills
}
