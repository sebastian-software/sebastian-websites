import { describe, expect, it } from "vitest"

import {
  assertConsultantProfileFinalContent,
  assertConsultantProfileLayout,
  assertProjectProfilePrintLayout,
  type ConsultantProfilePrintLayout,
  getPdfPages,
  isAllowedBrowserRequest,
  type ProjectProfilePrintLayout,
} from "./generatePdfs"

function validProjectProfileLayout(language = "de"): ProjectProfilePrintLayout {
  const permission =
    language === "de"
      ? "Dieses Profil darf für Projektanfragen und -angebote weitergegeben, genutzt und gespeichert werden."
      : "This profile may be shared, used, and stored for project inquiries and proposals."
  const lastUpdated = language === "de" ? "Stand: 24. August 2026" : "As of: August 24, 2026"
  const copyright = "© 2014–2026 Sebastian Software GmbH"
  return {
    availabilityItems: [
      "Available immediately (as of August 2026) · Full-time",
      "Engagement via Sebastian Software GmbH",
      "Remote-first",
    ],
    availabilityLayout: [
      { bottom: 120, key: "status", left: 10, right: 250, top: 100 },
      { bottom: 120, key: "capacity", left: 500, right: 600, top: 100 },
      { bottom: 150, key: "contract", left: 10, right: 600, top: 130 },
      { bottom: 180, key: "work-model", left: 10, right: 600, top: 160 },
    ],
    careerEntryCount: 16,
    careerHeading:
      language === "de"
        ? "Weitere Stationen · vollständige Laufbahn"
        : "Further experience · complete career history",
    closingPageFinalContent: {
      items: [
        { kind: "permission", text: permission },
        { kind: "last-updated", text: lastUpdated },
        { kind: "copyright", text: copyright },
      ],
      profileContentText: `Company contact\n${permission}\n${lastUpdated}\n${copyright}`,
    },
    closingPageScreens: [
      {
        clientWidth: 794,
        label: "desktop",
        scrollWidth: 794,
        sectionDisplay: "flex",
        sectionHeight: 400,
        text: `Company contact\n${permission}`,
      },
      {
        clientWidth: 390,
        label: "mobile",
        scrollWidth: 390,
        sectionDisplay: "flex",
        sectionHeight: 600,
        text: `Company contact\n${permission}`,
      },
    ],
    detailGrids: [
      {
        key: "contact",
        labelRights: [100, 100, 100, 100],
        labels:
          language === "de"
            ? ["E-Mail", "Telefon", "Standort", "Sprachen"]
            : ["Email", "Phone", "Location", "Languages"],
        valueLefts: [120, 120, 120, 120],
      },
      {
        key: "education-contact",
        labelRights: [100, 100, 100, 100, 100],
        labels:
          language === "de"
            ? ["Abschluss", "E-Mail", "Telefon", "Standort", "Sprachen"]
            : ["Degree", "Email", "Phone", "Location", "Languages"],
        valueLefts: [120, 120, 120, 120, 120],
      },
    ],
    firstPageBottom: 926,
    firstPageMarkerBottom: 926,
    firstPageSections: [
      { bottom: 100, key: "header", top: 0 },
      { bottom: 200, key: "summary", top: 140 },
      { bottom: 300, key: "availability", top: 240 },
      { bottom: 400, key: "technical-focus", top: 340 },
      { bottom: 500, key: "contact", top: 440 },
    ],
    fontsReady: true,
    language,
    pageMargin: "25mm",
    pages: ["1", "2", "3", "4", "5"].map((marker, index) => ({
      clientHeight: 926,
      clientWidth: 605,
      descendantBottom: index * 926 + 925.98,
      descendantLeft: 0,
      descendantRight: 604.72,
      descendantTop: index * 926,
      height: 925.98,
      left: 0,
      marker,
      pageMarkerDisplay: "none",
      scrollHeight: 926,
      scrollWidth: 605,
      text:
        [
          language === "de"
            ? "Senior React & TypeScript Developer · Frontend Architect Banking und Asset Management E-Commerce Enterprise-SaaS"
            : "Senior React & TypeScript Developer · Frontend Architect banking and asset management e-commerce enterprise SaaS",
          language === "de"
            ? "Ausgewählte Projektnachweise · Fintech & E-Commerce"
            : "Selected Project Experience · Fintech & E-Commerce",
          language === "de"
            ? "Ausgewählte Projektnachweise · Enterprise-SaaS & Internationalisierung"
            : "Selected Project Experience · Enterprise SaaS & Internationalization",
          "Career history",
          "Company contact",
        ][index] ?? "",
      top: index * 926,
      width: 604.72,
    })),
    projectGroups:
      language === "de"
        ? [
            {
              borderTopWidths: [0, 0, 0],
              gaps: [48, 48],
              page: "2",
              projectCount: 3,
              projectHeadings: [
                "DWS / MorgenFund · Investment-Management-Plattform",
                "Witt-Gruppe (Otto Group) · Multi-Brand E-Commerce-Plattformen",
                "DWS (Deutsche Bank) · Robo-Advisor Investmentplattform",
              ],
            },
            {
              borderTopWidths: [0],
              gaps: [],
              page: "3",
              projectCount: 1,
              projectHeadings: ["Regrello · KI-gestützte Internationalisierung"],
            },
            {
              borderTopWidths: [0, 0],
              gaps: [48],
              page: "3",
              projectCount: 2,
              projectHeadings: [
                "Terminaro · Produkt der Sebastian Software GmbH · SaaS · Terminbuchungssystem",
                "Palamedes · Produkt der Sebastian Software GmbH · Dev Tools · KI-gestützte Lokalisierungsplattform",
              ],
            },
          ]
        : [
            {
              borderTopWidths: [0, 0, 0],
              gaps: [48, 48],
              page: "2",
              projectCount: 3,
              projectHeadings: [
                "DWS / MorgenFund · Investment Management Platform",
                "Witt-Gruppe (Otto Group) · Multi-Brand E-Commerce Platforms",
                "DWS (Deutsche Bank) · Robo-Advisor Investment Platform",
              ],
            },
            {
              borderTopWidths: [0],
              gaps: [],
              page: "3",
              projectCount: 1,
              projectHeadings: ["Regrello · AI-Powered Internationalization"],
            },
            {
              borderTopWidths: [0, 0],
              gaps: [48],
              page: "3",
              projectCount: 2,
              projectHeadings: [
                "Terminaro · Product by Sebastian Software GmbH · SaaS · Appointment Booking System",
                "Palamedes · Product by Sebastian Software GmbH · Dev Tools · AI-Powered Localization Platform",
              ],
            },
          ],
    screenMarkers: ["1", "2", "3", "4", "5"].map((page) => ({
      display: "block",
      page,
      text: `Project Profile · ${page} / 5`,
    })),
  }
}

