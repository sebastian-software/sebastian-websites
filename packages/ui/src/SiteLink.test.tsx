import type { ComponentPropsWithRef } from "react"

import { act } from "react"
import { createRoot } from "react-dom/client"
import { MemoryRouter, useLocation } from "react-router"
import { describe, expect, it } from "vitest"

import { SiteLink } from "./SiteLink.tsx"

function CurrentPath(): React.JSX.Element {
  return <output>{useLocation().pathname}</output>
}

async function clickLink(
  props: ComponentPropsWithRef<"a">
): Promise<{ intercepted: boolean; path: string }> {
  Reflect.set(globalThis, "IS_REACT_ACT_ENVIRONMENT", true)
  const host = document.createElement("div")
  document.body.append(host)
  const root = createRoot(host)
  // eslint-disable-next-line testing-library/no-unnecessary-act -- This test uses React DOM directly, without Testing Library.
  await act(async () => {
    root.render(
      <MemoryRouter>
        <SiteLink {...props}>Destination</SiteLink>
        <CurrentPath />
      </MemoryRouter>
    )
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
  const path = host.querySelector("output")!.textContent
  document.removeEventListener("click", observe)
  await act(async () => {
    root.unmount()
    await Promise.resolve()
  })
  host.remove()
  return { intercepted, path }
}

describe("SiteLink", () => {
  it("changes a local page through the router", async () => {
    expect(await clickLink({ href: "/products" })).toStrictEqual({
      intercepted: true,
      path: "/products",
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
    expect(await clickLink(props)).toStrictEqual({ intercepted: false, path: "/" })
  })
})
