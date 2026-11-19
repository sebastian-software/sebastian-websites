# GEO question panel and first observation

Status: limited pilot, 17 November 2026. Related: #140, #128, #144 / #35.

The panel checks whether search-enabled answers describe the company accurately
and cite useful evidence. A local HTML or link checker cannot observe those
answers. No additional subscription is needed: use a search surface already
available to the team, record its actual mode, and keep inaccessible samples
marked unavailable.

## Fixed questions

Run each wording in a fresh conversation, without uploading this report or
supplying the expected answer. Keep the first wording when comparing months.
The two languages are separate samples.

| ID    | Exact question                                                                                                                                                            | Expected evidence and factual checks                                                                                                                                                                                                                                                    |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1-de | Was ist Sebastian Consulting, und wie gehört die Marke zur Sebastian Software GmbH? Bitte nenne Quellen.                                                                  | Consulting is a registered brand operated by Sebastian Software GmbH. Check company/brand separation, founders, and legal location against the Consulting team/imprint and Software site.                                                                                               |
| B1-en | What is Sebastian Consulting, and how is the brand related to Sebastian Software GmbH? Please cite sources.                                                               | Same facts as B1-de.                                                                                                                                                                                                                                                                    |
| D1-de | Wann lohnt sich ein Architekturreview für eine bestehende React- und TypeScript-Anwendung, und welche konkreten Ergebnisse sollte ein Team erwarten? Bitte nenne Quellen. | Unbranded decision question. The Consulting architecture-review service should explain fit, work, and deliverables. Record any company mention without requiring one for a correct answer.                                                                                              |
| D1-en | When is an architecture review worthwhile for an existing React and TypeScript application, and what concrete deliverables should a team expect? Please cite sources.     | Same decision question as D1-de.                                                                                                                                                                                                                                                        |
| P1-de | Welche Beiträge haben Sebastian Werner und Sebastian Fastner bei Regrellos Internationalisierung jeweils geleistet? Bitte unterscheide ihre Aufgaben und nenne Quellen.   | Werner: frontend/localization and review interfaces. Fastner: backend translation workflows and operations. Check the individual profiles and original Chris Lewis recommendation; after deployment, also the Regrello case. Preserve the August 2025 account's then-ongoing milestone. |
| P1-en | What did Sebastian Werner and Sebastian Fastner each contribute to Regrello's internationalization? Please distinguish their responsibilities and cite sources.           | Same individual attribution as P1-de.                                                                                                                                                                                                                                                   |
| T1-de | Was ist Palamedes von Sebastian Software, und ist es eine Open-Source-Bibliothek oder ein fertiger Übersetzungsdienst? Bitte nenne Quellen.                               | Check the current Software product page and linked public project documentation. Distinguish open-source tooling from a managed service and announced work from available products. Recheck status before each sampling round.                                                          |
| T1-en | What is Palamedes by Sebastian Software, and is it an open-source library or a ready-to-use translation service? Please cite sources.                                     | Same product-status checks as T1-de.                                                                                                                                                                                                                                                    |

Public content homes:

- [Software](https://sebastian-software.de/) and its [products](https://sebastian-software.de/products).
- Consulting [team](https://sebastian-consulting.de/team), [imprint](https://sebastian-consulting.de/imprint), and [architecture review](https://sebastian-consulting.de/services/architecture-review).
- [Werner's project history](https://sebastian-consulting.de/werner/projects), [Fastner's profile](https://sebastian-consulting.de/fastner), and the [complete Regrello recommendation](https://sebastian-consulting.de/references#recommendation-chris-lewis).

## Repeat procedure

1. Record system, visible model name (or unknown), search toggle/mode, login
   state, interface language, date/time with timezone, and any location setting.
   A German interface alone does not establish a German search location.
2. Run two independent conversations per question on each available surface.
   Keep mode and wording fixed. Record access failures separately; they are
   neither incorrect answers nor zero visibility.
3. Preserve the answer or a reviewable excerpt in the team's evidence store.
   Record each inline-cited URL and the particular claim it supports. A source
   listed in a sidebar is not automatically an inline citation.
4. Check claims against the public content homes on that date. Record correct
   facts, errors, meaningful omissions, and whether a cited page actually
   answers the question. Keep a missing company mention separate from factual
   correctness, especially on the unbranded D1 questions.
5. Report numerators and denominators per question/surface, including unavailable
   cells. With repeated samples, show differing answers and citations rather
   than presenting one answer as a stable visibility score.

Suggested evidence columns:

```text
sample_id, question_id, exact_question, started_at, completed_at,
system, visible_model, mode, login_state, ui_locale, location_setting,
availability, company_mentioned, inline_cited_urls,
claim_support, factual_errors, meaningful_omissions, page_correction
```

## First observation: B1-de

| Field                  | Observation                                                                                                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date                   | 17 November 2026; submitted around 12:47 CET, completed at 11:49:05 UTC / 12:49:05 CET                                                                                                    |
| System                 | Perplexity, anonymous German web interface                                                                                                                                                |
| Mode                   | Visible “Suche” option selected; default model not disclosed                                                                                                                              |
| Locale/location        | German interface; no controlled search-location setting                                                                                                                                   |
| Question               | Exact B1-de wording above                                                                                                                                                                 |
| Availability           | One completed answer                                                                                                                                                                      |
| Company mention        | Yes; Consulting described as a brand of Sebastian Software GmbH                                                                                                                           |
| Core factual check     | Brand/operator relationship, Mainz legal operator, and both founders/directors were consistent with the cited owned pages                                                                 |
| Owned inline citations | `https://sebastian-consulting.com/team`, `https://sebastian-consulting.de/imprint`, `https://sebastian-software.de/`                                                                      |
| Citation support       | Team page supports the people/consulting context; imprint supports the operator and legal facts; Software page supports the company context. Count: three unique owned inline-cited URLs. |
| Errors/action          | No core brand/legal factual error observed in this answer; no corrective page change follows from this sample                                                                             |

The interface showed ten sources overall. That count is not ten owned-page
citations; only the three owned URLs visibly used inline are counted here.
This is a branded recognition observation with **n = 1**. It provides no estimate
of mention frequency, answer variability, unbranded discovery, traffic, or sales.

### Unavailable observations

- A fresh anonymous Perplexity conversation with the same B1-de wording,
  immediately after the first answer at approximately 11:49 UTC, required login.
  No second answer was collected.
- Microsoft's Copilot entry redirected to a German sign-in landing page. No
  panel question was submitted and no answer was collected.
- The other seven question/language combinations have not been sampled. Their
  cells remain unmeasured, rather than being inferred from B1-de.

The panel is ready to repeat with an existing approved account. Repeated
observations and variability remain open under #140; this pilot does not claim
to have completed a multi-system baseline. No account or paid service was
created for it.

## Review and action

Proposed cadence: a manual monthly round, plus a focused recheck after correcting
a documented factual error or releasing a relevant page. This document does not
schedule an automation. Correct the specific owned source or verifiable public
profile when the evidence warrants it; keep an unsupported answer claim out of
the company's source material.

Report answer visibility, factual accuracy, referral visits, and actual outcomes
as separate measures. Referral/outcome collection is deferred with Therion
under #144 / #35; it does not block a small factual question panel.

[Google's AI search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
continues to support ordinary search fundamentals and useful source content.
The technical local checker, editorial work, and factual identity improvements
remain useful independently of access to an AI search surface.