function projectPage(
  layout: ProjectProfilePrintLayout,
  index: number
): ProjectProfilePrintLayout["pages"][number] {
  const page = layout.pages.at(index)
  if (page === undefined) throw new Error(`Missing project-profile page fixture ${String(index)}.`)
  return page
}

describe("PDF document matrix", () => {
  it("lists the German profile PDFs", () => {
    const pages = getPdfPages("consulting-de")
    expect(pages.filter((page) => page.kind === "consultant_profile")).toStrictEqual([
      expect.objectContaining({
        outputPath: "public/pdfs/cv-sebastian-fastner-de.pdf",
        path: "/fastner",
      }),
      expect.objectContaining({
        outputPath: "public/pdfs/cv-sebastian-werner-de.pdf",
        path: "/werner",
      }),
    ])
    expect(pages.filter((page) => page.kind === "project_profile")).toStrictEqual([
      expect.objectContaining({
        outputPath: "public/pdfs/projektprofil-sebastian-fastner-react-typescript-de.pdf",
        path: "/fastner/project-profile",
      }),
    ])
    expect(pages).toHaveLength(3)
  })

  it("lists the English profile PDFs", () => {
    const pages = getPdfPages("consulting-en")
    expect(pages.filter((page) => page.kind === "consultant_profile")).toStrictEqual([
      expect.objectContaining({
        outputPath: "public/pdfs/cv-sebastian-fastner-en.pdf",
        path: "/fastner",
      }),
      expect.objectContaining({
        outputPath: "public/pdfs/cv-sebastian-werner-en.pdf",
        path: "/werner",
      }),
    ])
    expect(pages.filter((page) => page.kind === "project_profile")).toStrictEqual([
      expect.objectContaining({
        outputPath: "public/pdfs/project-profile-sebastian-fastner-react-typescript-en.pdf",
        path: "/fastner/project-profile",
      }),
    ])
    expect(pages).toHaveLength(3)
  })
})

