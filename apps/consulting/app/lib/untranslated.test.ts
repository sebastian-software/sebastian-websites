import { LOCALES } from "@sebastian-websites/web-core"
import { describe, expect, it } from "vitest"

import {
  getProfileDocument,
  PROFILE_DOCUMENTS,
  PROFILE_PDFS,
  type ProfilePdfDescriptor,
  TEAM,
} from "./untranslated"

type FlatEntry = {
  readonly consultantId: string
  readonly descriptor: ProfilePdfDescriptor
  readonly locale: string
}

// Flattens the consultant/locale matrix so the derivation can be asserted as a
// property over every entry instead of over a hand-picked example.
const ENTRIES: readonly FlatEntry[] = Object.entries(PROFILE_PDFS).flatMap(
  ([consultantId, byLocale]) =>
    Object.entries(byLocale).map(([locale, descriptor]) => ({
      consultantId,
      descriptor,
      locale,
    }))
)

const DOCUMENT_ENTRIES = PROFILE_DOCUMENTS.flatMap((document) =>
  LOCALES.map((locale) => ({
    descriptor: document.pdfs[locale],
    document,
    locale,
  }))
)

const TEAM_MEMBERS: Record<string, { readonly firstName: string; readonly lastName: string }> = TEAM

// The naming convention, pinned machine-readably: "CV", an ASCII-only first and
// last name, the language token, ".pdf" - capitalized for the download name and
// lowercase kebab-case under /pdfs/ for the stored path. The language tokens are
// spelled out on purpose: a new locale has to pass through this convention
// deliberately rather than slip in behind a wildcard.
const DOWNLOAD_NAME_SHAPE = /^CV-[A-Z][a-z]*-[A-Z][a-z]*-(?:de|en)\.pdf$/v
const HREF_SHAPE = /^\/pdfs\/cv-[a-z]+-[a-z]+-(?:de|en)\.pdf$/v

describe("PROFILE_PDFS", () => {
  it("pins the stored path and download name of a concrete profile PDF", () => {
    expect(PROFILE_PDFS.fastner.de).toStrictEqual({
      downloadName: "CV-Sebastian-Fastner-de.pdf",
      href: "/pdfs/cv-sebastian-fastner-de.pdf",
    })
    expect(PROFILE_PDFS.werner.en).toStrictEqual({
      downloadName: "CV-Sebastian-Werner-en.pdf",
      href: "/pdfs/cv-sebastian-werner-en.pdf",
    })
  })

  it("covers every team member in every locale", () => {
    const actualLocales = Object.fromEntries(
      Object.entries(PROFILE_PDFS).map(([consultantId, byLocale]) => [
        consultantId,
        Object.keys(byLocale),
      ])
    )
    const expectedLocales = Object.fromEntries(
      Object.keys(TEAM).map((consultantId) => [consultantId, [...LOCALES]])
    )

    expect(actualLocales).toStrictEqual(expectedLocales)
    expect(ENTRIES).toHaveLength(Object.keys(TEAM).length * LOCALES.length)
  })

  it("derives a distinct path and download name for every entry", () => {
    // The compatibility build merges both language variants into one flat
    // pdfs/ directory and copies with force: true, so colliding names would
    // silently overwrite one language with the other instead of 404ing.
    const hrefs = ENTRIES.map((entry) => entry.descriptor.href)
    const downloadNames = ENTRIES.map((entry) => entry.descriptor.downloadName)

    expect(new Set(hrefs).size).toBe(ENTRIES.length)
    expect(new Set(downloadNames).size).toBe(ENTRIES.length)
  })

  it("keeps the stored path lowercase and the download name capitalized", () => {
    for (const { consultantId, descriptor } of ENTRIES) {
      const member = TEAM_MEMBERS[consultantId]

      expect(descriptor.href).toBe(descriptor.href.toLowerCase())
      expect(descriptor.href.startsWith("/pdfs/")).toBe(true)
      expect(descriptor.downloadName).toContain(member.firstName)
      expect(descriptor.downloadName).toContain(member.lastName)
    }
  })

  it("keeps the language token lowercase in both forms", () => {
    for (const { descriptor, locale } of ENTRIES) {
      // Two lowercase letters keeps the token an ISO 639-1 code.
      expect(locale).toMatch(/^[a-z]{2}$/v)
      expect(descriptor.href.endsWith(`-${locale}.pdf`)).toBe(true)
      expect(descriptor.downloadName.endsWith(`-${locale}.pdf`)).toBe(true)
    }
  })

  it("rejects a team name that would produce an unsafe or malformed file name", () => {
    // Both names are derived straight from the TEAM entry with no sanitizing
    // step. A future member with a space ("Anna Lena"), an umlaut ("Müller") or
    // an apostrophe ("O'Neill") would yield a URL segment containing a space, a
    // non-ASCII path or a quoting hazard - and nothing else would notice,
    // because the build-time verifier derives the very same broken name and
    // then confirms it. These guards are the only place that fails.
    for (const { descriptor } of ENTRIES) {
      expect(descriptor.downloadName).toMatch(DOWNLOAD_NAME_SHAPE)
      expect(descriptor.href).toMatch(HREF_SHAPE)
      // encodeURI is a no-op only while every character is already URL-safe.
      expect(descriptor.href).toBe(encodeURI(descriptor.href))
    }
  })
})

