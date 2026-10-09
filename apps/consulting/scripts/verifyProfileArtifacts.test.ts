import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"

import {
  PROFILE_DOCUMENTS,
  PROFILE_PDFS,
  type ProfileDocumentDescriptor,
} from "../app/lib/untranslated"
import { createConsultantProfilePdfFixture, createProjectProfilePdfFixture } from "./pdfTestFixture"
import {
  assertDistinctFilenames,
  assertProfilePdfNamesDistinct,
  verifyProfileDownloadNames,
  verifyVariantProfileArtifacts,
} from "./verifyProfileArtifacts"

const temporaryDirectories: string[] = []

async function write(path: string, content: string | Uint8Array): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, content)
}

async function createRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "consulting-profile-"))
  temporaryDirectories.push(root)
  return root
}

// One route directory per public profile document, exactly like the pre-rendered
// route tree of a variant build and of one locale subtree of the compatibility build.
async function createRouteRoot(
  page: (document: ProfileDocumentDescriptor) => string
): Promise<string> {
  const root = await createRoot()
  await Promise.all(
    PROFILE_DOCUMENTS.map(async (document) =>
      write(join(root, document.route.slice(1), "index.html"), page(document))
    )
  )
  return root
}

function projectProfileBody(extra = "", locale: "de" | "en" = "de"): string {
  const consultantProfileUrl =
    locale === "de"
      ? "https://sebastian-consulting.de/fastner"
      : "https://sebastian-consulting.com/fastner"
  return `<main>${["1", "2", "3", "4", "5"]
    .map((marker) => `<section data-project-profile-page="${marker}">Page ${marker}</section>`)
    .join(
      ""
    )}<a href="https://terminaro.eu">Terminaro</a><a href="https://palamedes.dev">Palamedes</a><a href="${consultantProfileUrl}">Full profile</a>Sebastian Fastner Sebastian Software GmbH Regrello${extra}</main>`
}

function wiredPage(document: ProfileDocumentDescriptor, projectProfileExtra = ""): string {
  const pdf = document.pdfs.de
  const body =
    document.kind === "project_profile" ? projectProfileBody(projectProfileExtra, "de") : ""
  return `<html><body><a download="${pdf.downloadName}" href="${pdf.href}">PDF</a>${body}</body></html>`
}

function wronglyTargetedPage(document: ProfileDocumentDescriptor): string {
  const pdf = document.pdfs.de
  const body = document.kind === "project_profile" ? projectProfileBody() : ""
  return `<html><body><a download="${pdf.downloadName}" href="/pdfs/leftover.pdf">PDF</a>${body}</body></html>`
}

async function createPdfOutput(
  locale: "de" | "en",
  projectOptions?: Parameters<typeof createProjectProfilePdfFixture>[0],
  consultantOptions?: (
    consultantId: string
  ) => Omit<Parameters<typeof createConsultantProfilePdfFixture>[0], "consultantId">
): Promise<string> {
  const root = await createRoot()
  await Promise.all(
    PROFILE_DOCUMENTS.map(async (document) => {
      const filename = document.pdfs[locale].href.slice("/pdfs/".length)
      const fixture =
        document.kind === "project_profile"
          ? createProjectProfilePdfFixture({ locale, ...projectOptions })
          : createConsultantProfilePdfFixture({
              consultantId: document.consultantId,
              locale,
              ...consultantOptions?.(document.consultantId),
            })
      await write(join(root, "pdfs", filename), fixture)
    })
  )
  return root
}

function requiredProjectProfileText(locale: "de" | "en", extra = ""): string {
  return [
    "Sebastian Fastner",
    "Senior React & TypeScript Developer · Frontend Architect",
    "Sebastian Software GmbH",
    "DWS",
    "Witt",
    "Regrello",
    "Terminaro",
    "Palamedes",
    locale === "de" ? "Sofort verfügbar" : "Available immediately",
    locale === "de"
      ? "Ausgewählte Projektnachweise · Fintech & E-Commerce"
      : "Selected Project Experience · Fintech & E-Commerce",
    locale === "de"
      ? "Ausgewählte Projektnachweise · Enterprise-SaaS & Internationalisierung"
      : "Selected Project Experience · Enterprise SaaS & Internationalization",
    locale === "de" ? "Banking und Asset Management" : "banking and asset management",
    locale === "de" ? "E-Commerce" : "e-commerce",
    locale === "de" ? "Enterprise-SaaS" : "enterprise SaaS",
    extra,
  ].join(" ")
}

