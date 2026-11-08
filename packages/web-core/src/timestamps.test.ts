import { describe, expect, it } from "vitest"

import { isZonedTimestamp } from "./timestamps.ts"

describe("zoned timestamps", () => {
  it.each(["2026-11-17T12:00:00Z", "2026-11-17T12:00:00.123Z", "2026-11-17T13:00:00+01:00"])(
    "accepts %s",
    (value) => {
      expect(isZonedTimestamp(value)).toBe(true)
    }
  )

  it.each([
    "2026-11-17T12:00:00",
    "2026-11-17T12:00Z",
    "2026-11-17",
    "2026-11-17 12:00:00Z",
    "2026-13-17T12:00:00Z",
    "Tue, 17 Nov 2026 12:00:00 GMT",
    "",
  ])("rejects %s", (value) => {
    expect(isZonedTimestamp(value)).toBe(false)
  })
})
