export type Locale = "de" | "en"
export type Consultant = "fastner" | "werner"

/** A statement a client or colleague gave for publication on the company's sites. */
export type Testimonial = {
  /** Which consultant the statement is about; testimonials belong to Consulting. */
  readonly about: Consultant
  readonly author: string
  readonly company: null | string
  /** ISO date of the statement. */
  readonly date: string
  /** Stable id, taken from the old site's detail page. */
  readonly id: string
  readonly quote: Readonly<Record<Locale, string>>
  readonly role: Readonly<Record<Locale, string>>
}

/** A client whose logo the old site showed; the logo file itself is kept outside Git. */
export type Client = {
  /** The old site's logo URL, kept until the logos are republished. */
  readonly legacyLogo: string
  readonly name: string
}
