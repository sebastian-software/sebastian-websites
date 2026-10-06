import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { NavLink } from "react-router"

import * as styles from "./MainNav.css.ts"

/**
 * The site's own main navigation, below the brand bar: Products, Open source,
 * Company, Contact.
 *
 * @returns The header with the site name and the main navigation.
 */
export function MainNav(): ReactElement {
  const entries = [
    { label: t`Products`, to: "/products" },
    { label: t`Open source`, to: "/open-source" },
    { label: t`Company`, to: "/company" },
    { label: t`Contact`, to: "/contact" },
  ]
  return (
    <header className={styles.header}>
      <NavLink className={styles.brand} to="/">
        Sebastian Software
      </NavLink>
      <nav aria-label={t`Main navigation`}>
        <ul className={styles.list}>
          {entries.map((entry) => (
            <li key={entry.to}>
              <NavLink className={styles.link} to={entry.to}>
                {entry.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
