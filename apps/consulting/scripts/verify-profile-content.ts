import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const PROJECT_COUNT = 26
const HIGHLIGHT_COUNT = 6
const SHOWCASE_COUNT = 5
const expectedCounts = {
  executive_summary: { highlights: HIGHLIGHT_COUNT, projects: 0, showcases: SHOWCASE_COUNT },
  full: {
    highlights: HIGHLIGHT_COUNT,
    projects: PROJECT_COUNT,
    showcases: SHOWCASE_COUNT + SHOWCASE_COUNT,
  },
  project_history: { highlights: 0, projects: PROJECT_COUNT, showcases: SHOWCASE_COUNT },
}
type ProfileView = keyof typeof expectedCounts

function countMatches(content: string, pattern: RegExp): number {
  return [...content.matchAll(pattern)].length
}

function profileArticle(html: string, view: ProfileView, filename: string): string {
  const article =
    /<article\s[^>]*data-werner-profile="(?<view>[^"]*)"[^>]*>(?<content>[\s\S]*?)<\/article>/v.exec(
      html
    )
  assert.ok(article?.groups, `Missing profile document in ${filename}`)
  assert.equal(article.groups.view, view, `Wrong profile view in ${filename}`)
  // React separates Ferromark's adjacent text nodes around escaped entities.
  return article.groups.content.replaceAll("<!-- -->", "")
}

function assertDocumentStructure(content: string, view: ProfileView, filename: string): void {
  const expected = expectedCounts[view]
  assert.equal(countMatches(content, /<h1\b/gv), 1, `Profile name heading in ${filename}`)
  assert.equal(
    countMatches(content, /data-profile-project=""/gv),
    expected.projects,
    `Complete project chronology in ${filename}`
  )
  assert.equal(
    countMatches(content, /data-experience-highlight=/gv),
    expected.highlights,
    `Selected experience in ${filename}`
  )
  assert.equal(
    countMatches(content, /aria-label="Showcase"/gv),
    expected.showcases,
    `Curated showcase markers in ${filename}`
  )
}

function assertProjectHistory(content: string, locale: string, filename: string): void {
  for (const text of [
    "Schlund+Partner / 1&amp;1",
    locale === "de" ? "Baumarktkette" : "DIY Retailer",
    "https://github.com/sebastian-software/ardo",
  ])
    assert.ok(content.includes(text), `Missing historical work ${text} in ${filename}`)
}

function assertExecutiveSummary(content: string, filename: string): void {
  assert.ok(content.includes("mailto:s.werner@sebastian-software.de"), filename)
  assert.ok(content.includes("<ul>"), `Summary open-source list in ${filename}`)
  assert.match(content, /<h3[^>]*>Regrello — [^<]+<\/h3>/v, filename)
}

/**
 * Verify the complete profile documents after Ardo compiles and renders their MDX.
 * @param output - The built variant's client directory.
 * @param locale - The language of the built domain.
 */
export async function verifyWernerProfileContent(output: string, locale: string): Promise<void> {
  const documents: Array<{ route: string; view: ProfileView }> = [
    { route: "werner", view: "full" },
    { route: "werner/summary", view: "executive_summary" },
    { route: "werner/projects", view: "project_history" },
  ]
  await Promise.all(
    documents.map(async ({ route, view }) => {
      const filename = resolve(output, route, "index.html")
      const content = profileArticle(await readFile(filename, "utf8"), view, filename)
      assertDocumentStructure(content, view, filename)
      if (view !== "executive_summary") assertProjectHistory(content, locale, filename)
      if (view !== "project_history") assertExecutiveSummary(content, filename)
      assert.doesNotMatch(content, /<script\b|href="(?:javascript|data):/giv, filename)
    })
  )
}
