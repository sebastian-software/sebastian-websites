import type { BrandId, CompanyProfile, FrameLinkId } from "@sebastian-websites/web-core"

/** The newsletter's labels and status messages. */
export type NewsletterCopy = {
  readonly action: string
  readonly description: string
  readonly emailLabel: string
  readonly failure: string
  readonly invalid: string
  readonly pending: string
  readonly success: string
  readonly title: string
  /** Shown while no newsletter service is connected. */
  readonly unavailable: string
}

/** The editorial invitation to the other brand. */
export type InvitationCopy = {
  readonly action: string
  readonly heading: string
  readonly illustrationAlt: string
  readonly text: string
}

/** The registered company details printed in every footer. */
export type CompanyDetails = {
  readonly city: string
  readonly country: string
  readonly email: string
  readonly name: string
  readonly postalCode: string
  readonly street: string
}

/**
 * Every label of the shared frame, translated by the rendering site. Invitation
 * and outward labels are keyed by the brand they lead to.
 */
export type FrameCopy = {
  readonly brandNames: Readonly<Record<BrandId, string>>
  readonly company: CompanyDetails
  readonly copyright: string
  readonly footer: {
    readonly index: string
    readonly legal: string
    readonly profiles: string
  }
  readonly header: {
    readonly language: string
    /** The button that opens the navigation on compact screens. */
    readonly menu: string
    readonly navigation: string
    readonly outbound: Readonly<Record<BrandId, string>>
    /** The first focus stop, leading past the header to the page's main content. */
    readonly skip: string
  }
  readonly invitation: Readonly<Record<BrandId, InvitationCopy>>
  readonly links: Readonly<Record<FrameLinkId, string>>
  readonly newsletter: NewsletterCopy
  /** The page for unknown addresses, inside the frame. */
  readonly notFound: {
    readonly eyebrow: string
    readonly home: string
    readonly pageTitle: string
    readonly text: string
    readonly title: string
  }
  readonly profiles: Readonly<Record<CompanyProfile["id"], string>>
}
