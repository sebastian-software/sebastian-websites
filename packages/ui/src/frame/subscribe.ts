/** The outcome of one sign-up attempt. */
export type NewsletterStatus = "failure" | "invalid" | "success" | "unavailable"

/** Sends an address to the newsletter service and reports the outcome. */
export type SubscribeAction = (email: string) => Promise<Exclude<NewsletterStatus, "invalid">>

/**
 * The stand-in until a newsletter service is chosen: it never claims a
 * subscription and tells visitors that sign-up has not opened yet.
 *
 * @returns Always `unavailable`.
 */
export async function subscribeUnavailable(): Promise<"unavailable"> {
  // Settle asynchronously, as a real request would, so the pending state is real.
  await Promise.resolve()
  return "unavailable"
}
