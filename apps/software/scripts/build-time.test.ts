import assert from "node:assert/strict"
import { test } from "node:test"

import { buildYear, resolveBuildTime } from "./build-time.ts"

test("the build time is normalized to UTC seconds", () => {
  assert.equal(resolveBuildTime("2026-12-01T09:00:00+01:00"), "2026-12-01T08:00:00Z")
  assert.equal(resolveBuildTime("2026-12-01T09:00:00.250Z"), "2026-12-01T09:00:00.250Z")
  assert.equal(
    resolveBuildTime(undefined, Date.parse("2026-11-08T12:34:56.789Z")),
    "2026-11-08T12:34:56Z"
  )
})

test("a build time without seconds or a time zone is refused", () => {
  assert.throws(() => resolveBuildTime("2026-12-01T09:00"), TypeError)
  assert.throws(() => resolveBuildTime("2026-12-01T09:00:00"), /RFC 3339 timestamp/v)
})

test("the footer year follows the Berlin calendar around New Year", () => {
  // 23:30 UTC on New Year's Eve is already 00:30 on January 1 in Berlin.
  assert.equal(buildYear("2026-12-31T23:30:00Z"), "2027")
  assert.equal(buildYear("2026-12-31T22:59:59Z"), "2026")
  assert.equal(buildYear("2027-01-01T00:30:00+01:00"), "2027")
  // Summer time: Berlin is two hours ahead.
  assert.equal(buildYear("2026-07-01T00:00:00Z"), "2026")
})
