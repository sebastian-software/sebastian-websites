import type { KerameikosName } from "@sebastian-websites/ui"
import type { ImageSource } from "@sebastian-websites/web-core"

import { t } from "@palamedes/core/macro"

import palamedesPlusBooks from "~/assets/illustrations/palamedes-plus-studio.webp?bunny"
import terminaroCalendar from "~/assets/illustrations/terminaro-salon.webp?bunny"
import vorortStorefront from "~/assets/illustrations/vorort-workshop.webp?bunny"

/** Stable identifiers for the product sections. */
export type ProductId = "palamedes-plus" | "terminaro" | "vorort"

/** One commercial product as an illustrated story on the home page. */
export type Product = {
  readonly action: { readonly href?: string; readonly label: string }
  /** Who it is for, the problem, the benefit, and how it works. */
  readonly description: string
  readonly id: ProductId
  readonly illustration: { readonly alt: string; readonly src: ImageSource }
  readonly name: KerameikosName
  readonly title: string
}

/**
 * The commercial products in editorial order. The home page renders any number
 * of entries as alternating stories; adding a product means adding an entry.
 *
 * @returns The products in the active language.
 */
export function getProducts(): readonly Product[] {
  return [
    {
      action: { href: "https://terminaro.eu", label: t`Explore Terminaro` },
      description: t`Give your customers a simple way to book online, without an account and without cookies on the public booking page. Terminaro syncs with Google, iCloud, or CalDAV calendars to prevent double bookings, sends confirmations and reminders on its own, and keeps booking data on servers in Germany.`,
      id: "terminaro",
      illustration: {
        alt: t`A salon appointment appears at 10:30 on both the calendar and the customer’s phone.`,
        src: terminaroCalendar,
      },
      name: "Terminaro",
      title: t`Online appointment booking for small businesses.`,
    },
    {
      action: { href: "https://palamedes.dev", label: t`Explore the open core` },
      description: t`Translation belongs in the product workflow. Palamedes+ is for teams that build on Palamedes, our open-source internationalization core: the core stays open, while catalog upkeep, review, and AI-assisted suggestions become a managed service. It grew out of internationalizing large codebases, where translations should roll out in seconds rather than weeks.`,
      id: "palamedes-plus",
      illustration: {
        alt: t`Two colleagues compare an English source text with its German translation.`,
        src: palamedesPlusBooks,
      },
      name: "Palamedes+",
      title: t`Managed translations built around an open core.`,
    },
    {
      action: { label: t`Coming soon` },
      description: t`A website only helps a local business while its opening hours, offers, and everyday information are current. VorOrt sets up a professional website and keeps it current: owners describe what changed in the website chat, confirm the update, and never have to work in a CMS.`,
      id: "vorort",
      illustration: {
        alt: t`A customer wheels a bicycle up to a neighborhood repair shop.`,
        src: vorortStorefront,
      },
      name: "VorOrt",
      title: t`Managed websites for local businesses.`,
    },
  ]
}
