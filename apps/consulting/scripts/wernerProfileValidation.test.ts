import { describe, expect, it } from "vitest"

import {
  assertWernerProfileLayout,
  assertWernerProfilePdfText,
  type WernerProfileLayout,
} from "./wernerProfileValidation"

const full: WernerProfileLayout = {
  fontsReady: true,
  highlights: 6,
  history: true,
  language: "en",
  overflow: false,
  projects: 26,
  summary: true,
  width: (160 / 25.4) * 96,
}

describe("Werner profile print contract", () => {
  it("accepts the full profile and both standalone document layouts", () => {
    expect(() => {
      assertWernerProfileLayout(full, "consultant_profile", "en")
    }).not.toThrow()
    expect(() => {
      assertWernerProfileLayout({ ...full, history: false, projects: 0 }, "executive_summary", "en")
    }).not.toThrow()
    expect(() => {
      assertWernerProfileLayout({ ...full, highlights: 0, summary: false }, "project_history", "en")
    }).not.toThrow()
  })
  it("rejects dropped engagements, the wrong language, and horizontal clipping", () => {
    expect(() => {
      assertWernerProfileLayout({ ...full, projects: 25 }, "consultant_profile", "en")
    }).toThrow("incomplete")
    expect(() => {
      assertWernerProfileLayout(full, "consultant_profile", "de")
    }).toThrow("language")
    expect(() => {
      assertWernerProfileLayout({ ...full, overflow: true }, "consultant_profile", "en")
    }).toThrow("width")
  })
  it("rejects a truncated PDF history while accepting the shorter summary", () => {
    const summary = ["Sebastian Werner Regrello Palamedes Core Jasy Zynga qooxdoo"]
    expect(() => {
      assertWernerProfilePdfText(summary, "executive_summary", "en")
    }).not.toThrow()
    expect(() => {
      assertWernerProfilePdfText(summary, "project_history", "en")
    }).toThrow("missing required text")
  })
})
