import type { ComponentPropsWithRef } from "ardo/react"

import { act } from "ardo/react"
import { createRoot } from "ardo/react-dom/client"
import { describe, expect, it } from "vitest"

import { SiteLink } from "./SiteLink.tsx"

async function clickLink(props: ComponentPropsWithRef<"a">): Promise<{ intercepted: boolean }> {
  Reflect.set(globalThis, "IS_REACT_ACT_ENVIRONMENT", true)
  const host = document.createElement("div")
  document.body.append(host)
  const root = createRoot(host)
  // eslint-disable-next-line testing-library/no-unnecessary-act -- This test uses React DOM directly, without Testing Library.
  await act(async () => {
    root.render(<SiteLink {...props}>Destination</SiteLink>)
    await Promise.resolve()
  })
  let intercepted = false
  // Observe React's decision before suppressing native navigation in the test.
  const observe = (event: MouseEvent): void => {
    intercepted = event.defaultPrevented
    event.preventDefault()
  }
  document.addEventListener("click", observe)
  await act(async () => {
    host.querySelector("a")!.click()
    await Promise.resolve()
  })
  document.removeEventListener("click", observe)
  await act(async () => {
    root.unmount()
    await Promise.resolve()
  })
  host.remove()
  return { intercepted }
}

describe("SiteLink", () => {
  it("leaves local navigation to the browser for a static site", async () => {
    expect(await clickLink({ href: "/products" })).toStrictEqual({
      intercepted: false,
    })
  })

  it.each([
    { href: "https://example.com/products" },
    { href: "//example.com/products" },
    { href: "mailto:hello@example.com" },
    { href: "#projects" },
    { download: "", href: "/profile.pdf" },
    { download: true, href: "/profile.pdf" },
    { href: "/products", hrefLang: "de" },
    { href: "/products", target: "_blank" },
  ])("preserves native behavior for %j", async (props) => {
    expect(await clickLink(props)).toStrictEqual({ intercepted: false })
  })
})
