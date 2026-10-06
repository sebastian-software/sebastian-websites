# Extend the metrics service with a skills section and last-push dates

## Status

- Priority: P2
- Effort: S
- Risk: LOW
- Depends on: none
- Planned at: f007192, 2026-10-06
- Working state: clean

## Why this matters

[ADR-0005](../adr/0005-curated-lists-live-numbers.md) makes the metrics service the only
runtime data source of the Open Source and Skills sites. It already serves stars, releases,
and package numbers; it knows nothing about skills, and it says nothing about how alive a
project is.

## Current state

- Repository `sebastian-software/oss-metrics` (not checked out locally): a Bunny edge script
  that serves `GET https://metrics.sebastian-software.com/v1/metrics.json`, cached for an
  hour, with `github`, `crates`, and `npm` sections. GitHub entries cover public, non-archived,
  non-fork repositories carrying the `oss-project` topic.
- The skills repository `skills.sebastian-software.com` has six skills under `skills/*/` with
  a `SKILL.md` and a `references/*.md` folder each, and two instruction packs under
  `instructions/`. The old site validated its hero numbers (6 skills, 373 references, 2 packs)
  against these folders in CI (`scripts/validate-site.py`).

## Scope

In scope:

- A `skills` section: per skill its name, reference count, and last change; the number of
  instruction packs; read from the skills repository's `main` through the GitHub API on the
  same refresh cycle.
- `pushedAt` for every repository, so a site can show activity without a hand-maintained
  maturity field. Archived repositories stay out, like repositories without the topic: a site
  that still lists one gets no live numbers and notices through its nightly check.
- A README update; the additions are backward compatible, so the schema stays 1.

Out of scope:

- Any change to how sites consume the data; that is in `packages/web-core` (plan 02).
- Metrics for private products.

## Verification commands

| Purpose           | Command                                                                                                                                | Expected result       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Live schema       | `curl -s https://metrics.sebastian-software.com/v1/metrics.json \| jq '.schema, (.skills.skills \| length), .github.ferroni.pushedAt'` | `1`, `6`, an ISO date |
| Repository checks | the repository's own test and lint commands                                                                                            | exit 0                |

## Steps

### 1. Add the skills section

Read `skills/*/SKILL.md` and `skills/*/references/*.md` through the GitHub contents or tree
API, count, and emit per skill. Count `instructions/*.md` for the packs.

### 2. Add the last push

Add `pushedAt` to every repository and keep the existing fields unchanged.

### 3. Document

Describe both additions in the README and deploy.

## Done criteria

- [ ] The live document carries `skills` with six entries whose reference counts match the
      repository.
- [ ] Every GitHub entry carries `pushedAt`.
- [ ] Existing consumers (the old Open Source site's proxy is independent of this) are
      unaffected.

## Stop conditions

- Stop if the GitHub API budget of the hourly refresh would be exceeded by reading the skills
  tree; batch through one tree call per refresh instead of per-file requests.

## Maintenance and review focus

The service is the single place that talks to GitHub for two sites. Reviewers should check
that a failed upstream call degrades one section (`sources.skills: "error"`) rather than the
whole document.
