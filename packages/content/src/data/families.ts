/**
 * The curated membership of the two brand families (ADR-0005). Live numbers
 * come from the metrics service; this list says which repositories count.
 */
export const FAMILIES = {
  effective: ["effective-flow", "effective-icon"],
  ferramenta: {
    applications: ["ardo", "dalo", "palamedes"],
    engines: ["ferralk", "ferriki", "ferrocat", "ferrolex", "ferromark", "ferroni", "ferrugo"],
  },
} as const

/** Every repository that belongs to the Ferramenta family. */
export const FERRAMENTA_REPOSITORIES: readonly string[] = [
  ...FAMILIES.ferramenta.engines,
  ...FAMILIES.ferramenta.applications,
]
