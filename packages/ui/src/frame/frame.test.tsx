import { getSiteFrame } from "@sebastian-websites/web-core"
import { act } from "react"
import { flushSync } from "react-dom"
import { createRoot } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import type { FrameCopy } from "./copy.ts"

import { Newsletter } from "./Newsletter.tsx"
import { PageEnding } from "./PageEnding.tsx"
import { SiteHeader } from "./SiteHeader.tsx"

const copy: FrameCopy = {
  brandNames: { consulting: "Sebastian Consulting", software: "Sebastian Software" },
  company: {
    city: "Mainz",
    country: "Germany",
    name: "Sebastian Software GmbH",
    postalCode: "55128",
    street: "Dalheimer Straße 12",
  },
  copyright: "© 2026 Sebastian Software GmbH",
  footer: { index: "Site index", legal: "Legal", profiles: "Company profiles" },
  header: {
    language: "Language",
    menu: "Menu",
    navigation: "Main navigation",
    outbound: { consulting: "Our agency", software: "Our software" },
    skip: "Skip to content",
  },
  invitation: {
    consulting: {
      action: "Meet Sebastian/Consulting",
      heading: "Need a clearer direction for your software?",
      illustrationAlt: "A road",
      text: "Our agency helps teams.",
    },
    software: {
      action: "Discover Sebastian/Software",
      heading: "See what we build beyond consulting.",
      illustrationAlt: "A calendar",
      text: "We build products.",
    },
  },
  links: {
    booking: "Book an intro call",
    company: "Company",
    contact: "Contact",
    imprint: "Imprint",
    opensource: "Open Source",
    privacy: "Privacy",
    products: "Products",
    profiles: "Profiles",
    services: "Services",
  },
  newsletter: {
    action: "Subscribe",
    description: "Insights into our work.",
    emailLabel: "Email address",
    failure: "The sign-up did not go through.",
    invalid: "Please enter a complete email address.",
    pending: "Signing you up…",
    success: "Almost done.",
    title: "Newsletter",
    unavailable: "Sign-up opens soon.",
  },
  notFound: {
    eyebrow: "Error 404",
    home: "Home page",
    pageTitle: "Page not found",
    text: "These pages lead on:",
    title: "This page does not exist.",
  },
  profiles: { github: "GitHub", linkedin: "LinkedIn" },
}

function parse(markup: string): Document {
  return new DOMParser().parseFromString(markup, "text/html")
}

const texts = (elements: Iterable<Element>): Array<null | string> =>
  [...elements].map((element) => element.textContent)

describe("SiteHeader", () => {
  it("shows one current logo, local links, the language switch, and a plain outward link", () => {
    const frame = getSiteFrame("software", "de", "/company")
    const header = parse(renderToStaticMarkup(<SiteHeader copy={copy} frame={frame} />))
    const logos = header.querySelectorAll("img")
    expect(logos).toHaveLength(1)
    expect([...logos].at(0)?.getAttribute("alt")).toBe("Sebastian Software")
    expect(texts(header.querySelectorAll('nav[aria-label="Main navigation"] a'))).toStrictEqual([
      "Products",
      "Open Source",
    ])
    expect(header.querySelector("a")?.getAttribute("href")).toBe("#main")
    const languages = header.querySelectorAll('nav[aria-label="Language"] a')
    expect([...languages].map((link) => link.getAttribute("href"))).toStrictEqual([
      "https://sebastian-software.com/company",
      "https://sebastian-software.de/company",
    ])
    expect([...languages].at(1)?.getAttribute("aria-current")).toBe("true")
    const outbound = [...header.querySelectorAll("a")].at(-1)
    expect(outbound?.textContent).toBe("Our agency")
    expect(outbound?.getAttribute("href")).toBe("https://sebastian-consulting.de/")
    expect(outbound?.querySelector("img")).toBeNull()
  })

  it("opens the same controls as a popover menu on compact screens", () => {
    const frame = getSiteFrame("consulting", "en", "/")
    const header = parse(renderToStaticMarkup(<SiteHeader copy={copy} frame={frame} />))
    const button = header.querySelector("button[popovertarget]")
    expect(button?.getAttribute("type")).toBe("button")
    expect(button?.textContent).toBe("Menu")
    const menu = header.querySelector(`[id="${String(button?.getAttribute("popovertarget"))}"]`)
    expect(menu?.getAttribute("popover")).toBe("auto")
    expect(menu?.querySelectorAll('nav[aria-label="Main navigation"]')).toHaveLength(1)
    expect(header.querySelectorAll('nav[aria-label="Main navigation"]')).toHaveLength(1)
  })

  it("gives Consulting its own logo, navigation, and the way to Software", () => {
    const frame = getSiteFrame("consulting", "en", "/")
    const header = parse(renderToStaticMarkup(<SiteHeader copy={copy} frame={frame} />))
    expect(header.querySelector("img")?.getAttribute("alt")).toBe("Sebastian Consulting")
    expect(texts(header.querySelectorAll('nav[aria-label="Main navigation"] a'))).toStrictEqual([
      "Services",
      "Profiles",
    ])
    expect([...header.querySelectorAll("a")].at(-1)?.getAttribute("href")).toBe(
      "https://sebastian-software.com/"
    )
  })
})

