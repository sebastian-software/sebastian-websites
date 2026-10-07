# Production domain cutover

The runbook is [issue #41](https://github.com/sebastian-software/sebastian-websites/issues/41).
Software, Open Source, and Consulting move in that order. DNS providers and registrar
nameservers stay in place. Skills, brand assets, analytics, and legacy alias infrastructure
remain on their existing targets.

## Rollback inventory

| Host                         | Previous DNS target                                           | Previous Bunny pull zone                  | New pull zone                                |
| ---------------------------- | ------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------- |
| `sebastian-software.de`      | `dz2vmwpa4kq4e.cloudfront.net`, DNS only, TTL 60              | AWS CloudFront                            | `sebastian-websites-software-de` (6749335)   |
| `sebastian-software.com`     | `dz2vmwpa4kq4e.cloudfront.net`, DNS only, TTL 60              | AWS CloudFront                            | `sebastian-websites-software-en` (6749340)   |
| `oss.sebastian-software.de`  | `opensource-sebastian-software.b-cdn.net`, DNS only, Auto TTL | `opensource-sebastian-software` (5429083) | `sebastian-websites-opensource-de` (6757802) |
| `oss.sebastian-software.com` | `opensource-sebastian-software.b-cdn.net`, DNS only, Auto TTL | `opensource-sebastian-software` (5429083) | `sebastian-websites-opensource-en` (6757805) |
| `sebastian-consulting.de`    | `sebastian-consulting.b-cdn.net`, TTL 1                       | `sebastian-consulting` (5412514)          | `sebastian-websites-consulting-de` (6757792) |
| `sebastian-consulting.com`   | `sebastian-consulting.b-cdn.net`, TTL 1                       | `sebastian-consulting` (5412514)          | `sebastian-websites-consulting-en` (6757797) |

Software rollback restores only the apex CNAME target in Cloudflare. It does not require
removing the new Bunny hostname. Open Source and Consulting rollback moves only the
canonical hostnames back to the old pull zone, loads free certificates, enables Force SSL,
and restores the old CNAME target. Consulting profile subdomains stay on the legacy zone.

The dashboard confirms that Consulting apex records are ordinary flattened CNAMEs, with
CDN acceleration disabled. Changing those DNS records does not transfer hostnames between
pull zones.

Full DNS zone exports were downloaded before the cutover for all four apex zones. Public
DNS answers and alias redirect chains were also recorded locally before any routing change.
The exports include all unrelated services; restoring the entire zone is unnecessary for a
website rollback and risks overwriting subsequent changes.

## Email baseline

Software `.de` retains its five Google MX records. Consulting `.de` and `.com` retain MX
priority 10 to `mail.sebastian-software.de`, their SPF, `dkim._domainkey` records, and DMARC.
The mail host retains IPv4 `152.53.179.119` and IPv6
`2a0a:4cc0:c0:d28e:d4e1:5ff:fe13:a363`. Software `.com` had no MX records before the cutover.
No email records, mail-host addresses, registrar settings, or nameservers are part of this
change.

## Verification

The cutover completed on 2026-10-07. No rollback was needed. All six canonical hosts have
valid certificates and redirect HTTP to HTTPS. Their CNAME targets reference the new zones.

| Site        | Activation                                                                 | Canonical smoke checks per locale |
| ----------- | -------------------------------------------------------------------------- | --------------------------------- |
| Software    | [PR #42](https://github.com/sebastian-software/sebastian-websites/pull/42) | 10/10                             |
| Open Source | [PR #43](https://github.com/sebastian-software/sebastian-websites/pull/43) | 2/2                               |
| Consulting  | [PR #44](https://github.com/sebastian-software/sebastian-websites/pull/44) | 17/17                             |

The canonical sitemaps list 34 pages across the six variants. Every listed page answers 200
and declares the expected canonical origin. Consulting URLs have no locale prefix. All 26
unique navigation, footer, and invitation destinations on these six origins answer 200.
The German Skills destination remains the known exception tracked separately in #36.

All six Consulting PDFs were downloaded from the canonical hosts. Each answered 200 with
an `application/pdf` content type and a valid PDF signature. Both profiles were checked in
the browser in German and English.

All 19 existing alias and infrastructure probes retain their expected behavior: Software
`www` and spelling aliases, personal-domain aliases, the legacy profile host, four Consulting
profile subdomains, Skills English, brand assets, and analytics. The asset-zone root still
answers its expected 404; actual asset routes remain independent of this cutover.

The comparison of 160 unrelated public DNS answers found no change to MX, SPF, DKIM,
DMARC, nameservers, or the mail-server addresses. Four derived A/AAAA answers behind
unchanged Google SMTP/IMAP CNAMEs varied with Google's DNS responses. One baseline AAAA
probe had timed out and subsequently returned no records. Neither difference changes the
configured mail route. End-to-end mail delivery was not tested.

Search Console sitemap submission remains open pending access to the correct properties.

## Email consolidation follow-up

The website cutover does not migrate mail. The public DNS audit of the known Software,
Consulting, and spelling-alias domains found these separate routes:

| Domain                     | Existing inbound mail route  |
| -------------------------- | ---------------------------- |
| `sebastian-software.de`    | Google, five MX records      |
| `sebastian-software.com`   | No MX records                |
| `sebastian-consulting.de`  | `mail.sebastian-software.de` |
| `sebastian-consulting.com` | `mail.sebastian-software.de` |
| `sebastiansoftware.de`     | Google, five MX records      |
| `sebastiansoftware.com`    | `mxext1.mailbox.org`         |

Before consolidating routes into Google Workspace, inventory the required domains, existing
mailboxes, aliases, groups, and forwarding rules in the correct administration account.
Verify each domain and its intended alias or secondary-domain role, then prepare recipient
routing and sender authentication before replacing MX records. The current Consulting
DMARC policy is `p=reject`, so sender authentication must be included in that migration.

## Observation period

Software, Open Source, and Consulting entered production on 2026-10-07. Their 30-day
observation period ends no earlier than 2026-11-06, provided no incident resets it. The old
AWS targets, Open Source zone, and Consulting zone and storage remain available. Legacy
aliases must be migrated and verified before their serving infrastructure is removed.
Skills and other successors retain their own observation periods. The legacy PDF-name
rules cannot be removed before 2027-06-13.