describe("PDF browser boundary", () => {
  it("allows only the local development origin and the shared asset hosts", () => {
    const baseUrl = "http://localhost:5173"
    expect(isAllowedBrowserRequest("http://localhost:5173/app/font.woff2", baseUrl)).toBe(true)
    expect(
      isAllowedBrowserRequest("https://assets.sebastian-software.com/shooting-2024/a.jpg", baseUrl)
    ).toBe(true)
    expect(isAllowedBrowserRequest("https://brand.sebastian-software.com/fonts.css", baseUrl)).toBe(
      true
    )
    expect(isAllowedBrowserRequest("http://127.0.0.1:5173/app/font.woff2", baseUrl)).toBe(false)
    expect(isAllowedBrowserRequest("https://example.com/tracker.js", baseUrl)).toBe(false)
    expect(isAllowedBrowserRequest("file:///tmp/secret", baseUrl)).toBe(false)
  })
})

describe("project profile print layout", () => {
  it.each(["de", "en"])(
    "accepts exactly five ordered, non-empty A4 content boxes for %s",
    (language) => {
      expect(() => {
        assertProjectProfilePrintLayout(validProjectProfileLayout(language))
      }).not.toThrow()
    }
  )

  it("requires the expanded positioning and localized selected-project headings", () => {
    const headingCases = [
      {
        expected: "Ausgewählte Projektnachweise · Fintech & E-Commerce",
        language: "de",
        old: "Ausgewählte Projektnachweise · Plattformen & Commerce",
        pageIndex: 1,
      },
      {
        expected: "Ausgewählte Projektnachweise · Enterprise-SaaS & Internationalisierung",
        language: "de",
        old: "Ausgewählte Projektnachweise · Fintech & Internationalisierung",
        pageIndex: 2,
      },
      {
        expected: "Selected Project Experience · Fintech & E-Commerce",
        language: "en",
        old: "Selected Project Experience · Platforms & Commerce",
        pageIndex: 1,
      },
      {
        expected: "Selected Project Experience · Enterprise SaaS & Internationalization",
        language: "en",
        old: "Selected Project Experience · Fintech & Internationalization",
        pageIndex: 2,
      },
    ] as const
    for (const headingCase of headingCases) {
      const localizedLayout = validProjectProfileLayout(headingCase.language)
      expect(() => {
        assertProjectProfilePrintLayout({
          ...localizedLayout,
          pages: localizedLayout.pages.with(headingCase.pageIndex, {
            ...projectPage(localizedLayout, headingCase.pageIndex),
            text: headingCase.old,
          }),
        })
      }).toThrow(headingCase.expected)
    }

    const layout = validProjectProfileLayout("en")
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        pages: layout.pages.with(0, {
          ...projectPage(layout, 0),
          text: "Senior React & TypeScript Developer · Frontend Architect",
        }),
      })
    }).toThrow("banking and asset management")
  })

  it("requires materially distributed first-page sections and a bottom-aligned marker", () => {
    const layout = validProjectProfileLayout()
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        firstPageSections: layout.firstPageSections.with(2, {
          bottom: 280,
          key: "availability",
          top: 220,
        }),
      })
    }).toThrow("first-page gap before availability")
    expect(() => {
      assertProjectProfilePrintLayout({ ...layout, firstPageMarkerBottom: 900 })
    }).toThrow("expected bottom alignment without overflow")
  })

  it("rejects a standalone company duplicate in the availability box", () => {
    const layout = validProjectProfileLayout()
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        availabilityItems: [...layout.availabilityItems, "Sebastian Software GmbH"],
      })
    }).toThrow("standalone duplicate")
  })

  it("requires a balanced availability header followed by two full-width rows", () => {
    const layout = validProjectProfileLayout()
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        availabilityLayout: layout.availabilityLayout.with(1, {
          ...layout.availabilityLayout[1],
          top: 130,
        }),
      })
    }).toThrow("top-row alignment")
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        availabilityLayout: layout.availabilityLayout.with(2, {
          ...layout.availabilityLayout[2],
          right: 300,
        }),
      })
    }).toThrow("right alignment")
  })

  it("requires split, aligned contact rows on pages one and four", () => {
    const layout = validProjectProfileLayout()
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        detailGrids: layout.detailGrids.with(0, {
          ...layout.detailGrids[0],
          labels: ["Contact", "Location", "Languages"],
        }),
      })
    }).toThrow("labels")
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        detailGrids: layout.detailGrids.with(1, {
          ...layout.detailGrids[1],
          valueLefts: [120, 120, 135, 120, 120],
        }),
      })
    }).toThrow("value alignment")
  })

  it("uses whitespace rather than borders between every pair of project cards", () => {
    const layout = validProjectProfileLayout()
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        projectGroups: layout.projectGroups.with(2, {
          borderTopWidths: [0, 1],
          gaps: [48],
          page: "3",
          projectCount: 2,
          projectHeadings: [
            "Terminaro · Produkt der Sebastian Software GmbH · SaaS · Terminbuchungssystem",
            "Palamedes · Produkt der Sebastian Software GmbH · Dev Tools · KI-gestützte Lokalisierungsplattform",
          ],
        }),
      })
    }).toThrow("must not use top borders")
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        projectGroups: layout.projectGroups.with(0, {
          borderTopWidths: [0, 0, 0],
          gaps: [12, 48],
          page: "2",
          projectCount: 3,
          projectHeadings: [
            "DWS / MorgenFund · Investment-Management-Plattform",
            "Witt-Gruppe (Otto Group) · Multi-Brand E-Commerce-Plattformen",
            "DWS (Deutsche Bank) · Robo-Advisor Investmentplattform",
          ],
        }),
      })
    }).toThrow("at least 40px")
  })

  it("requires the complete sixteen-entry career history", () => {
    const layout = validProjectProfileLayout()
    expect(() => {
      assertProjectProfilePrintLayout({ ...layout, careerEntryCount: 6 })
    }).toThrow("expected 16")
  })

  it("requires projects and products to be distributed across pages two and three", () => {
    const layout = validProjectProfileLayout()
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        projectGroups: layout.projectGroups.with(1, {
          borderTopWidths: [0],
          gaps: [],
          page: "4",
          projectCount: 1,
          projectHeadings: ["Regrello · KI-gestützte Internationalisierung"],
        }),
      })
    }).toThrow('expected page 3 with headings ["Regrello · KI-gestützte Internationalisierung"]')
  })

  it("requires every project group to preserve its expected localized headings", () => {
    const layout = validProjectProfileLayout()
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        projectGroups: layout.projectGroups.with(0, {
          ...layout.projectGroups[0],
          projectHeadings: [
            "Regrello · KI-gestützte Internationalisierung",
            "Witt-Gruppe (Otto Group) · Multi-Brand E-Commerce-Plattformen",
            "DWS (Deutsche Bank) · Robo-Advisor Investmentplattform",
          ],
        }),
      })
    }).toThrow("expected page 2 with headings")
  })

  it("rejects missing, duplicate, or out-of-order page containers", () => {
    const layout = validProjectProfileLayout()
    expect(() => {
      assertProjectProfilePrintLayout({ ...layout, pages: layout.pages.slice(0, 4) })
    }).toThrow("expected 5")
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        pages: [...layout.pages.slice(0, 4), { ...projectPage(layout, 4), marker: "4" }],
      })
    }).toThrow('expected ["1","2","3","4","5"]')
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        pages: [projectPage(layout, 1), projectPage(layout, 0), ...layout.pages.slice(2)],
      })
    }).toThrow("Project profile page markers")
  })

  it("hides internal page markers in print and keeps five ordered markers on screen", () => {
    const layout = validProjectProfileLayout()
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        pages: layout.pages.with(4, { ...projectPage(layout, 4), pageMarkerDisplay: "block" }),
      })
    }).toThrow("internal marker is visible in print")
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        screenMarkers: layout.screenMarkers.with(4, {
          display: "none",
          page: "5",
          text: "Project Profile · 5 / 5",
        }),
      })
    }).toThrow("screen marker 5 is missing or incorrect")
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        screenMarkers: [
          layout.screenMarkers[1],
          layout.screenMarkers[0],
          ...layout.screenMarkers.slice(2),
        ],
      })
    }).toThrow("Project profile screen markers")
  })

  it("requires the final contact section in desktop and mobile previews without overflow", () => {
    const layout = validProjectProfileLayout()
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        closingPageScreens: layout.closingPageScreens.with(1, {
          ...layout.closingPageScreens[1],
          sectionDisplay: "none",
        }),
      })
    }).toThrow("blank in the mobile preview")
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        closingPageScreens: layout.closingPageScreens.with(0, {
          ...layout.closingPageScreens[0],
          scrollWidth: layout.closingPageScreens[0].clientWidth + 3,
        }),
      })
    }).toThrow("overflows in the desktop preview")
  })

  it("rejects an invalid document locale and unloaded fonts", () => {
    const layout = validProjectProfileLayout()
    expect(() => {
      assertProjectProfilePrintLayout({ ...layout, language: "de-DE" })
    }).toThrow('Project profile language is "de-DE"')
    expect(() => {
      assertProjectProfilePrintLayout({ ...layout, fontsReady: false })
    }).toThrow("fonts are not ready")
  })

  it("rejects a missing or incorrect print page margin", () => {
    const layout = validProjectProfileLayout()
    expect(() => {
      assertProjectProfilePrintLayout({ ...layout, pageMargin: "20mm" })
    }).toThrow("Project profile page margin")
    expect(() => {
      assertProjectProfilePrintLayout({ ...layout, pageMargin: "" })
    }).toThrow("Project profile page margin")
  })

  it("rejects internal overflow and clipped descendants on every page", () => {
    const layout = validProjectProfileLayout()
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        pages: [
          projectPage(layout, 0),
          {
            ...projectPage(layout, 1),
            scrollHeight: projectPage(layout, 1).clientHeight + 3,
          },
          ...layout.pages.slice(2),
        ],
      })
    }).toThrow("page 2 overflows its A4 content box")
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        pages: [
          ...layout.pages.slice(0, 2),
          {
            ...projectPage(layout, 2),
            descendantRight: projectPage(layout, 2).left + projectPage(layout, 2).width + 3,
          },
          ...layout.pages.slice(3),
        ],
      })
    }).toThrow("page 3 has clipped content")
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        pages: [
          projectPage(layout, 0),
          {
            ...projectPage(layout, 1),
            descendantLeft: projectPage(layout, 1).left - 3,
          },
          ...layout.pages.slice(2),
        ],
      })
    }).toThrow("page 2 has clipped content")
    expect(() => {
      assertProjectProfilePrintLayout({
        ...layout,
        pages: [
          {
            ...projectPage(layout, 0),
            descendantTop: projectPage(layout, 0).top - 3,
          },
          ...layout.pages.slice(1),
        ],
      })
    }).toThrow("page 1 has clipped content")
  })
})

