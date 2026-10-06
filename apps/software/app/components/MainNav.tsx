import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { button } from "@sebastian-websites/ui"
import { Link, NavLink } from "react-router"

import logo from "~/assets/logo-software.svg"

import * as styles from "./MainNav.css.ts"

/**
 * The site's own main navigation, below the brand bar: the wordmark, Products,
 * Open source, Company, and the one primary action.
 *
 * @returns The header with the logo, the main navigation, and the contact button.
 */
export function MainNav(): ReactElement {
  const entries = [
    { label: t`Products`, to: "/products" },
    { label: t`Open source`, to: "/open-source" },
    { label: t`Company`, to: "/company" },
  ]
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/">
          <img alt="Sebastian Software" className={styles.logo} height={28} src={logo} />
        </Link>
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
        <Link className={button.primary} to="/contact">
          {t`Contact`}
        </Link>
      </div>
    </header>
  )
}