describe("profile artifact verifier", () => {
  afterEach(async () => {
    await Promise.all(
      temporaryDirectories
        .splice(0)
        .map(async (directory) => rm(directory, { force: true, recursive: true }))
    )
  })

  it("accepts a distinct set of derived PDF names", () => {
    expect(() => {
      assertDistinctFilenames(["cv-sebastian-fastner-de.pdf", "cv-sebastian-fastner-en.pdf"])
    }).not.toThrow()
  })

  it("accepts the combined locale matrix before compatibility artifacts are written", () => {
    expect(() => {
      assertProfilePdfNamesDistinct(["de", "en"])
    }).not.toThrow()
  })

  it("names the colliding PDFs instead of reporting a duplicated expectation", () => {
    expect(() => {
      assertDistinctFilenames(["cv-fastner.pdf", "cv-werner.pdf", "cv-fastner.pdf"])
    }).toThrow(
      'Derived PDF names are not distinct: ["cv-fastner.pdf","cv-fastner.pdf","cv-werner.pdf"] yields 2 distinct names, expected 3.'
    )
  })

  it("catches two documents deriving the same name", () => {
    expect(() => {
      assertDistinctFilenames(["cv-fastner-de.pdf", "cv-fastner-de.pdf"])
    }).toThrow("yields 1 distinct names, expected 2")
  })

  it("accepts a profile page whose anchor pairs the download name with its target", async () => {
    await expect(
      verifyProfileDownloadNames(await createRouteRoot(wiredPage), "de")
    ).resolves.toBeUndefined()
  })

  // Wire every page correctly, then break exactly one. The verifier checks every
  // consultant through one Promise.all, so a fixture that breaks all of them makes two
  // rejections race and the asserted consultant a coin toss. Breaking one is
  // deterministic and proves more: the verifier finds a single bad page among good
  // ones, rather than merely noticing that something somewhere is wrong.
  it("rejects a profile page without the expected download name", async () => {
    const root = await createRouteRoot(wiredPage)
    await write(
      join(root, "fastner", "index.html"),
      `<html><body><a download="" href="${PROFILE_PDFS.fastner.de.href}">PDF</a></body></html>`
    )

    await expect(verifyProfileDownloadNames(root, "de")).rejects.toThrow(
      'does not offer its profile PDF as download="CV-Sebastian-Fastner-de.pdf"'
    )
  })

  it("rejects the download attribute on an element that is not the anchor", async () => {
    const root = await createRouteRoot((document) => {
      const pdf = document.pdfs.de
      return `<html><body><div download="${pdf.downloadName}"></div><a href="${pdf.href}">PDF</a></body></html>`
    })

    await expect(verifyProfileDownloadNames(root, "de")).rejects.toThrow(
      "does not offer its profile PDF as download="
    )
  })

  it("rejects an anchor that carries the download name for another target", async () => {
    const root = await createRouteRoot(wronglyTargetedPage)

    await expect(verifyProfileDownloadNames(root, "de")).rejects.toThrow(
      "does not offer its profile PDF as download="
    )
  })

  it("rejects a missing profile page", async () => {
    await expect(verifyProfileDownloadNames(await createRoot(), "de")).rejects.toThrow(
      "Expected profile page file"
    )
  })

  it("rejects a locale without a profile PDF descriptor", async () => {
    await expect(
      verifyProfileDownloadNames(await createRouteRoot(wiredPage), "fr")
    ).rejects.toThrow('Unknown profile locale "fr".')
  })

  it("accepts the exact locale PDF set including a five-page project profile", async () => {
    await expect(
      verifyVariantProfileArtifacts(await createPdfOutput("de"), "de")
    ).resolves.toBeUndefined()
  })

  it("rejects a consultant profile whose summary runs onto the second page", async () => {
    const root = await createPdfOutput("en", undefined, (consultantId) => ({
      pageTexts: [
        `Sebastian ${consultantId.charAt(0).toUpperCase()}${consultantId.slice(1)} Personal Details`,
        "Industry Experience",
        "Project Experience Additional Projects",
      ],
    }))

    await expect(verifyVariantProfileArtifacts(root, "en")).rejects.toThrow(
      "does not start the project reports on page 2"
    )
  })

  it("rejects a consultant profile set in a fallback font", async () => {
    const root = await createPdfOutput("de", undefined, () => ({ fontName: "BAAAAA+ArialMT" }))

    await expect(verifyVariantProfileArtifacts(root, "de")).rejects.toThrow(
      "uses fonts outside Elena and Glober: BAAAAA+ArialMT"
    )
  })

  it("rejects a consultant profile without the consultant's mailbox link", async () => {
    const root = await createPdfOutput("de", undefined, () => ({ links: [] }))

    await expect(verifyVariantProfileArtifacts(root, "de")).rejects.toThrow(
      "does not link the consultant's mailbox"
    )
  })

  it("rejects a project-profile PDF with the wrong page count", async () => {
    const root = await createPdfOutput("de", { pageCount: 4 })

    await expect(verifyVariantProfileArtifacts(root, "de")).rejects.toThrow(
      "has 4 pages, expected 5"
    )
  })

  it("rejects a project-profile PDF missing a required text anchor", async () => {
    const requiredText = requiredProjectProfileText("de").replace(" Regrello", "")
    const root = await createPdfOutput("de", {
      links: ["https://terminaro.eu/"],
      text: requiredText,
    })

    await expect(verifyVariantProfileArtifacts(root, "de")).rejects.toThrow(
      "does not contain required project-profile text: Regrello"
    )
  })

  it("rejects a project-profile PDF missing a product URL", async () => {
    const root = await createPdfOutput("en", { links: ["https://terminaro.eu/"] })

    await expect(verifyVariantProfileArtifacts(root, "en")).rejects.toThrow(
      "does not contain product link https://palamedes.dev/"
    )
  })

  it("rejects a project-profile PDF missing the full consultant profile URL", async () => {
    const root = await createPdfOutput("de", {
      links: ["https://terminaro.eu/", "https://palamedes.dev/"],
    })

    await expect(verifyVariantProfileArtifacts(root, "de")).rejects.toThrow(
      "does not link the full consultant profile https://sebastian-consulting.de/fastner"
    )
  })

  it("rejects project-profile content clipped into the top page margin", async () => {
    const root = await createPdfOutput("en", { textTop: 830 })

    await expect(verifyVariantProfileArtifacts(root, "en")).rejects.toThrow(
      "project-profile content is clipped into the top margin"
    )
  })

  it.each(["Founder & Managing Director", "Co-Founder"])(
    "accepts founder roles in project-profile PDF content: %s",
    async (role) => {
      const root = await createPdfOutput("en", {
        text: requiredProjectProfileText("en", role),
      })

      await expect(verifyVariantProfileArtifacts(root, "en")).resolves.toBeUndefined()
    }
  )

  it.each([
    ["Stundensatz 120 EUR", "exposes an hourly rate"],
    ["dws-morgenfund", "exposes an internal project id"],
  ])("rejects excluded project-profile PDF content: %s", async (excludedText, expectedError) => {
    const root = await createPdfOutput("en", {
      text: requiredProjectProfileText("en", excludedText),
    })

    await expect(verifyVariantProfileArtifacts(root, "en")).rejects.toThrow(expectedError)
  })

  it("rejects missing or out-of-order project-profile HTML page markers", async () => {
    const root = await createRouteRoot(wiredPage)
    const path = join(root, "fastner", "project-profile", "index.html")
    const html = await readFile(path, "utf8")
    await write(
      path,
      html.replace('data-project-profile-page="5"', 'data-project-profile-page="4"')
    )

    await expect(verifyProfileDownloadNames(root, "de")).rejects.toThrow(
      "does not contain exactly five ordered project-profile page markers"
    )
  })

  it.each(["Founder & Managing Director", "Co-Founder"])(
    "accepts founder roles in project-profile HTML content: %s",
    async (role) => {
      const root = await createRouteRoot((document) => wiredPage(document, ` ${role}`))

      await expect(verifyProfileDownloadNames(root, "de")).resolves.toBeUndefined()
    }
  )

  it.each([
    ["Stundensatz 120 EUR", "exposes an hourly rate"],
    ["regrello-i18n", "exposes an internal project id"],
  ])("rejects excluded project-profile HTML content: %s", async (excludedText, expectedError) => {
    const root = await createRouteRoot(wiredPage)
    const path = join(root, "fastner", "project-profile", "index.html")
    const html = await readFile(path, "utf8")
    await write(path, html.replace("</main>", ` ${excludedText}</main>`))

    await expect(verifyProfileDownloadNames(root, "de")).rejects.toThrow(expectedError)
  })

  it("distinguishes a missing pdfs/ directory from an empty one", async () => {
    await expect(verifyVariantProfileArtifacts(await createRoot(), "de")).rejects.toThrow(
      "Expected PDF output directory"
    )
  })

  it("reports an existing but empty pdfs/ directory as a name-set mismatch", async () => {
    const root = await createRoot()
    await mkdir(join(root, "pdfs"), { recursive: true })

    await expect(verifyVariantProfileArtifacts(root, "de")).rejects.toThrow("contains PDFs []")
  })
})
