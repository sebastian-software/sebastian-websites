import { getVariant } from "@sebastian-websites/web-core"

/** The variant this build renders; fixed at build time. */
export const variant = getVariant(__SITE_VARIANT__)
