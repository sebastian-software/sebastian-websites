import assert from "node:assert/strict"
import { describe, test } from "vitest"

import { publicationDate } from "./metrics-date"

const now = Date.parse("2026-10-19T12:00:00Z")

describe("publication dates", () => {
  test("recent publications use localized UTC calendar days, including the 99-day boundary", () => {
    assert.equal(publicationDate("2026-10-19T00:00:00Z", now, "en").label, "today")
    assert.equal(publicationDate("2026-10-18T23:59:59Z", now, "de").label, "gestern")
    assert.equal(publicationDate("2026-10-16T12:00:00Z", now, "de").label, "vor 3 Tagen")
    assert.equal(publicationDate("2026-07-12T00:00:00Z", now, "en").label, "99 days ago")
  })

  test("100-day-old and future dates stay absolute, with the exact UTC timestamp retained", () => {
    const old = publicationDate("2026-07-11T12:00:00Z", now, "en")
    assert.equal(old.label, "Jul 11, 2026")
    assert.ok(old.exact.includes("12:00"))
    assert.ok(old.exact.endsWith(" UTC"))
    assert.equal(publicationDate("2026-10-20T00:00:00Z", now, "de").label, "20.10.2026")
  })
})
