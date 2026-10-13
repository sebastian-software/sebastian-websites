# Consulting communication

This guide defines the voice, message structure, and editorial standards for Consulting
pages, consultant profiles, and their PDF editions. The [overall concept](../../docs/concept/overall-concept.md) owns
the audience and site roles. The [shared design system](../../design/DESIGN.md) owns
visual identity.

## Audience and message

Write primarily for CTOs, engineering leads, and technical decision-makers in product
teams and large organizations. They need to understand the problem we can help with,
the experience behind that claim, and how we work with their team. Recruiters and
intermediaries also need clear roles, dates, technologies, and downloadable profiles.

The core message is personal technical responsibility: we help teams make architecture
decisions and carry them into implementation. Each consultant's profile must express
their own specialty through project evidence. Do not make both profiles sound like the
same interchangeable expert.

## New products and existing systems

Explain architecture experience through the work the reader needs: building a new
product or frontend platform, establishing shared foundations, or modernizing an
existing codebase. Give greenfield work prominence when it is a consultant's specialty.
Use the term for the specific scope that was newly built.

Show how experience informs early decisions about interfaces, components, rendering,
internationalization, and tooling. “Best practices” become useful when connected to a
concrete choice and the product's requirements. Describe experienced judgment without
promising that an architecture will eliminate every mistake or never need to change.

## Voice

The Consulting voice is warm, confident, thoughtful, and technically precise.

| Quality      | How it appears in the copy                                                                      |
| ------------ | ----------------------------------------------------------------------------------------------- |
| Personal     | Use “I” in an individual profile and “we” for shared company work. Name the person responsible. |
| Confident    | State supported responsibility directly: “I led,” “I introduced,” “I implemented.”              |
| Clear        | Prefer concrete actions and familiar words. Keep important technical terms consistent.          |
| Thoughtful   | Explain a decision or constraint when it helps the reader assess the work.                      |
| Approachable | Write as an experienced colleague. Use natural language without slang or private shorthand.     |

Use names in headings, identity fields, and attribution. Write an individual's narrative
in first person rather than describing the person from outside. “We” must refer to actual
shared work; distinguish personal contributions from the wider team's work.

## Make the argument through evidence

Lead with relevance, then place the proof close to the claim. A project description
should explain its context, the consultant's role, and the concrete contribution.
State an outcome when it is supported. Otherwise, explain the delivered capability or
technical mechanism and why it matters in that context.

For example, “I introduced GraphQL orchestration across backend services so the shop
frontend could use a consistent API” explains both the work and its purpose. A tool
list alone leaves that connection to the reader.

- Keep technical ownership accurate. Contributing to a system, leading an initiative,
  and delivering the whole system are different claims.
- Preserve joint work and upstream credit. A port or adaptation can be strong proof
  without implying original authorship.
- Separate a project's goal, implemented mechanism, and observed result. Do not turn
  an intended benefit into a measured outcome.
- Use metrics, testimonials, and comparisons only with a source that supports their
  exact scope. Do not infer security responsibility or compliance from a client name.
- Show pride through specific work and decisions. Avoid unsupported superlatives,
  transformation promises, and claims of uniqueness.

## Reading rhythm and document roles

The executive summary answers why this consultant is relevant. It leads with a clear
specialty, gives a short professional through-line, and uses selected projects as proof.
Open-source work and working style add substance and personality. Keep it useful for
someone deciding whether to start a conversation.

The detailed project history answers what the consultant actually did. Preserve reverse
chronology, role and period, client or permitted anonymous label, contributions, and
relevant technologies. Give complex work room to explain its mechanism; keep smaller
engagements compact. Reuse the facts rather than repeating the summary's sales argument.

Use short paragraphs and informative headings. Lists belong where the items are easier
to scan or compare. Vary sentence length and openings when the meaning warrants it;
avoid giving every project an identical rhetorical formula. Remove introductions and
closing sentences that merely announce the section or repeat its title.

## German and US English

Both versions carry the same facts, responsibility, and qualifications. Adapt sentence
structure and terminology to the reader rather than translating word for word.

- German: warm, precise, and professional. Prefer active verbs over long noun chains.
  Established terms such as Frontend, GraphQL, and Code-Splitting can stay when useful.
- US English: direct, idiomatic, and explicit about relevance. Avoid corporate filler
  and literal translations of German expressions.
- Use first person in profiles. Address readers consistently with formal “Sie” in
  German site calls to action and “you” in English.
- Use sentence case for English editorial headings. Preserve product names, role
  titles, dates, and technical identifiers.
- Apply punctuation and typography appropriate to each locale. Use dashes for a real
  relationship or aside, not as the default sentence structure.

Repository documentation stays in US English. German belongs in localized public copy.

## Public copy and private records

Publish only the cleared representation of project facts. Keep interview wording,
source reconciliation, confidential details, internal assessments, and selection reasons
outside public repositories and application imports. A hidden field does not make its
contents private.

Showcase selection marks curated examples of work. It is not a satisfaction score.
Client naming, logos, quotations, and project details each retain their disclosure limits.
Do not use an identifying location or asset to undo an anonymous client label.

The normal next step is an introductory conversation or direct contact. Keep the
invitation clear and proportionate; do not create artificial urgency, availability,
pricing, or guarantees.

## Before shipping a revision

Check that the opening gives a clear reason to read, each important claim has relevant
proof, and the contributor's role remains accurate. Read both languages for natural
rhythm and aligned meaning. Verify the website and PDFs: text expansion, headings,
logos, and page breaks can change even when only words change.
