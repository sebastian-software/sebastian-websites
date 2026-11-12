# Blog fixtures

Test posts for `pnpm --filter @sebastian-websites/blog check:fixtures`. They are never
published: only `scripts/check-fixtures.ts` builds them, into a scratch directory.

- `posts/` holds a translated pair, a German-only post, an English-only MDX post with plain
  prose, an English draft, and a pair scheduled for December 1, 2026. The check builds it
  before and after that date, and once without any post for the empty state. The English
  pair has a framed cover and a body image, both `photo.png`, a generated test pattern.
- `authored-counterpart/` holds one invalid post; its build must fail before any variant
  is built.
