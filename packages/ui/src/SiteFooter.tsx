import type { ReactElement } from "react"

import * as styles from "./SiteFooter.css.ts"

export type FooterLink = {
  readonly href: string
  readonly label: string
}

export type SiteFooterProps = {
  readonly legalEntity: string
  readonly links: readonly FooterLink[]
  readonly navigationLabel: string
}

/**
 * The footer shared by all sites: the legal entity and the legal links. Labels
 * arrive translated from the site.
 *
 * @param props - The legal entity, the translated links, and their landmark label.
 * @returns The page footer.
 */
export function SiteFooter(props: SiteFooterProps): ReactElement {
  const { legalEntity, links, navigationLabel } = props
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>© {legalEntity}</p>
        <nav aria-label={navigationLabel}>
          <ul className={styles.list}>
            {links.map((link) => (
              <li key={link.href}>
                <a className={styles.link} href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
