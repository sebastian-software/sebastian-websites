import type { SiteFrame } from "@sebastian-websites/web-core"
import type { ReactElement } from "react"

import type { FrameCopy } from "./copy.ts"

import { Arrow } from "../editorial/Arrow.tsx"
import { visuallyHidden } from "../editorial/editorial.css.ts"
import { BrandLogo } from "./BrandLogo.tsx"
import * as styles from "./SiteHeader.css.ts"

export type SiteHeaderProps = {
  readonly copy: FrameCopy
  readonly frame: SiteFrame
}

/**
 * The floating header: the current brand's only logo, its local navigation and
 * language switch, and one small outward capsule to the other brand.
 *
 * @param props - The resolved frame of the page and the translated labels.
 * @returns The page header.
 */
export function SiteHeader(props: SiteHeaderProps): ReactElement {
  const { copy, frame } = props
  return (
    <header className={styles.area}>
      <a className={styles.skip} href="#main">
        {copy.header.skip}
      </a>
      <div className={styles.shell}>
        <a className={styles.home} href={frame.home}>
          <BrandLogo
            alt={copy.brandNames[frame.brand]}
            brand={frame.brand}
            className={styles.logo}
            height={32}
          />
        </a>
        <div className={styles.controls}>
          <nav aria-label={copy.header.navigation}>
            <ul className={styles.list}>
              {frame.navigation.map((link) => (
                <li key={link.id}>
                  <a
                    aria-current={link.current ? "page" : undefined}
                    className={styles.link}
                    href={link.href}
                  >
                    {copy.links[link.id]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <span aria-hidden="true" className={styles.separator} />
          <nav aria-label={copy.header.language}>
            <ul className={styles.languages}>
              {frame.languages.map((language, index) => (
                <li key={language.locale}>
                  {index > 0 ? (
                    <span aria-hidden="true" className={styles.slash}>
                      /{" "}
                    </span>
                  ) : null}
                  <a
                    aria-current={language.current ? "true" : undefined}
                    className={styles.language}
                    href={language.href}
                    hrefLang={language.locale}
                    lang={language.locale}
                  >
                    <span aria-hidden="true">{language.locale.toUpperCase()}</span>
                    <span className={visuallyHidden}>{language.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <span aria-hidden="true" className={styles.separator} />
          <a className={styles.outbound} href={frame.outbound.href}>
            {copy.header.outbound[frame.outbound.brand]}
            <Arrow className={styles.outboundArrow} direction="outward" />
          </a>
        </div>
      </div>
    </header>
  )
}
