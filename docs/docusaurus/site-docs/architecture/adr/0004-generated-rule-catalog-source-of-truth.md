---
sidebar_position: 5
title: ADR 0004 - Generated rule catalog metadata as source of truth
---

# ADR 0004: Generated rule catalog metadata as source of truth

## Status

Accepted

## Context

Manual updates to rule IDs, preset docs, and README rule tables repeatedly
drifted over time. Adding or renaming a rule required touching multiple files,
which increased the chance of inconsistency.

## Decision

- Treat the persistent rule-catalog assignment ledger as the canonical source
  for generated rule-doc links and stable rule catalog IDs.
- Keep every assignment in that ledger, mark removed rules as
  retired, never reuse their IDs, and allocate new rules after the highest
  assigned ID.
- Use sync scripts to update derived docs artifacts (for example README tables
  and preset docs) instead of editing them manually.
- Preserve explicit rule catalog IDs (`R###`) in docs so references stay stable
  across releases.

## Consequences

### Positive

- Reduced docs drift and fewer stale links.
- Repeatable, automatable docs synchronization in local and CI workflows.
- Easier auditing when rule inventory changes.

### Negative

- Contributors must run sync scripts as part of docs change workflows.
- Generated outputs can create larger diffs if not scoped carefully.
- Rule removal leaves intentional gaps in the active catalog.

## Alternatives considered

1. Keep all docs metadata manually maintained.
   - Rejected: repeated mismatch history demonstrated this is brittle.
2. Remove catalog IDs entirely.
   - Rejected: IDs provide durable references across docs and release notes.

## Follow-up work

- Keep sync scripts documented in contributor-facing guides.
- Add periodic checks that fail fast when generated artifacts are stale.