describe("PROFILE_DOCUMENTS", () => {
  it("pins the complete document matrix, routes, and locale-specific names", () => {
    expect(PROFILE_DOCUMENTS).toStrictEqual([
      {
        consultantId: "fastner",
        kind: "consultant_profile",
        pdfs: {
          de: {
            downloadName: "CV-Sebastian-Fastner-de.pdf",
            href: "/pdfs/cv-sebastian-fastner-de.pdf",
          },
          en: {
            downloadName: "CV-Sebastian-Fastner-en.pdf",
            href: "/pdfs/cv-sebastian-fastner-en.pdf",
          },
        },
        route: "/fastner",
      },
      {
        consultantId: "werner",
        kind: "consultant_profile",
        pdfs: {
          de: {
            downloadName: "CV-Sebastian-Werner-de.pdf",
            href: "/pdfs/cv-sebastian-werner-de.pdf",
          },
          en: {
            downloadName: "CV-Sebastian-Werner-en.pdf",
            href: "/pdfs/cv-sebastian-werner-en.pdf",
          },
        },
        route: "/werner",
      },
      {
        consultantId: "fastner",
        kind: "project_profile",
        pdfs: {
          de: {
            downloadName: "Projektprofil-Sebastian-Fastner-React-TypeScript-de.pdf",
            href: "/pdfs/projektprofil-sebastian-fastner-react-typescript-de.pdf",
          },
          en: {
            downloadName: "Project-Profile-Sebastian-Fastner-React-TypeScript-en.pdf",
            href: "/pdfs/project-profile-sebastian-fastner-react-typescript-en.pdf",
          },
        },
        route: "/fastner/project-profile",
      },
    ])
    expect(DOCUMENT_ENTRIES).toHaveLength(PROFILE_DOCUMENTS.length * LOCALES.length)
  })

  it("keeps every published href and download name distinct across document kinds and locales", () => {
    const hrefs = DOCUMENT_ENTRIES.map(({ descriptor }) => descriptor.href)
    const downloadNames = DOCUMENT_ENTRIES.map(({ descriptor }) => descriptor.downloadName)

    expect(new Set(hrefs).size).toBe(DOCUMENT_ENTRIES.length)
    expect(new Set(downloadNames).size).toBe(DOCUMENT_ENTRIES.length)
  })

  it("uses safe local PDF hrefs with the exact locale suffix", () => {
    const localOrigin = "https://profile.test"
    for (const { descriptor, locale } of DOCUMENT_ENTRIES) {
      const url = new URL(descriptor.href, localOrigin)

      expect(url.origin).toBe(localOrigin)
      expect(url.pathname).toBe(descriptor.href)
      expect(url.search).toBe("")
      expect(url.hash).toBe("")
      expect(descriptor.href).toBe(descriptor.href.toLowerCase())
      expect(descriptor.href).toBe(encodeURI(descriptor.href))
      expect(descriptor.href.endsWith(`-${locale}.pdf`)).toBe(true)
      expect(descriptor.downloadName.endsWith(`-${locale}.pdf`)).toBe(true)
    }
  })

  it("resolves exactly one document by consultant and kind", () => {
    expect(getProfileDocument("project_profile", "fastner").route).toBe("/fastner/project-profile")
    expect(() => getProfileDocument("project_profile", "werner")).toThrow(
      "Expected one project_profile document for werner, found 0."
    )
  })
})
