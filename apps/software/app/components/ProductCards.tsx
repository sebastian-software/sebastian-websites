import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { blocks, button } from "@sebastian-websites/ui"

/**
 * The three product cards: status, name, what it is for, and the link to its site.
 *
 * @returns The card grid.
 */
export function ProductCards(): ReactElement {
  const products = [
    {
      href: "https://terminaro.eu",
      link: t`Visit terminaro.eu →`,
      name: "Terminaro",
      soon: false,
      status: t`Available`,
      text: t`Online appointment booking for small businesses. Customers book themselves; the business keeps hours, services, and reminders in hand. Set up quickly, without an agency and without training, and built so that it still does the same in three years.`,
    },
    {
      href: "https://palamedes.dev",
      link: t`Palamedes, the open core →`,
      name: "Palamedes+",
      soon: true,
      status: t`Coming soon`,
      text: t`Managed translations for teams that use our open core Palamedes. The core stays open source; maintaining catalogs, approvals, and AI-assisted suggestions become a service. Born from internationalizing large codebases where translations should roll out in seconds rather than weeks.`,
    },
    {
      href: "https://palamedes.dev",
      link: t`Visit palamedes.dev →`,
      name: t`Third product`,
      soon: true,
      status: t`In preparation`,
      text: t`A third product is in the works. We will announce it once it runs in our own daily work and we know it keeps what it promises. Until then: Palamedes, the open core, is here today.`,
    },
  ]
  return (
    <div className={blocks.cards}>
      {products.map((product) => (
        <article className={blocks.card} key={product.name}>
          <span className={product.soon ? `${blocks.status} ${blocks.statusSoon}` : blocks.status}>
            {product.status}
          </span>
          <h3 className={blocks.cardTitle}>{product.name}</h3>
          <p className={blocks.cardText}>{product.text}</p>
          <a className={`${button.ghost} ${blocks.columnLink}`} href={product.href}>
            {product.link}
          </a>
        </article>
      ))}
    </div>
  )
}
