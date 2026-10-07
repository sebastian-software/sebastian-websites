import { unlocalized } from "~/lib/untranslated"

// Anchor id for the closing CTA section. The mobile bar's IntersectionObserver
// watches it so the booking action never appears twice on screen. Lives in its
// own module to keep the component files fast-refresh clean.
export const PROFILE_OUTRO_ID = unlocalized("profil-abschluss")
