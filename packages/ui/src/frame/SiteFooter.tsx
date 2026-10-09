import type { SiteFrame } from "@sebastian-websites/web-core"
import type { ReactElement } from "react"

import { COMPANY_PROFILES } from "@sebastian-websites/web-core"

import type { FrameCopy } from "./copy.ts"

import { BrandLogo } from "./BrandLogo.tsx"
import * as styles from "./PageEnding.css.ts"
import { SocialGlyph } from "./SocialGlyph.tsx"

export type SiteFooterProps = {
  readonly copy: FrameCopy
  readonly frame: SiteFrame
}

/**
 * The current site's footer: its complete logo and local index, the registered
 * company details, the company profiles, and the legal baseline. It carries
 * neither the newsletter nor the other brand.
 *
 * @param props - The resolved frame of the page and the translated labels.
 * @returns The page footer.
 */
export function SiteFooter(props: SiteFooterProps): ReactElement {
  const { copy, frame } = props
  const { company } = copy
  return (
    <footer className={styles.footer}>
      <div className={styles.panel}>
        <div className={styles.footerTop}>
          <div>
            <a className={styles.footerHome} href={frame.home}>
              <BrandLogo
                alt={copy.brandNames[frame.brand]}
                brand={frame.brand}
                className={styles.footerLogo}
                height={88}
              />
            </a>
            <address className={styles.address}>
              {company.name}
              <br />
              {company.street}
              <br />
              {company.postalCode} {company.city}
              <br />
              {company.country}
              <br />
              <a className={styles.plainLink} href={`mailto:${frame.email}`}>
                {frame.email}
              </a>
            </address>
          </div>
          <div className={styles.aside}>
            <nav aria-label={copy.footer.index}>
              <ul className={styles.index}>
                {frame.index.map((link) => (
                  <li key={link.id}>
                    <a
                      aria-current={link.current ? "page" : undefined}
                      className={styles.plainLink}
                      href={link.href}
                    >
                      {copy.links[link.id]}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <ul aria-label={copy.footer.profiles} className={styles.profiles}>
              {COMPANY_PROFILES.map((profile) => (
                <li key={profile.id}>
                  <a className={styles.profile} href={profile.href} rel="me">
                    <SocialGlyph className={styles.glyph} profile={profile.id} />
                    {copy.profiles[profile.id]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.baseline}>
          <p>{copy.copyright}</p>
          <nav aria-label={copy.footer.legal}>
            <ul className={styles.legal}>
              {frame.legal.map((link) => (
                <li key={link.id}>
                  <a className={styles.plainLink} href={link.href}>
                    {copy.links[link.id]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
