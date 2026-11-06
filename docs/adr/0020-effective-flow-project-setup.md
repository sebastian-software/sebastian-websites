---
status: accepted
updated: 2026-11-06
---

# Effective Flow project setup

## Status

Active

## Context

This living ADR holds the project's tracked Effective Flow configuration.
GitHub hosts issue-backed planning and tracking, branches, and pull requests.
The complete `.effective-flow/` directory holds private runtime state and is
ignored by Git. Keeping runtime state separate from project configuration lets
workflow checks record their state without adding it to a pull request.

Project artifacts remain in English; interactive chat uses German. Delivery
opens a pull request against `origin/main`. The merge gate retains its explicit
merge-permission question; a delivery request alone does not grant permission
to publish the websites.

## Configuration

| Key                               | Value                      |
| --------------------------------- | -------------------------- |
| review.profile                    | focused                    |
| review.autoConfirmScope           | false                      |
| review.designDecisionSources      | standard                   |
| review.validation                 | full                       |
| applyReview.defaultCommitStrategy | null                       |
| applyReview.finalValidation       | full                       |
| applyReview.stashPolicy           | interactive                |
| applyReview.worktree.baseDir      | .effective-flow/.worktrees |
| applyReview.worktree.setup        | auto                       |
| worktree.enabled                  | true                       |
| delivery.completion               | pr                         |
| delivery.baseBranch               | origin/main                |
| tracker.mode                      | remote                     |
| tracker.remoteToolOverride        | auto                       |
| plan.dir                          | docs/plan                  |
| language.project                  | en                         |
| language.chat                     | de                         |

## Consequences

Changes to these workflow defaults update this record in place. Git history
keeps earlier values, following [ADR-0002](0002-adrs-are-living-documents.md).
Full validation remains the default. Workflow worktrees may be used while
respecting the repository's project-runtime and delegation instructions.

A merge to `main` starts the existing production deployment described in
[ADR-0009](0009-delivery-model.md). This setup creates no commit and does not
change deployment triggers, hooks, checks, or credentials.
