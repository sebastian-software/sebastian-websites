import type { SiteFrame } from "@sebastian-websites/web-core"

import { Globe } from "lucide-react"
import { type ReactElement, useEffect, useId, useRef } from "react"
import { useLocation } from "react-router"

import type { FrameCopy } from "./copy.ts"

import { Arrow } from "../editorial/Arrow.tsx"
import { visuallyHidden } from "../editorial/editorial.css.ts"
import { SiteLink } from "../SiteLink.tsx"
import { BrandLogo } from "./BrandLogo.tsx"
import * as styles from "./SiteHeader.css.ts"

export type SiteHeaderProps = {
  readonly copy: FrameCopy
  readonly frame: SiteFrame
}

/**
 * The floating header: the current brand's only logo, its local navigation and
 * language switch, and one small outward capsule to the other brand. On compact
 * screens the controls become a popover menu behind one button; the markup is
 * the same, so there is a single navigation landmark on every layout.
 *
 * @param props - The resolved frame of the page and the translated labels.
 * @returns The page header.
 */
export function SiteHeader(props: SiteHeaderProps): ReactElement {
  const { copy, frame } = props
  const menuId = useId()
  const menuRef = useRef<HTMLDivElement>(null)
  const { key } = useLocation()
  useEffect(() => {
    if (menuRef.current?.matches(":popover-open")) menuRef.current.hidePopover()
  }, [key])
  return (
    <header className={styles.area} data-brand={frame.brand}>
      <a className={styles.skip} href="#main">
        {copy.header.skip}
      </a>
      <div className={styles.shell}>
        <SiteLink className={styles.home} href={frame.home}>
          <BrandLogo
            alt={copy.brandNames[frame.brand]}
            brand={frame.brand}
            className={styles.logo}
            height={32}
          />
        </SiteLink>
        <button className={styles.menuButton} popoverTarget={menuId} type="button">
          <svg aria-hidden="true" className={styles.menuIcon} viewBox="0 0 24 24">
            <path d="M4 8h16M4 16h16" />
          </svg>
          <span className={visuallyHidden}>{copy.header.menu}</span>
        </button>
        <div className={styles.controls} id={menuId} popover="auto" ref={menuRef}>
          <nav aria-label={copy.header.navigation}>
            <ul className={styles.list}>
              {frame.navigation.map((link) => (
                <li key={link.id}>
                  <SiteLink
                    aria-current={link.current ? "page" : undefined}
                    className={styles.link}
                    href={link.href}
                  >
                    {copy.links[link.id]}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </nav>
          <span aria-hidden="true" className={styles.separator} />
          <nav aria-label={copy.header.language}>
            <ul className={styles.languages}>
              {frame.languages
                .filter((language) => frame.brand !== "consulting" || !language.current)
                .map((language, index) => (
                  <li key={language.locale}>
                    {index > 0 ? (
                      <span aria-hidden="true" className={styles.slash}>
                        /{" "}
                      </span>
                    ) : null}
                    <a
                      aria-current={language.current ? "true" : undefined}
                      className={
                        frame.brand === "consulting" ? styles.languageGlobe : styles.language
                      }
                      href={language.href}
                      hrefLang={language.locale}
                      lang={language.locale}
                      title={frame.brand === "consulting" ? language.label : undefined}
                    >
                      {frame.brand === "consulting" ? (
                        <Globe aria-hidden="true" className={styles.globe} strokeWidth={1.75} />
                      ) : (
                        <span aria-hidden="true">{language.locale.toUpperCase()}</span>
                      )}
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
