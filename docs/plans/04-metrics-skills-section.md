# Extend the metrics service with a skills section and repository status

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
and package numbers; it knows nothing about skills, and it omits archived repositories, so a
site cannot tell "archived" from "not listed".

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
- Repository status: include archived `oss-project` repositories with an `archived: true`
  flag, and carry `pushedAt` for every repository, so a site can derive "active" and
  "archived" without a hand-maintained maturity field.
- A schema version bump and a README update.

Out of scope:

- Any change to how sites consume the data; that is in `packages/web-core` (plan 02).
- Metrics for private products.

## Verification commands

| Purpose | Command | Expected result |
| --- | --- | --- |
| Live schema | `curl -s https://metrics.sebastian-software.com/v1/metrics.json \| jq '.schema, (.skills \| length), .github.ferroni.archived'` | new schema number, `6`, `false` |
| Repository checks | the repository's own test and lint commands | exit 0 |

## Steps

### 1. Add the skills section

Read `skills/*/SKILL.md` and `skills/*/references/*.md` through the GitHub contents or tree
API, count, and emit per skill. Count `instructions/*.md` for the packs.

### 2. Add status fields

Include archived repositories with the topic, add `archived` and `pushedAt`, and keep the
existing fields unchanged.

### 3. Bump the schema and document

Raise `schema`, document both additions in the README, and deploy.

## Done criteria

- [ ] The live document carries `skills` with six entries whose reference counts match the
      repository.
- [ ] Every GitHub entry carries `archived` and `pushedAt`.
- [ ] Existing consumers (the old Open Source site's proxy is independent of this) are
      unaffected.

## Stop conditions

- Stop if the GitHub API budget of the hourly refresh would be exceeded by reading the skills
  tree; batch through one tree call per refresh instead of per-file requests.

## Maintenance and review focus

The service is the single place that talks to GitHub for two sites. Reviewers should check
that a failed upstream call degrades one section (`sources.skills: "error"`) rather than the
whole document.
