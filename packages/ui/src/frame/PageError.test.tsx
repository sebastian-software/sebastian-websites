import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { PageError } from "./PageError.tsx"

describe("PageError", () => {
  it("renders recovery without a router or catalog, with plain document links", () => {
    const view = renderToStaticMarkup(
      <PageError
        copy={{
          home: "Go to the home page",
          reload: "Reload page",
          text: "Check your connection and try again.",
          title: "This page couldn't be loaded.",
        }}
      />
    )
    const document = new DOMParser().parseFromString(view, "text/html")
    expect(document.querySelector('[role="alert"] h1')?.textContent).toBe(
      "This page couldn't be loaded."
    )
    expect(
      [...document.querySelectorAll("a")].map((link) => [
        link.getAttribute("href"),
        link.getAttribute("target"),
      ])
    ).toStrictEqual([
      ["", "_self"],
      ["/", "_self"],
    ])
    expect(document.querySelector("script")).toBeNull()
  })
})
