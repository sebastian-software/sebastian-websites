import { t } from "@palamedes/core/macro"
import { COMPANY } from "@sebastian-websites/legal"

import type { FrameCopy } from "./copy.ts"

/**
 * The shared frame's labels in the active language. Every site that renders the
 * frame includes this file in its Palamedes catalog, so the strings are
 * translated once per site and call time decides the language.
 *
 * @param year - The copyright year, normally the build year.
 * @returns The translated frame copy.
 */
export function createFrameCopy(year: number): FrameCopy {
  return {
    brandNames: { consulting: "Sebastian Consulting", software: "Sebastian Software" },
    company: {
      city: COMPANY.address.city,
      country: t`Germany`,
      email: "info@sebastian-software.de",
      name: COMPANY.name,
      postalCode: COMPANY.address.postalCode,
      street: COMPANY.address.street,
    },
    copyright: `© ${year} ${COMPANY.name}`,
    footer: {
      index: t`Site index`,
      legal: t`Legal`,
      profiles: t`Company profiles`,
    },
    header: {
      language: t`Language`,
      menu: t`Menu`,
      navigation: t`Main navigation`,
      outbound: { consulting: t`Our agency`, software: t`Our software` },
      skip: t`Skip to content`,
    },
    invitation: {
      consulting: {
        action: t`Meet Sebastian/Consulting`,
        heading: t`Need a clearer direction for your software?`,
        illustrationAlt: t`A drawn road winding through a valley toward the mountains.`,
        text: t`Our agency helps teams with software architecture, engineering and technical direction.`,
      },
      software: {
        action: t`Discover Sebastian/Software`,
        heading: t`See what we build beyond consulting.`,
        illustrationAlt: t`A drawn desk calendar with one marked appointment beside a potted plant.`,
        text: t`We build products, open-source projects and agent tools for everyday work.`,
      },
    },
    links: {
      booking: t`Book an intro call`,
      company: t`Company`,
      contact: t`Contact`,
      imprint: t`Imprint`,
      opensource: "Open Source",
      privacy: t`Privacy`,
      products: t`Products`,
      profiles: t`Profiles`,
      services: t`Services`,
      skills: "Agents & Skills",
    },
    newsletter: {
      action: t`Subscribe`,
      description: t`Insights into our work across software and consulting: what we're building, exploring and thinking about.`,
      emailLabel: t`Email address`,
      failure: t`The sign-up did not go through. Please try again later.`,
      invalid: t`Please enter a complete email address, such as name@example.com.`,
      pending: t`Signing you up…`,
      success: t`Almost done: please confirm the link we just sent you.`,
      title: t`Newsletter`,
      unavailable: t`Sign-up opens soon. The newsletter has not started yet.`,
    },
    notFound: {
      eyebrow: t`Error 404`,
      home: t`Home page`,
      pageTitle: t`Page not found`,
      text: t`The link may be outdated, or the address may contain a typo. These pages lead on:`,
      title: t`This page does not exist.`,
    },
    profiles: { github: "GitHub", linkedin: "LinkedIn" },
  }
}
