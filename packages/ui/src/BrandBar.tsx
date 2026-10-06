import type { ReactElement } from "react"

import {
  getBrandBar,
  getLanguageLinks,
  type Locale,
  type SiteId,
} from "@sebastian-websites/web-core"

import * as styles from "./BrandBar.css.ts"

export type BrandBarProps = {
  readonly languageLabel: string
  readonly locale: Locale
  readonly path: string
  readonly site: SiteId
}

/**
 * The bar above every site's main navigation: both brands with their areas,
 * and the language switch. Brand and language names are not translated; the
 * caller passes the translated label of the language switch.
 *
 * @param props - The rendering site, its language, and the current path.
 * @returns Both brand groups and the language switch, as one row.
 */
export function BrandBar(props: BrandBarProps): ReactElement {
  const { languageLabel, locale, path, site } = props
  const groups = getBrandBar(site, locale)
  const languages = getLanguageLinks(site, locale, path)

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <nav aria-label="Sebastian" className={styles.groups}>
          {groups.map((group) => (
            <ul className={styles.list} key={group.brand}>
              {group.links.map((link, index) => (
                <li key={link.id}>
                  <a
                    aria-current={link.current ? "page" : undefined}
                    className={index === 0 ? `${styles.link} ${styles.brandLink}` : styles.link}
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </nav>
        <nav aria-label={languageLabel}>
          <ul className={styles.list}>
            {languages.map((language) => (
              <li key={language.locale}>
                <a
                  aria-current={language.current ? "true" : undefined}
                  className={styles.link}
                  href={language.href}
                  hrefLang={language.locale}
                  lang={language.locale}
                >
                  {language.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
