# Spike: Bunny Edge Script → PlanetScale Postgres

Throwaway code. It answers one question for the analytics collector: can a
Bunny Edge Script write to PlanetScale Postgres directly, or does the write
path need a buffer? Nothing here is part of the websites or their deployment.

- `probe.mjs` runs on Bunny as a standalone Edge Script. Each `?mode=` is one
  check: visible request headers, raw TCP, a postgres.js round trip, an insert
  that is not awaited, an unreachable database, and a comparison write to Bunny
  Database over libSQL's HTTP API.
- `run.mjs` bundles the probe, creates the script through the Bunny API, sets
  its secrets, calls every mode, prints a result table, drops the spike table,
  and deletes the script with its pull zone.
- `.github/workflows/spike-edge-postgres.yml` runs it on pushes to the spike
  branch.

## Secrets

| GitHub secret        | Required | Value                                                                                          |
| -------------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `BUNNY_API_KEY`      | yes      | Already used by the deployment.                                                                |
| `SPIKE_DATABASE_URL` | yes      | `postgres://…:6432/…` of a throwaway role on a test database or branch, on the PgBouncer port. |
| `SPIKE_LIBSQL_URL`   | no       | URL of a throwaway Bunny Database; without it the comparison is skipped.                       |
| `SPIKE_LIBSQL_TOKEN` | no       | Access token of that database.                                                                 |

The role needs `CREATE` in its schema: the probe creates and drops one table,
`analytics_spike`.

The repository is public and so is its workflow log. The probe and the runner
replace credentials, hosts, and IP addresses in everything they print.

## Limits

GitHub's runners call the script from outside the EU, so the script runs on a
non-EU edge and the measured latency to Frankfurt is an upper bound.
