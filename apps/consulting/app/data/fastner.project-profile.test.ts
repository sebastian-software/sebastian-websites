import { describe, expect, it, vi } from "vitest"

import { getConsultant, getProjects } from "./fastner.data"
import {
  createFastnerProjectProfile,
  type FastnerProjectProfile,
  PROJECT_PROFILE_PROJECT_IDS,
  type ProjectProfileProject,
} from "./fastner.project-profile"

vi.mock("@palamedes/core/macro", () => ({
  t(strings: { message: string } | TemplateStringsArray, ...values: readonly unknown[]): string {
    if ("message" in strings) return strings.message
    let result = ""
    for (const [index, part] of strings.entries()) {
      result += part
      if (index < values.length) result += String(values[index])
    }
    return result
  },
}))

function requiredProject(profile: FastnerProjectProfile, id: string): ProjectProfileProject {
  const project = profile.projects.find((candidate) => candidate.id === id)
  if (project === undefined) throw new Error(`Missing project fixture ${id}.`)
  return project
}

function requiredSourceProject(id: string): ReturnType<typeof getProjects>[number] {
  const project = getProjects().find((candidate) => candidate.id === id)
  if (project === undefined) throw new Error(`Missing source project fixture ${id}.`)
  return project
}

describe("Fastner staffing profile projection", () => {
  it("selects the shared projects in the exact recruiter-facing order", () => {
    const sourceProjects = getProjects()
    const profile = createFastnerProjectProfile(getConsultant(), sourceProjects)

    expect(profile.projects.map((project) => project.id)).toStrictEqual([
      "dws-morgenfund",
      "witt-gruppe",
      "dws-wise",
      "regrello-i18n",
      "terminaro",
      "palamedes",
    ])
    for (const projected of profile.projects) {
      const source = sourceProjects.find((project) => project.id === projected.id)
      expect(source).toBeDefined()
      expect(projected).toMatchObject({
        customer: source?.customer,
        endDate: source?.endDate,
        role: source?.role,
        startDate: source?.startDate,
        technologies: source?.technologies,
        title: source?.title,
      })
    }
  })

  it("pins the DACH, Benelux, and farther-location staffing model", () => {
    const profile = createFastnerProjectProfile(getConsultant(), getProjects())

    expect(profile.availability).toStrictEqual({
      availableFrom: "2026-09",
      capacity: "Full-time",
      contract: "Engagement via Sebastian Software GmbH",
      status: "Available immediately",
      workModel:
        "Remote-first; occasional on-site work throughout Germany, Austria, Switzerland, and the Benelux. More distant locations by arrangement.",
    })
  })

  it("positions the recruiter profile with role, experience, and supported industries", () => {
    const profile = createFastnerProjectProfile(getConsultant(), getProjects())

    expect(profile.role).toBe("Senior React & TypeScript Developer · Frontend Architect")
    expect(profile.summary).toContain("more than 20 years of project experience")
    expect(profile.summary).toContain("banking and asset management")
    expect(profile.summary).toContain("e-commerce")
    expect(profile.summary).toContain("enterprise SaaS")
  })

  it("keeps the complete non-highlight career history in reverse chronological order", () => {
    const projects = getProjects()
    const profile = createFastnerProjectProfile(getConsultant(), projects)
    const highlightedIds = new Set<string>(PROJECT_PROFILE_PROJECT_IDS)
    const expectedHistory = projects
      .filter((project) => !highlightedIds.has(project.id))
      .toSorted((left, right) => right.startDate.getTime() - left.startDate.getTime())

    expect(profile.careerHistory).toHaveLength(expectedHistory.length)
    expect(profile.careerHistory.map((project) => project.id)).toStrictEqual(
      expectedHistory.map((project) => project.id)
    )
    expect(profile.careerHistory.map((project) => project.id)).toStrictEqual(
      expect.arrayContaining(["creative-communications-promotion", "boehringer-bix-supply-chain"])
    )
  })

  it("uses the shared product objects and adds only the stable product URLs", () => {
    const sourceProjects = getProjects()
    const profile = createFastnerProjectProfile(getConsultant(), sourceProjects)
    const terminaro = requiredProject(profile, "terminaro")
    const palamedes = requiredProject(profile, "palamedes")

    expect(terminaro).toMatchObject({
      customer: "Terminaro · Product by Sebastian Software GmbH · SaaS",
      productUrl: "https://terminaro.eu",
      role: "Product Engineer",
    })
    expect(palamedes).toMatchObject({
      customer: "Palamedes · Product by Sebastian Software GmbH · Dev Tools",
      productUrl: "https://palamedes.dev",
      role: "Product Architect",
    })
    expect(terminaro.customer).toBe(requiredSourceProject("terminaro").customer)
    expect(palamedes.customer).toBe(requiredSourceProject("palamedes").customer)
  })

  it("keeps recruiter-visible vendor and role names consistently cased", () => {
    const profile = createFastnerProjectProfile(getConsultant(), getProjects())
    const terminaro = requiredProject(profile, "terminaro")
    const suzuki = profile.careerHistory.find((project) => project.id === "suzuki-elearning")

    expect(terminaro.technologies).toContain("Bunny.net")
    expect(terminaro.technologies).not.toContain("Bunny")
    expect(suzuki?.role).toBe("Fullstack UI Architect")
  })

  it("names the one-time Regrello US visit without claiming global availability", () => {
    const profile = createFastnerProjectProfile(getConsultant(), getProjects())
    const regrello = requiredProject(profile, "regrello-i18n")
    const visibleCopy = [regrello.summary, ...regrello.outcomes].join(" ")

    expect(visibleCopy).toContain(
      "A one-off on-site assignment in the US demonstrates willingness to travel internationally."
    )
    expect(visibleCopy).not.toMatch(/worldwide|globally available/iv)
  })

  it("carries the verified profile improvements into recruiter-visible copy and skills", () => {
    const profile = createFastnerProjectProfile(getConsultant(), getProjects())
    const regrello = requiredProject(profile, "regrello-i18n")
    const dwsWise = requiredProject(profile, "dws-wise")
    const morgenfund = requiredProject(profile, "dws-morgenfund")
    const witt = requiredProject(profile, "witt-gruppe")
    const regrelloCopy = [regrello.summary, ...regrello.outcomes].join(" ")
    const dwsWiseCopy = [dwsWise.summary, ...dwsWise.outcomes].join(" ")

    expect(regrelloCopy).toContain("within seconds")
    expect(regrelloCopy).toContain("native languages")
    expect(regrelloCopy).toContain("all available languages")
    expect(dwsWiseCopy).toContain("more than ten")
    expect(dwsWise.technologies).toStrictEqual(
      expect.arrayContaining(["REST API", "Azure", "CI/CD"])
    )
    expect(morgenfund.technologies).toStrictEqual(
      expect.arrayContaining(["Jest", "React Testing Library"])
    )
    expect(witt.technologies).toContain("TypeScript")
  })

  it("fails when a selected project id is missing or duplicated", () => {
    const projects = getProjects()
    const selected = requiredSourceProject(PROJECT_PROFILE_PROJECT_IDS[0])

    expect(() =>
      createFastnerProjectProfile(
        getConsultant(),
        projects.filter((project) => project.id !== PROJECT_PROFILE_PROJECT_IDS[0])
      )
    ).toThrow("Expected one project with id dws-morgenfund, found 0.")
    expect(() => createFastnerProjectProfile(getConsultant(), [...projects, selected])).toThrow(
      "Expected one project with id dws-morgenfund, found 2."
    )
  })
})
