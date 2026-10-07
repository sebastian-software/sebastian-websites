# DNS and email migration follow-up

The production website cutover completed on 2026-10-07. This follow-up covers Software,
Consulting, their spelling aliases, and their personal-domain aliases. Other projects in
Cloudflare are outside this migration.

## Verified changes on 2026-10-08

- `sebastian-software.com` now uses `kiki.bunny.net` and `coco.bunny.net`. Openprovider
  saved the change at 00:52 CEST; the `.com` parent published it by 00:56 CEST. The old
  Cloudflare zone remains available during propagation.
- Its Bunny records match all 11 previous effective Cloudflare records, with the current
  Software and Open Source targets and Google verification TXT. An existing Bunny-only
  fonts record remains. Direct Bunny HTTPS probes returned 200 for the apex and Open
  Source; the existing `www` redirect still returns 302 to the apex. Public post-delegation
  smoke checks passed for Software English (10/10) and Open Source English (2/2).
- Google Workspace verifies `sebastian-software.com` as a user alias of the primary
  Software `.de` domain. Five Google MX records and SPF were added to both Bunny and
  the old Cloudflare zone. All four authoritative servers returned identical MX and TXT
  answers. This hyphenated domain previously had no MX record.
- Software `.de` retains its five Google MX records. Google DKIM uses a new 2048-bit
  `google` selector; Google Admin reports email authentication active. Its SPF allows
  Google and the existing mail-server IPv4 and IPv6 addresses.
- The same SPF was added to `sebastiansoftware.de` and `sebastianwerner.eu`, which
  already receive mail through Google. Both Bunny nameservers publish it. Their MX and
  verification TXT records remain intact.
- A current Software `.de` Cloudflare export was copied into staged Bunny zone 910764.
  One `studio` CNAME remains unresolved because that hostname also has CAA records.
- Cloudflare synthesizes additional CAA permissions that its zone export omits. The
  staged Software `.de` and Fastner zones now include the effective Let's Encrypt
  `issue` and `issuewild` permissions needed for Bunny certificates; AWS permissions
  remain. Authoritative DNS queries confirmed these records.
- Two missing `*.wapo.sebastianfastner.de` A and AAAA records were copied into Bunny.
  Their answers match Cloudflare. The other standard records also match; the staged
  root, `www`, and `blog` records use an existing Bunny redirect zone. Its HTTP redirect
  chain reaches the new Consulting Fastner profile with a final 200 response.

SPF includes `include:_spf.google.com`, `ip4:152.53.179.119`, and
`ip6:2a0a:4cc0:c0:d28e:d4e1:5ff:fe13:a363`, ending with `~all`. Keeping the existing
sender addresses avoids rejecting mail still sent by that server during consolidation.
Domain-specific DKIM setup and end-to-end delivery tests remain incomplete for the aliases.
No test email has been sent.

## Software .de DNSSEC transition

Bunny signing is enabled for the staged zone. Openprovider saved its additional KSK at
01:11:23 CEST, retaining the Cloudflare KSK and the Cloudflare nameservers. Both DS records
were observed at the `.de` registry by 01:16 CEST, with a TTL of 86400 seconds:

| Provider   | Key tag | Algorithm | Digest type |
| ---------- | ------- | --------- | ----------- |
| Cloudflare | 2371    | 13        | 2           |
| Bunny      | 34724   | 13        | 2           |

Do not change the nameservers before 2026-10-09 01:16 CEST, and only after every dependent
service is ready. This is the minimum cache window, not a scheduled cutover. Keep both DS
records through the nameserver transition and its propagation period. Do not disable
DNSSEC as a shortcut. The current public Google MX response still validates with the DNSSEC
`ad` flag. See [Openprovider's DNSSEC migration guidance](https://support.openprovider.eu/hc/en-us/articles/216648828-DNSSEC-Updates-and-transfers).

## Requirements before the remaining switches

- Software `.de` still has Cloudflare Tunnel services. Copying their UUID CNAMEs into
  Bunny does not replace Cloudflare routing; prepare compatible service destinations
  before delegation. See [Cloudflare Tunnel guidance](https://developers.cloudflare.com/cloudflare-one/faq/cloudflare-tunnels-faq/).
- `image.sebastian-software.de` works through Cloudflare, but direct origin HTTPS fails
  hostname validation. Prepare a valid custom-host certificate or compatible proxy.
  Direct origin HTTPS for `profile` and `share` works. `polyfill` already returns 530,
  and its current balancer target has no IPv4 answer; investigate separately.
- Preserve the working Studio website while resolving its CNAME/CAA combination in
  Bunny; direct CloudFront HTTPS currently returns 200.
- The staged Fastner root, `www`, and `blog` hostnames have no Bunny certificate yet.
  Bunny requires them to point at its servers before HTTP-01 issuance. Locate the
  registrar and prepare the HTTPS transition before changing delegation.
- `sebastiansoftware.com` and `sebastian-werner.com` still contain obsolete mailbox.org
  MX records. Prepare and verify their replacement Google domains and recipient routes
  before replacing MX or switching nameservers. Their delegation is unchanged.
- Werner `.com` currently returns Cloudflare 522 and its old origin times out. Its staged
  Bunny root and `www` redirect to the Software homepage, but have SSL disabled. The
  shared redirect zone also serves other family domains; do not change its generic rule.
- Consulting `.de` and `.com` still route mail to `mail.sebastian-software.de`. Prepare
  all personal addresses and shared-address forwarding in Google before the MX switch.
  Their existing `p=reject` DMARC policy requires working aligned sender authentication.
- Preserve iCloud mail on `sebastian-werner.net` and `sebastianwerner.de`.

Current Cloudflare and Bunny zone exports and public DNS observations are retained locally
for comparison and rollback. Restore only the affected records or delegation; a whole-zone
restore can overwrite later mail or service changes. Keep the old Cloudflare zones until
propagation and the service checks are complete.
