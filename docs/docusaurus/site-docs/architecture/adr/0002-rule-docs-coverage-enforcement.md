---
sidebar_position: 3
title: ADR 0002 - Rules docs coverage enforcement
---

# ADR 0002: Rules docs coverage enforcement

## Status

Accepted

## Context

The docs site was copied from another project and drifted from the real rule
inventory. Some rules existed without docs, and some docs no longer mapped to
real rule source files.

## Decision

- Enforce source-to-doc parity during docs build via `sidebars.rules.ts`.
- Fail docs build when:
  - A source rule in `src/rules/*.ts` has no matching `docs/rules/<rule>.md`.
  - A rules doc has no matching source rule.
  - A rules doc is discovered but not assigned to a sidebar category.

## Consequences

### Positive

- Rule docs cannot silently drift from implementation.
- Sidebar navigation stays complete and trustworthy.
- CI catches documentation coverage regressions early.

### Negative

- Docs builds fail earlier and more often when authors add rules without docs.
- Contributors must keep docs and code changes synchronized.

## Alternatives considered

1. Periodic manual docs audits — rejected as too easy to forget.
2. Non-blocking warnings only — rejected because drift persisted previously.
