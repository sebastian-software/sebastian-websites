# Website hosting on Bunny

Every push to `main` runs the `Deploy` workflow, which publishes each target that has a build
([ADR-0009](../adr/0009-delivery-model.md)). The scripts in `hosting/` own the whole chain and
need only `BUNNY_API_KEY` in GitHub Actions secrets.

## Targets

`hosting/targets.ts` derives the targets from the variant list in `packages/web-core`: one
storage and pull zone pair per variant, named like its `deploymentTarget`
(`sebastian-websites-software-en`), plus `sebastian-websites-brand`. Each target is reachable
on its origin host `https://<name>.b-cdn.net/`. A variant's canonical domain is attached only
once it is `productionActive`; until then the origin host is the place to look.

## What a deployment does

1. `provision.ts`: creates or reuses the storage zone (DE, replicated to SE and NY) and the
   pull zone (EU and US delivery, cookies off, query strings ignored), applies the two cache
   rules (hashed `assets/` immutable for a year, everything else purged on publish and kept
   five minutes in browsers), publishes the path-resolving middleware and links it, and
   attaches the canonical hostname with a free certificate when the variant is active.
2. `publish.ts`: uploads new and changed files by checksum, deletes files the build no longer
   contains, and purges the pull zone.
3. `verify.ts`: fetches the home page, one prerendered route with and without a trailing
   slash, a missing path, and one asset per CORS extension on the origin host.

The middleware (`middleware-logic.ts`, bundled by `bundle.ts`) resolves `/imprint` to
`imprint/index.html` on the storage zone and redirects `/imprint/` to `/imprint` permanently,
because prerendering writes directories and Bunny Storage serves files only.

## Running it

```bash
pnpm build
BUNNY_API_KEY=… pnpm deploy
```

Locally the key comes from 1Password; in CI from the secret. `pnpm hosting:check` runs the
type check, lint, and the tests against a fake Bunny account.

## Not yet covered

- Previews per pull request. The old Consulting repository gated them with an HMAC token on a
  shared preview zone; that pattern returns once the first site is live.
- Redirect rules of ADR-0010 beyond the trailing slash; they join the middleware with the
  first domain cutover.
