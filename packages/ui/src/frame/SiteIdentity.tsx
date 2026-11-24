import type { ReactElement } from "ardo/react"

import { COMPANY } from "@sebastian-websites/legal"
import {
  COMPANY_PROFILES,
  CONSULTING_BRAND_ID,
  getSiteOrigin,
  jsonLd,
  ORGANIZATION_ID,
  type VariantDefinition,
} from "@sebastian-websites/web-core"

import softwareLogo from "../assets/logo-software.svg"

/**
 * The legal publisher and the current language's website, using public footer facts.
 * @param props - The website and language being rendered.
 * @param props.variant - The configured canonical origin and site.
 * @returns Initial-HTML Organization and WebSite identities.
 */
export function SiteIdentity({ variant }: { readonly variant: VariantDefinition }): ReactElement {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@id": ORGANIZATION_ID,
        "@type": "Organization",
        address: {
          "@type": "PostalAddress",
          addressCountry: COMPANY.address.countryCode,
          addressLocality: COMPANY.address.city,
          postalCode: COMPANY.address.postalCode,
          streetAddress: COMPANY.address.street,
        },
        brand: { "@id": CONSULTING_BRAND_ID, "@type": "Brand", name: "Sebastian Consulting" },
        legalName: COMPANY.name,
        logo: new URL(softwareLogo, getSiteOrigin("software", "de")).href,
        name: "Sebastian Software",
        sameAs: COMPANY_PROFILES.map((profile) => profile.href),
        telephone: COMPANY.phone,
        url: `${getSiteOrigin("software", "de")}/`,
      },
      {
        "@id": `${variant.canonicalOrigin}/#website`,
        "@type": "WebSite",
        inLanguage: variant.locale,
        publisher: { "@id": ORGANIZATION_ID },
        url: `${variant.canonicalOrigin}/`,
      },
    ],
  }
  return <script type="application/ld+json">{jsonLd(graph)}</script>
}
