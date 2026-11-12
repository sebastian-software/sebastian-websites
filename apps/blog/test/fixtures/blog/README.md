# Blog fixtures

Test posts for `pnpm --filter @sebastian-websites/blog check:fixtures`. They are never
published: only `scripts/check-fixtures.ts` builds them, into a scratch directory.

- `posts/` holds a translated pair, a German-only post, an English-only MDX post with plain
  prose, an English draft, and a pair scheduled for December 1, 2026. The check builds it
  before and after that date, and once without any post for the empty state.
- `raster-image/` and `authored-counterpart/` hold one invalid post each; their builds
  must fail before any variant is built.
