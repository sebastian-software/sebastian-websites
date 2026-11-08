import type { NextStep } from "@sebastian-websites/web-core"

import { t } from "@palamedes/core/macro"

/** What the next-step box says about its destination. */
export type NextStepCopy = {
  /** The link text, which names the destination on its own. */
  readonly action: string
  readonly text: string
  readonly title: string
}

/**
 * The copy of each next step in the page's language. Consulting offers name
 * the agency, since the link leaves the Software site.
 * @param step - The post's next step, other than `none`.
 * @returns Its title, text, and link text.
 */
export function nextStepCopy(step: Exclude<NextStep, "none">): NextStepCopy {
  switch (step) {
    case "consulting-architecture": {
      return {
        action: t`Explore architecture consulting`,
        text: t`Our agency Sebastian Consulting helps teams find the coupling that makes small changes expensive, and works out the next useful step with them.`,
        title: t`Architecture that leaves room for change.`,
      }
    }
    case "consulting-enablement": {
      return {
        action: t`Explore engineering support`,
        text: t`Our agency Sebastian Consulting works in the code with the people who maintain it. Decisions become working software, and the reasoning stays with your team.`,
        title: t`Engineering that moves the team forward.`,
      }
    }
    case "consulting-internationalization": {
      return {
        action: t`Explore internationalization consulting`,
        text: t`Our agency Sebastian Consulting makes language support part of the product, from the interface to the content people create and share.`,
        title: t`A product that works across languages.`,
      }
    }
    case "contact": {
      return {
        action: t`Get in touch`,
        text: t`Write to us; one of the two founders answers.`,
        title: t`Questions about this topic?`,
      }
    }
    case "ferramenta-docs": {
      return {
        action: t`Read the Ferramenta documentation`,
        text: t`Ferramenta is our family of Rust engines and applications for documents and text, with benchmarks and comparisons.`,
        title: "Ferramenta",
      }
    }
    case "open-source": {
      return {
        action: t`Explore our open-source work`,
        text: t`Rust engines, TypeScript libraries, and skills for coding agents: what we build for our products, we share again.`,
        title: t`Tools you can inspect.`,
      }
    }
    case "palamedes-docs": {
      return {
        action: t`Read the Palamedes documentation`,
        text: t`Internationalization for TypeScript applications: message extraction, catalogs, and framework adapters.`,
        title: "Palamedes",
      }
    }
    case "products": {
      return {
        action: t`Discover the products`,
        text: t`Each of our products grew out of a gap we saw ourselves, and we use them in our own work.`,
        title: t`We build what we need ourselves.`,
      }
    }
  }
}
