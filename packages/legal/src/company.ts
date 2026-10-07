import type { LegalOperator } from "./model"

/**
 * The legal entity behind every site. Each site adds its own brand and
 * contact; the register data is the same everywhere.
 */
export const COMPANY = {
  address: {
    city: "Mainz",
    countryCode: "DE",
    postalCode: "55128",
    street: "Dalheimer Straße 12",
  },
  editorialResponsible: "Sebastian Fastner",
  fax: "+49-6131-9729-831",
  managingDirectors: ["Sebastian Fastner", "Sebastian Werner"],
  name: "Sebastian Software GmbH",
  phone: "+49-6131-9729-830",
  phoneHref: "tel:+4961319729830",
  registerCourt: "Amtsgericht Mainz",
  registerNumber: "HRB 45232",
  vatId: "DE295226721",
} as const

/** The photographer of the current business photos (the 2024 shoot). */
export const BUSINESS_PHOTOGRAPHER = "Sylviane Brauer"

export type SiteOperatorOptions = {
  readonly brand: string
  readonly email: string
}

/**
 * Builds the operator of one site from the shared company data.
 *
 * @param options - The site's brand name and contact email.
 * @returns The operator as the imprint and privacy policy expect it.
 */
export function siteOperator(options: SiteOperatorOptions): LegalOperator {
  return {
    address: COMPANY.address,
    brand: options.brand,
    contact: {
      email: options.email,
      fax: COMPANY.fax,
      phone: COMPANY.phone,
      phoneHref: COMPANY.phoneHref,
    },
    editorialResponsible: COMPANY.editorialResponsible,
    managingDirectors: COMPANY.managingDirectors,
    name: COMPANY.name,
    registerCourt: COMPANY.registerCourt,
    registerNumber: COMPANY.registerNumber,
    vatId: COMPANY.vatId,
  }
}
