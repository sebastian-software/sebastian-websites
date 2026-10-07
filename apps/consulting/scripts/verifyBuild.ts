import { getVariant, isVariantId } from "@sebastian-websites/web-core"
import { resolve } from "node:path"
import { pathToFileURL } from "node:url"

import { verifyProfileDownloadNames, verifyVariantProfileArtifacts } from "./verifyProfileArtifacts"

/**
 * Checks one built Consulting variant: every profile PDF exists under its
 * stable name and the profile pages offer it as a download.
 *
 * @param variantId - The variant whose build output is checked.
 */
export async function verifyBuild(variantId: string): Promise<void> {
  if (!isVariantId(variantId) || getVariant(variantId).site !== "consulting") {
    throw new Error(`Unknown Consulting variant ${JSON.stringify(variantId)}.`)
  }
  const { locale } = getVariant(variantId)
  const output = resolve(import.meta.dirname, "..", "build", variantId, "client")
  await verifyVariantProfileArtifacts(output, locale)
  await verifyProfileDownloadNames(output, locale)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  try {
    await verifyBuild(process.env.SITE_VARIANT ?? "")
    console.log("Consulting artifacts verified.")
  } catch (error: unknown) {
    console.error("Consulting artifact verification failed:", error)
    process.exit(1)
  }
}
