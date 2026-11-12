# Tech blog

Ardo renders the German and English tech blog from the posts in `content/posts/<locale>/`,
through Ardo's publication feature, plus a home page and the legal pages. The site shares the
Software brand's frame, legal documents, and language links. German copy addresses readers
with „du“.

Run these commands from the repository root:

```sh
pnpm --filter @sebastian-websites/blog dev
pnpm --filter @sebastian-websites/blog build
pnpm --filter @sebastian-websites/blog check:browser
```

Development defaults to English; use `pnpm --filter @sebastian-websites/blog dev blog-de` for
German. The build writes `build/blog-de/client` and `build/blog-en/client` with one shared
build time, which decides which posts are due.

- [ADR-0022](../../docs/adr/0022-tech-blog-as-its-own-site.md): why the blog is its own site.
- [ADR-0021](../../docs/adr/0021-blog-on-the-software-website.md): how the publication works.
- [Blog publishing guide](../../docs/operations/blog-publishing.md): writing and scheduling posts.
- [Tech blog runbook](../../docs/operations/tech-blog-site.md): domains, cutover, and checks.
