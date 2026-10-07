// Rybbit analytics event helpers.
//
// Pageviews, SPA navigation, outbound links and web vitals are handled by
// Rybbit's server-side site settings, so this module only fires the named
// conversion events the funnel analysis needs. Every call is a guarded no-op
// when the Rybbit script is absent (any non-production build, or when the
// script is blocked), so callers never check availability themselves.

type RybbitEventProperties = Record<string, number | string>

// Where a booking CTA lives. A new placement becomes a new value here, not a
// new event name (object-action taxonomy), so the dashboard can slice
// `booking_click` by location without new event definitions.
export type BookingLocation =
  | "error_page"
  | "final_cta"
  | "footer"
  | "header"
  | "hero"
  | "mobile_bar"
  | "profile_mobile_bar"
  | "profile_outro"
  | "profile_rail"

// "shared" is the home/global intro-call calendar; profile pages pass the
// consultant id ("fastner" | "werner").
type Consultant = string

export type ProfileDocumentType = "consultant_profile" | "project_profile"

// The Rybbit script attaches the global `rybbit` object (on `window`, which is
// `globalThis` in the browser). Reading it through `globalThis` keeps this safe
// during SSR/prerender, where the script is absent and the optional chain
// short-circuits to a no-op.
function track(name: string, properties: RybbitEventProperties): void {
  globalThis.rybbit?.event(name, properties)
}

export function trackBookingClick(location: BookingLocation, consultant: Consultant): void {
  track("booking_click", { consultant, location })
}

export function trackProfilePdfDownload(
  consultant: Consultant,
  documentType: ProfileDocumentType
): void {
  track("profile_pdf_download", { consultant, document_type: documentType })
}

export function trackProfilePrint(consultant: Consultant): void {
  track("profile_print", { consultant })
}
