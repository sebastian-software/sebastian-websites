---
status: accepted
updated: 2026-10-06
---

# Cookieless analytics without a consent banner

All four sites measure visits with Rybbit, self-hosted at `t.sebastian-software.de`, which sets
no cookies and stores no identifier in the browser. Because nothing is stored on the visitor's
device, the sites show no consent banner. Live numbers fetched from our own metrics service
need no consent either; they are a request to our own domain without tracking.

## Consequences

- No tool that sets cookies or fingerprints visitors may be added without revisiting this
  decision.
- The privacy policy names Rybbit and the metrics service as processors in the legal package.