describe("consultant profile final content", () => {
  it.each([
    {
      lastUpdated: "Stand: 24. August 2026",
      locale: "de",
      permission:
        "Dieses Profil darf für Projektanfragen und -angebote weitergegeben, genutzt und gespeichert werden.",
    },
    {
      lastUpdated: "As of: August 24, 2026",
      locale: "en",
      permission:
        "This profile may be shared, used, and stored for project inquiries and proposals.",
    },
  ])("accepts permission, last updated, and final content copyright for $locale", (fixture) => {
    const copyright = "© 2014–2026 Sebastian Software GmbH"
    expect(() => {
      assertConsultantProfileFinalContent(
        {
          items: [
            { kind: "permission", text: fixture.permission },
            { kind: "last-updated", text: fixture.lastUpdated },
            { kind: "copyright", text: copyright },
          ],
          profileContentText: `Profile content\n${fixture.permission}\n${fixture.lastUpdated}\n${copyright}`,
        },
        fixture.locale
      )
    }).not.toThrow()
  })

  it("rejects reordered blocks and any profile content after the copyright", () => {
    const permission =
      "This profile may be shared, used, and stored for project inquiries and proposals."
    const lastUpdated = "As of: August 24, 2026"
    const copyright = "© 2014–2026 Sebastian Software GmbH"
    expect(() => {
      assertConsultantProfileFinalContent(
        {
          items: [
            { kind: "permission", text: permission },
            { kind: "copyright", text: copyright },
            { kind: "last-updated", text: lastUpdated },
          ],
          profileContentText: `${permission}\n${copyright}\n${lastUpdated}`,
        },
        "en"
      )
    }).toThrow("final content order")
    expect(() => {
      assertConsultantProfileFinalContent(
        {
          items: [
            { kind: "permission", text: permission },
            { kind: "last-updated", text: lastUpdated },
            { kind: "copyright", text: copyright },
          ],
          profileContentText: `${permission}\n${lastUpdated}\n${copyright}\nTrailing text`,
        },
        "en"
      )
    }).toThrow("not the final profile content block")
  })

  it("rejects permission copy from the wrong language", () => {
    const englishPermission =
      "This profile may be shared, used, and stored for project inquiries and proposals."
    const copyright = "© 2014–2026 Sebastian Software GmbH"
    expect(() => {
      assertConsultantProfileFinalContent(
        {
          items: [
            { kind: "permission", text: englishPermission },
            { kind: "last-updated", text: "Stand: 24. August 2026" },
            { kind: "copyright", text: copyright },
          ],
          profileContentText: `${englishPermission}\nStand: 24. August 2026\n${copyright}`,
        },
        "de"
      )
    }).toThrow("Consultant profile permission content")
  })
})

