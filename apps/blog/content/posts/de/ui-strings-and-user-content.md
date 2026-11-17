---
id: ui-strings-and-user-content
title: UI-Texte und Nutzerinhalte brauchen unterschiedliche Übersetzungsmodelle
description: Ein Katalog übersetzt die Oberfläche. Für veränderliche Fachinhalte brauchst du zusätzlich Regeln für Versionen, Berechtigungen und fehlende Übersetzungen.
publishedAt: 2026-11-17T09:00:00+01:00
authors: [fastner, werner]
tags: [internationalization]
nextStep: consulting-internationalization
---

Eine Workflow-Anwendung kann einen deutschen Button mit „Speichern“ anzeigen und ihre deutschsprachigen Nutzer trotzdem vor englische Arbeitsanweisungen stellen, die Kollegen eingegeben haben. Die Übersetzung der Oberfläche löst einen Teil dieses Problems. Die Übersetzung der Anweisungen verändert, wie das Produkt mit seinen Daten umgeht.

Diese Unterscheidung sollte feststehen, bevor du eine Übersetzungsbibliothek auswählst. UI-Texte und nutzerverfasste Inhalte haben unterschiedliche Verantwortliche, ändern sich zu unterschiedlichen Zeitpunkten und brauchen eigene Regeln für fehlende Übersetzungen.

## Ein Katalog folgt dem Wortschatz des Produkts

Nimm eine Meldung wie „Noch 3 Aufgaben“. Die Anwendung bestimmt ihre Bedeutung und liefert die Variable `count`. Übersetzer brauchen eine vollständige Nachricht und ausreichend Kontext, um Formulierung und Pluralformen zu wählen. Wenn du den Satz aus einer Zahl und übersetzten Fragmenten zusammensetzt, erschwerst du diese Arbeit: Sprachen haben unterschiedliche Wortstellungen und Pluralregeln. Der [ICU-Leitfaden zur Nachrichtenformatierung](https://unicode-org.github.io/icu/userguide/format_parse/messages/) erklärt, warum eine Nachricht als Einheit übersetzt werden sollte.

Ein Katalog-Workflow kann diese Nachricht in der Versionsverwaltung halten, ihre Übersetzungen nachführen und die Vollständigkeit der Sprachen prüfen. Das Team kann eine Textänderung zusammen mit der betroffenen Komponente reviewen. Ob Kataloge mit einem Release ausgeliefert oder separat aktualisiert werden, ist eine Frage des Auslieferungsmodells. Die Anwendung bestimmt weiterhin die Nachricht und ihre Parameter.

Diese Grenze ist hilfreich. Fehlende Nachrichten, abweichende Platzhalter und die Wahl einer Ersatzsprache werden für das Team sichtbar. Sie beantwortet aber noch nicht, was mit einem Absatz geschieht, den ein Kunde nach der Auslieferung verändert.

## Eine bearbeitbare Anweisung hat einen anderen Lebenszyklus

Stell dir vor, ein Nutzer schreibt „Inspect the seal before shipment“ in eine Aufgabe. Eine Kollegin liest diese Aufgabe auf Deutsch. Eine Übersetzung liegt vor, dann ergänzt der Autor eine weitere Prüfung.

Der bisherige deutsche Text kann weiterhin flüssig klingen und trotzdem die falsche Anweisung enthalten. Ein Sprachpaar und eine übersetzte Zeichenfolge reichen deshalb nicht aus, um über die Anzeige dieser Übersetzung zu entscheiden.

Ein vereinfachter Datensatz könnte so aussehen. Die Felder sind ein Beispiel und kein Kundenschema:

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

Entscheidend ist die Beziehung zwischen einer Übersetzung und der konkreten Ausgangsversion. Ändert sich der Quelltext, braucht das Produkt eine Regel: Die veraltete Übersetzung ausblenden, kennzeichnen oder vorübergehend weiter anzeigen und deutlich auf das aktuelle Original verweisen. Welche Lösung passt, hängt davon ab, was Menschen mit der Anweisung tun. Eine operative Aufgabe kann einen anderen Umgang erfordern als ein informeller Kommentar.

## Lege fest, was bei fehlenden Übersetzungen passiert

Kläre vor dem Bau der Pipeline die Entscheidungen, die Nutzer tatsächlich bemerken:

| Situation                                   | Zu klärende Produktentscheidung                                                                                    |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Es gibt noch keine Übersetzung              | Original anzeigen, eine Übersetzung anfordern lassen oder erklären, warum das Feld noch nicht gelesen werden kann. |
| Der Quelltext wurde verändert               | Festlegen, wann die Übersetzung veraltet ist und wie Leser diesen Zustand erkennen.                                |
| Die Übersetzung schlägt fehl                | Original zugänglich halten und einen verständlichen Weg zum erneuten Versuch anbieten.                             |
| Nutzer können übersetzten Text bearbeiten   | Bestimmen, ob sie das Original, eine Übersetzung oder einen eigenständigen lokalisierten Wert ändern.              |
| Der Zugriff auf einen Datensatz ändert sich | Die Berechtigungen des Datensatzes auch auf Übersetzungsanfragen und zurückgegebene Inhalte anwenden.              |

Übersetzungen können asynchron entstehen. Eine Antwort kann eintreffen, nachdem sich ihr Quelltext bereits geändert hat. Ein Versionsabgleich beim Übernehmen des Ergebnisses verhindert, dass ein alter Auftrag unbemerkt die Übersetzung eines neueren Textes ersetzt. Auch ein wiederholter Auftrag sollte keine widersprüchlichen Ergebnisse für dieselbe Version und Zielsprache erzeugen.

Diese Entscheidungen reichen über das Frontend hinaus. Sie betreffen Speicherung, Hintergrundverarbeitung, Autorisierung und die Erklärung dessen, was Leser gerade sehen. Für die Übersetzung dieser Erklärungen bleibt der Katalog zuständig.

## Ein öffentlicher Projektbericht zeigt die Grenze

In seiner [Empfehlung zu unserer gemeinsamen Arbeit bei Regrello](https://sebastian-consulting.de/references#recommendation-chris-lewis) beschreibt Chris Lewis zwei Meilensteine: die Übersetzung statischer UI-Texte und anschließend die Übersetzung nutzereingegebener Daten, damit Menschen in unterschiedlichen Sprachen zusammenarbeiten können. Sein Bericht vom August 2025 beschreibt den zweiten Meilenstein als laufende Arbeit. Er belegt den unterschiedlichen Umfang dieser Aufgaben und ist weder ein Benchmark noch die Aussage, dass sämtliche Übersetzungsprobleme bereits gelöst waren.

Ein kleines Textinventar ist ein guter Anfang. Markiere, welche Texte die Anwendung bestimmt, welche Nutzer verfassen und welche Werte als Kennungen unverändert bleiben müssen. Gehe dann mit einem bearbeitbaren Feld die Schritte Anlegen, Übersetzen, Quelltextänderung, Fehler und Wiederherstellung durch. Dabei wird konkret, wo ein Katalog genügt und wo dein Produkt ein eigenes Modell für Inhaltsübersetzungen braucht.
