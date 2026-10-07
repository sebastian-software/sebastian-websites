import { afterEach, describe, expect, it, vi } from "vitest"

import { trackBookingClick, trackProfilePdfDownload, trackProfilePrint } from "./analytics"

// Stubs a loaded Rybbit script and returns the spy behind rybbit.event.
function installRybbit(): ReturnType<typeof vi.fn> {
  const event = vi.fn()
  vi.stubGlobal("rybbit", { event })
  return event
}

describe("analytics tracking", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("is a no-op when Rybbit is not loaded", () => {
    // No rybbit global present (default node env) — guarded calls must not throw.
    expect(() => {
      trackBookingClick("hero", "shared")
      trackProfilePdfDownload("fastner", "consultant_profile")
      trackProfilePrint("werner")
    }).not.toThrow()
  })

  it("fires booking_click with location and consultant", () => {
    const event = installRybbit()
    trackBookingClick("profile_rail", "fastner")
    expect(event).toHaveBeenCalledWith("booking_click", {
      consultant: "fastner",
      location: "profile_rail",
    })
  })

  it("distinguishes consultant and project profile PDF downloads", () => {
    const event = installRybbit()
    trackProfilePdfDownload("werner", "consultant_profile")
    trackProfilePdfDownload("fastner", "project_profile")
    trackProfilePrint("fastner")
    expect(event).toHaveBeenNthCalledWith(1, "profile_pdf_download", {
      consultant: "werner",
      document_type: "consultant_profile",
    })
    expect(event).toHaveBeenNthCalledWith(2, "profile_pdf_download", {
      consultant: "fastner",
      document_type: "project_profile",
    })
    expect(event).toHaveBeenNthCalledWith(3, "profile_print", { consultant: "fastner" })
  })
})
