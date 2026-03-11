---
sidebar_position: 4
title: ADR 0003 - Unified etc + misc curation strategy
---

# ADR 0003: Unified etc + misc curation strategy

## Status

Accepted

## Context

Teams adopting this repository historically had to combine behavior from two
different ecosystems (`eslint-plugin-etc` and `eslint-plugin-misc`) while also
handling overlap, stale rules, and inconsistent docs quality.

That split made onboarding and long-term maintenance harder:

- multiple plugin dependencies and namespaces to manage
- unclear replacement path for deprecated/overlapping rules
- duplicated documentation and migration burden

## Decision

- Provide a single curated plugin package: `eslint-plugin-etc-misc`.
- Export all rules under one namespace: `etc-misc/<rule-id>`.
- Keep deprecated rules available when useful for compatibility, but document
  replacement recommendations in rule metadata/docs.
- Maintain two clear adoption presets (`recommended`, `all`) for staged rollout.

## Consequences

### Positive

- Faster onboarding with one install path and one namespace.
- Clearer migration strategy from legacy rule sets.
- Better documentation consistency and easier discoverability.

### Negative

- Curation ownership shifts to this repository (ongoing maintenance cost).
- Upstream rule behavior changes require periodic reconciliation.

## Alternatives considered

1. Keep both plugins separate and document dual usage.
   - Rejected: still leaves users with fragmented configuration and migration work.
2. Re-export one upstream plugin as-is and ignore the other.
   - Rejected: loses useful rule coverage and curation value.

## Follow-up work

- Continue overlap audits before adding new rules.
- Keep deprecation replacements current in rule metadata and README tables.