describe("consultant profile print layout", () => {
  const layout: ConsultantProfilePrintLayout = {
    boxes: [{ clientHeight: 320, key: "work-in-practice", scrollHeight: 320 }],
    fontsReady: true,
    headingFontLoaded: true,
    language: "en",
    sections: ["summary", "reports", "archive"],
    summaryHeight: 900,
    textFontLoaded: true,
  }

  it("accepts a one-page summary followed by reports and the archive", () => {
    expect(() => {
      assertConsultantProfileLayout(layout, "en")
    }).not.toThrow()
  })

  it("rejects a summary that spills onto the second page", () => {
    expect(() => {
      assertConsultantProfileLayout({ ...layout, summaryHeight: 960 }, "en")
    }).toThrow("overflows the first A4 page")
  })

  it("rejects missing brand fonts, sections, and clipped boxes", () => {
    expect(() => {
      assertConsultantProfileLayout({ ...layout, headingFontLoaded: false }, "en")
    }).toThrow("Elena and Glober")
    expect(() => {
      assertConsultantProfileLayout({ ...layout, sections: ["summary", "reports"] }, "en")
    }).toThrow("Consultant profile sections")
    expect(() => {
      assertConsultantProfileLayout(
        { ...layout, boxes: [{ clientHeight: 100, key: "glance-regrello", scrollHeight: 140 }] },
        "en"
      )
    }).toThrow("glance-regrello clips its content")
    expect(() => {
      assertConsultantProfileLayout(layout, "de")
    }).toThrow("Consultant profile language")
  })
})
