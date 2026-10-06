# Font hosting integration

The private [`sebastian-fonts`](https://github.com/sebastian-software/sebastian-fonts)
repository owns the licensed files, shared typography CSS, `hosting.json`, and the scripts
that call Bunny directly. The current implementation is in
[sebastian-fonts#2](https://github.com/sebastian-software/sebastian-fonts/pull/2).

It follows the direct Bunny API scripts in `oss-metrics`: provision resources, publish the
artifact, and verify live delivery. Font publishing uses Bunny Storage HTTP uploads;
Metrics publishes an Edge Script. Neither needs the private hosting npm package.
Fonts and Metrics use the organization Actions secret `BUNNY_API_KEY` in the scripts'
process environment. Neither needs an npm token or Limen setup.
The Metrics credential migration is merged in
[oss-metrics#8](https://github.com/sebastian-software/oss-metrics/pull/8).

`node scripts/provision.mjs` creates or reuses the exact storage and pull zone names,
applies CORS and cache rules, creates the `fonts` CNAME in the existing Bunny DNS zone,
and attaches `fonts.sebastian-software.com`. It verifies API readback and stops on conflicting
DNS records or a different storage topology or origin.

Cloudflare is authoritative for `sebastian-software.com`. Initial setup also creates the
DNS-only CNAME `fonts.sebastian-software.com` → `fonts-sebastian-software.b-cdn.net` there;
the matching Bunny DNS record is a mirror. CI needs only the Bunny key and the existing
public CNAME for certificate issuance.

Live setup is verified: all 29 assets pass HTTPS, checksum, CORS, cache lifetime and
missing-file 404 checks using fresh public DNS, and repeat Bunny provisioning needs no
writes. GitHub Team and the organization secret are configured, and the secret is available
to Fonts, Metrics, and the website monorepo. GitHub Actions deployment passed for both
[Fonts](https://github.com/sebastian-software/sebastian-fonts/actions/runs/37437534848) and
[Metrics](https://github.com/sebastian-software/oss-metrics/actions/runs/37437619790) using
the central `BUNNY_API_KEY`. The font repository has no separate secret copy.

Metrics also uses a DNS-only Cloudflare CNAME:
`metrics.sebastian-software.com` → `sebastian-oss-metrics.b-cdn.net`. Its deployment verifies
both the Bunny hostname and the public custom hostname.

`node scripts/publish.mjs` uploads `public/`, preserves existing identical font binaries,
rejects binary changes at immutable URLs, purges the CDN cache and enables HTTPS.
`node scripts/verify.mjs` checks every published asset against the checkout, CORS and cache
headers, CSS MIME types, and the missing-file 404. These are ordinary Node 24 scripts using
built-in APIs. Shared code can be extracted when multiple deployments actually need it.

Font binaries have a one-year immutable lifetime, CSS a one-hour lifetime. Every font
stylesheet imports `typography.css`, which exposes `--sebastian-font-sans`,
`--sebastian-font-serif`, `.sebastian-sans`, `.sebastian-serif`, slab aliases and configurable
letter spacing. The websites consume `https://fonts.sebastian-software.com/fonts.css`.

The organization uses GitHub Team. Its `BUNNY_API_KEY` Actions secret is available to all
repositories, including private Fonts. Rotation updates the central secret. Production
deployment runs only from `main` on a GitHub-hosted runner; it needs no private package
installation.
