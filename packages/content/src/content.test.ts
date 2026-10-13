import { describe, expect, it } from "vitest"

import { clients, testimonials } from "./index.ts"

describe("cleared content", () => {
  it("carries every testimonial of the old site in both languages", () => {
    expect(testimonials).toHaveLength(56)
    for (const testimonial of testimonials) {
      expect(testimonial.quote.de.length).toBeGreaterThan(20)
      expect(testimonial.quote.en.length).toBeGreaterThan(20)
      expect(testimonial.date).toMatch(/^\d{4}-\d{2}-\d{2}$/v)
    }
    expect(new Set(testimonials.map((entry) => entry.id)).size).toBe(56)
  })

  it("lists the 27 client logos selected for public use", () => {
    expect(clients).toHaveLength(27)
    expect(new Set(clients.map((client) => client.name)).size).toBe(27)
  })
})
