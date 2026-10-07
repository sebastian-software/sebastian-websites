import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { blocks, layout, Section, SectionHead, typography } from "@sebastian-websites/ui"

import { Closing } from "~/components/Closing"
import { ProductCards } from "~/components/ProductCards"

import type { Route } from "./+types/products"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads meta from the route module
export function meta(): Route.MetaDescriptors {
  return [
    { title: t`Products – Sebastian Software` },
    {
      content: t`Terminaro for appointment booking, Palamedes+ for managed translations: the products of Sebastian Software.`,
      name: "description",
    },
  ]
}

export default function Products(): ReactElement {
  const principles = [
    {
      text: t`Every product started as a gap we saw: appointment booking that asks nothing of the people who book, a translation workflow for the codebases we internationalize. Using what we build is the fastest way to notice what is still missing.`,
      title: t`Born from gaps we saw`,
    },
    {
      text: t`A product that works for its first customers should still work for them in three years. We prefer boring, well-understood technology, keep the scope small, and change things only when we can explain why.`,
      title: t`Built to keep working`,
    },
    {
      text: t`Where a product grows out of an open core, the core stays open. Palamedes is and remains open source; Palamedes+ adds the service around it. You can inspect what you rely on.`,
      title: t`Open where it matters`,
    },
  ]
  return (
    <main id="main">
      <Section tone="white">
        <SectionHead
          eyebrow={t`Products`}
          intro={t`Each of our products grew out of a gap we saw ourselves, and we use them in our own work wherever they fit. That is our standard: we would not sell anything we would not want to use ourselves. The products have their own sites with every detail; this is what they are for.`}
          title={t`We build what we need ourselves.`}
          titleAs="h1"
        />
        <ProductCards />
      </Section>
      <Section>
        <SectionHead
          eyebrow={t`How we build products`}
          intro={t`Three principles decide what we build and how. They are the same principles that guide our consulting work, applied to our own products.`}
          title={t`Small, lasting, inspectable.`}
        />
        <div className={layout.columns}>
          {principles.map((principle) => (
            <div className={blocks.column} key={principle.title}>
              <h3 className={typography.h3}>{principle.title}</h3>
              <p className={typography.textMuted}>{principle.text}</p>
            </div>
          ))}
        </div>
      </Section>
      <Closing />
    </main>
  )
}
