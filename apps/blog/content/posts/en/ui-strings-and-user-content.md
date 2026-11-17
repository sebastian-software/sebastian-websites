---
id: ui-strings-and-user-content
title: UI strings and user content need different translation models
description: A catalog can translate your interface, but translating editable business content also requires decisions about versions, permissions, and fallback behavior.
publishedAt: 2026-11-17T09:00:00+01:00
authors: [fastner, werner]
tags: [internationalization]
nextStep: consulting-internationalization
---

A workflow application can show a “Save” button in German and still leave a German-speaking user reading English instructions written by a colleague. Translating the interface solves one part of that experience. Translating the instructions changes how the product handles its data.

That distinction should be explicit before a team selects a translation library. UI messages and user-authored content have different owners, change at different times, and need different answers when a translation is missing.

## A catalog follows the product's vocabulary

Consider an interface message such as “3 tasks remaining.” The application owns its meaning and the variable `count`. Translators need a complete message, with enough context to choose the right wording and plural forms. Building the sentence by joining a number to a translated fragment makes that harder: languages do not share one word order or one set of plural rules. The [ICU message-formatting guide](https://unicode-org.github.io/icu/userguide/format_parse/messages/) explains why a message should be translated as a unit.

A catalog workflow can give that message a place in source control, track translations, and check which languages are complete. The team can review a wording change alongside the component that uses it. Whether catalogs ship with a release or are updated separately is a delivery decision; the application still owns the message and its arguments.

That is a useful boundary. It makes missing messages, placeholder mismatches, and fallback language choices visible to the team. It does not determine what should happen to a paragraph that a customer edits after the application has shipped.

## An editable instruction has a different lifecycle

Imagine a user writing “Inspect the seal before shipment” into a task. Another person reads the task in German. A translation exists, then the author changes the instruction to require an additional check.

The old German text may still be fluent while describing the wrong instruction. A language pair and a translated string are therefore insufficient to decide whether that translation can be shown.

An illustrative record could look like this; these are example fields, not a customer schema:

```json
{
  "entityId": "task-42",
  "field": "instruction",
  "sourceLocale": "en",
  "sourceVersion": 7,
  "targetLocale": "de",
  "status": "pending"
}
```

The important relationship is between a translation and the exact source version it represents. If the source changes, the product needs a policy: hide the stale translation, label it, or keep it temporarily while clearly offering the current original. The right choice depends on what people do with that instruction. An operational task and an informal comment may warrant different treatment.

## Decide what happens when the translation is unavailable

Before building a pipeline, make the user-visible decisions concrete:

| Situation                       | Product decision to make                                                                |
| ------------------------------- | --------------------------------------------------------------------------------------- |
| No translation exists           | Show the original, offer a request action, or explain why the field cannot yet be read. |
| The source was edited           | Decide when a translation becomes stale and how the reader sees that state.             |
| Translation fails               | Keep the original available and provide a useful retry or recovery path.                |
| A user can edit translated text | Define whether that edits the source, a translation, or a separate localized value.     |
| Access to a record changes      | Apply the record's permissions to translation requests and returned content.            |

Translation work can run asynchronously, so a response may arrive after its source has changed. Checking the source version when accepting a result prevents an old job from silently replacing a translation of newer text. Retrying a job should also avoid creating contradictory results for the same version and target language.

These decisions reach beyond the frontend. They affect persistence, background work, authorization, and the interface's explanation of what the reader is seeing. A catalog remains useful for translating those explanations.

## A public project account shows the boundary

In his [recommendation about our joint work at Regrello](https://sebastian-consulting.com/references#recommendation-chris-lewis), Chris Lewis describes two milestones: translating static UI strings, then translating user-entered data so people using different languages can collaborate. His August 2025 account describes the second milestone as work in progress. It is evidence of the distinct scope, rather than a benchmark or a claim that every translation problem had been completed.

The practical starting point is a small inventory. Mark which text the application owns, which text users own, and which values must remain identifiers rather than translated prose. Then take one editable field through creation, translation, source editing, failure, and recovery. That walkthrough will tell you where a catalog is sufficient and where your product needs an explicit content-translation model.
