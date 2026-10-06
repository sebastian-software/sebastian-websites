# Build and launch the Software site

## Status

- Priority: P1
- Effort: L
- Risk: HIGH (replaces the live corporate site; moves two domains off AWS and Cloudflare DNS)
- Depends on: 02, 03, 05
- Planned at: f007192, 2026-10-06
- Working state: clean

## Why this matters

The Software site is the most urgent case and the brand anchor. It is rebuilt as the site of a
product company with two kinds of product ([overall concept, Products](../concept/overall-concept.md#products)),
without the services, profiles, and booking prompts that now belong to Consulting.

## Current state

- Live: `sebastian-software.de` (German) and `.com` (English), Remix v2 with server rendering
  on AWS Lambda through SST (`sebastian-software-mono/sst.config.ts`), DNS on Cloudflare,
  redirects through a CloudFront function (`sebastian-software-mono/redirect.config.ts`).
  Deployment is manual (`sst deploy`); there is no deploy CI.
- Live pages: `/`, `/mission`, `/team`, `/consulting`, `/testimonials`, `/testimonial/:slug`,
  `/werner`, `/fastner`, `/imprint`, `/privacy-policy`. The language is chosen at request
  time by cookie, host, and `Accept-Language`.
- Aliases that must keep working: `www.sebastian-software.de`, `www.sebastian-software.com`,
  `sebastiansoftware.de`, `sebastiansoftware.com` and their `www.` forms;
  `sebastianfastner.de` and `sebastianwerner.de` (with `www.`) currently redirect to the old
  profile pages and must redirect to the Consulting profiles instead
  ([ADR-0010](../adr/0010-url-and-redirect-contract.md)).
- Analytics host `t.sebastian-software.de` (self-hosted, used by the Consulting site as well).
- Information architecture: Products · Open source · Company · Contact
  ([overall concept, Information architecture](../concept/overall-concept.md#information-architecture)).
- Commercial products: Terminaro (`terminaro.eu`), Palamedes+ (not yet public), a third
  product in preparation. Open-source products: Palamedes, Dalo, Ardo, and the families.
- Source material: the live-site capture sorted in plan 05; reusable home and mission copy is in `apps/software/content/legacy/`.

## Scope

In scope:

- `apps/software` with the pages Home, Products (one page per commercial product), Open source
  (highlights and the two families, leading to the Open Source site), Company (story, values,
  team, product development), Contact, Legal.
- English source copy and German translation for every page.
- Redirects: the alias domains, `/consulting` to the Consulting site in the matching
  language, `/mission` to the company page, `/privacy-policy` to `/privacy`, `/team` kept,
  `/testimonials` and `/testimonial/*` to 410 until the Consulting references exist.
- Bunny targets `sebastian-websites-software-de` and `sebastian-websites-software-en`, the canonical domains attached, TLS, and the
  DNS move for the two canonical domains and the aliases.

Out of scope:

- Product pages on the products' own sites.
- Shutting down the AWS stack and Cloudflare records; that is plan 10, after the observation
  period.
- The personal domains' DNS; they move with the Consulting site (plan 09).

## Verification commands

| Purpose             | Command                                            | Expected result                                                                                            |
| ------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Full check          | `pnpm agent:check`                                 | exit 0                                                                                                     |
| Variants            | `pnpm --filter @sebastian-websites/software build` | `apps/software/build/software-de/client` and `apps/software/build/software-en/client` with matching routes |
| Completeness        | the translation-completeness check from plan 02    | legal, navigation, and primary call to action complete in both languages                                   |
| Redirects           | the table-driven redirect tests                    | every rule of ADR-0010 for Software passes                                                                 |
| Smoke after cutover | `curl -sI https://sebastian-software.de/mission`   | 301 to the company page                                                                                    |

## Steps

### 1. Write the content

Draft the English copy from the positioning basis and the sorted capture, then the German
translation through the Palamedes catalog. Settle the open points for this site with the
owners first: whether recruiting is an audience, and the company story.

### 2. Build the app

Implement the pages on the shell from plan 02 with a minimal semantic structure while plan 01 is deferred; apply its visual drafts later. Product pages
carry the positioning and the entry point into the product's own site.

### 3. Redirects and hosting

Add the Software rules to the typed redirect configuration with tests. Create the two targets
and the preview through the delivery chain; attach the canonical and alias domains to the
targets with TLS.

### 4. Cut over

Lower the DNS TTLs a day ahead. Switch `sebastian-software.de`, `.com`, and the aliases to
Bunny. Run the smoke checks on both domains and the aliases. Keep the AWS stack running,
untouched, until plan 10.

## Done criteria

- [ ] Both canonical domains serve the new site from Bunny with valid TLS.
- [ ] Every alias and legacy path behaves as ADR-0010 states.
- [ ] No consulting services, profiles, or booking prompts remain on the site.
- [ ] Legal texts were reviewed before launch.
- [ ] Analytics reports visits for the new site.

## Stop conditions

- Stop before the DNS switch if any redirect test fails or the legal review is open.
- Stop if Palamedes+ or the third product cannot be described publicly yet; launch with
  Terminaro and the open-source products and add the others later rather than naming them
  early (ADR-0012).

## Maintenance and review focus

Reviewers should check the redirect tests against the live aliases after cutover, and that the
old site's request-time language logic has no equivalent here: the domain decides.