describe("PageEnding", () => {
  const frame = getSiteFrame("opensource", "en", "/")
  const ending = parse(renderToStaticMarkup(<PageEnding copy={copy} frame={frame} />))

  it("orders the newsletter, the invitation to the other brand, and the current footer", () => {
    const regions = [...ending.querySelectorAll("body > div > section, body > footer")]
    expect(regions.map((region) => region.tagName)).toStrictEqual(["SECTION", "SECTION", "FOOTER"])
    expect(regions.at(0)?.querySelector("h2")?.textContent).toBe("Newsletter")
    expect(regions.at(1)?.querySelector("h2")?.textContent).toBe(
      "Need a clearer direction for your software?"
    )
    const invitation = regions.at(1)
    expect(invitation?.querySelector("a")?.getAttribute("href")).toBe(
      "https://sebastian-consulting.com/"
    )
  })

  it("keeps the footer to the current brand, company details, profiles, and legal links", () => {
    const footer = ending.querySelector("footer")!
    expect(texts(footer.querySelectorAll("img"))).toHaveLength(1)
    expect(footer.querySelector("img")?.getAttribute("alt")).toBe("Sebastian Software")
    expect(footer.querySelector("form")).toBeNull()
    expect(footer.textContent).not.toContain("Sebastian Consulting")
    expect(footer.querySelector("address")?.textContent).toContain("Dalheimer Straße 12")
    expect(
      [...footer.querySelectorAll('ul[aria-label="Company profiles"] a')].map((link) =>
        link.getAttribute("href")
      )
    ).toStrictEqual([
      "https://www.linkedin.com/company/sebastian-software/",
      "https://github.com/sebastian-software",
    ])
    expect(texts(footer.querySelectorAll('nav[aria-label="Legal"] a'))).toStrictEqual([
      "Imprint",
      "Privacy",
      "Contact",
    ])
  })
})

describe("Newsletter", () => {
  let container: HTMLDivElement | undefined

  afterEach(() => {
    container?.remove()
    container = undefined
  })

  function render(subscribe?: Parameters<typeof Newsletter>[0]["subscribe"]): {
    readonly status: () => string
    readonly submit: (email: string) => Promise<void>
  } {
    Reflect.set(globalThis, "IS_REACT_ACT_ENVIRONMENT", true)
    const host = document.createElement("div")
    container = host
    document.body.append(host)
    const root = createRoot(host)
    // eslint-disable-next-line react/no-flush-sync -- the test queries the form right after mounting
    flushSync(() => {
      root.render(<Newsletter copy={copy.newsletter} subscribe={subscribe} />)
    })
    const button = host.querySelector("button")!
    const input = host.querySelector("input")!
    return {
      status: () => host.querySelector('[role="status"]')?.textContent ?? "",
      async submit(email) {
        input.value = email
        await act(async () => {
          button.click()
          // Let the form action settle, as a browser would between events.
          await new Promise((resolve) => {
            setTimeout(resolve, 0)
          })
        })
      },
    }
  }

  it("asks for a complete address without calling the service", async () => {
    const subscribe = vi.fn<() => Promise<"success">>().mockResolvedValue("success")
    const view = render(subscribe)
    await view.submit("name@")
    expect(view.status()).toBe("Please enter a complete email address.")
    expect(container?.querySelector("input")?.getAttribute("aria-invalid")).toBe("true")
    expect(subscribe).not.toHaveBeenCalled()
  })

  it("announces success and failure from the service", async () => {
    const view = render(
      vi
        .fn<() => Promise<"success">>()
        .mockResolvedValueOnce("success")
        .mockRejectedValueOnce(new Error("network"))
    )
    await view.submit("name@example.com")
    expect(view.status()).toBe("Almost done.")
    await view.submit("name@example.com")
    expect(view.status()).toBe("The sign-up did not go through.")
  })

  it("never claims a subscription while no service is connected", async () => {
    const view = render()
    await view.submit("name@example.com")
    expect(view.status()).toBe("Sign-up opens soon.")
  })
})
