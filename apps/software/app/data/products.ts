import type { ImageSource } from "@sebastian-websites/web-core"

import { t } from "@palamedes/core/macro"

import palamedesPlusBooks from "~/assets/illustrations/palamedes-plus-books.png?bunny"
import terminaroCalendar from "~/assets/illustrations/terminaro-calendar.png?bunny"
import vorortStorefront from "~/assets/illustrations/vorort-storefront.png?bunny"

/** Products with their own identity artwork; others show their name as text. */
export type ProductId = "palamedes-plus" | "terminaro" | "vorort"

/** One commercial product as an illustrated story on the home page. */
export type Product = {
  readonly action: { readonly href: string; readonly label: string }
  /** Who it is for, the problem, the benefit, and how it works. */
  readonly description: string
  readonly id: ProductId
  readonly illustration: { readonly alt: string; readonly src: ImageSource }
  readonly name: string
  /** Whether customers can use the product today; the others are announced. */
  readonly released: boolean
  /** The public availability, as the product's own site states it. */
  readonly status: string
  readonly title: string
}

/**
 * The commercial products in editorial order. The home page renders any number
 * of entries as alternating stories; adding a product means adding an entry.
 * Status and actions follow each product's public state: VorOrt has no public
 * site yet, so its action leads to the contact page.
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
        alt: t`A drawn desk calendar with one booked slot, a pen, and a potted plant.`,
        src: terminaroCalendar,
      },
      name: "Terminaro",
      released: true,
      status: t`Early access`,
      title: t`Online appointment booking for small businesses.`,
    },
    {
      action: { href: "https://palamedes.dev", label: t`Explore the open core` },
      description: t`Translation belongs in the product workflow. Palamedes+ is for teams that build on Palamedes, our open-source internationalization core: the core stays open, while catalog upkeep, review, and AI-assisted suggestions become a managed service. It grew out of internationalizing large codebases, where translations should roll out in seconds rather than weeks.`,
      id: "palamedes-plus",
      illustration: {
        alt: t`Drawn books and cards with a Latin letter and a Chinese character beside an open book.`,
        src: palamedesPlusBooks,
      },
      name: "Palamedes+",
      released: false,
      status: t`Coming soon`,
      title: t`Managed translations built around an open core.`,
    },
    {
      action: { href: "/contact", label: t`Ask us about VorOrt` },
      description: t`A website only helps a local business while its opening hours, offers, and everyday information are current. VorOrt sets up a professional website and keeps it current: owners describe what changed in the website chat, confirm the update, and never have to work in a CMS.`,
      id: "vorort",
      illustration: {
        alt: t`A drawn shop front with a striped awning, a blank sandwich board, and potted trees.`,
        src: vorortStorefront,
      },
      name: "VorOrt",
      released: false,
      status: t`Coming soon`,
      title: t`Managed websites for local businesses.`,
    },
  ]
}
