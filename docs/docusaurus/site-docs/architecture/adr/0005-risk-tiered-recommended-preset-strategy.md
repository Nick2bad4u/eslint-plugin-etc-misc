---
sidebar_position: 6
title: ADR 0005 - Risk-tiered recommended preset strategy
---

# ADR 0005: Risk-tiered recommended preset strategy

## Status

Accepted

## Context

Consumers need a starter preset that is practical for adoption in existing
codebases. Enabling all rules at `error` from day one creates high migration
friction and encourages blanket disabling.

## Decision

- Keep `etcMisc.configs.recommended` intentionally selective.
- Use severity tiering:
  - `error` for correctness and safety rules with strong signal.
  - `warn` for low-risk maintainability and style guidance.
- Keep `etcMisc.configs.all` as the exhaustive preset for teams that want every
  current, non-deprecated rule.
- Keep deprecated rules out of normal presets and expose explicitly named
  deprecated-inclusive variants only for staged migrations.

## Consequences

### Positive

- Lower adoption friction and faster initial rollout.
- Clear path from baseline (`recommended`) to strict enforcement (`all` plus
  local severity promotion).

### Negative

- Some teams may expect stricter defaults and need to promote warnings sooner.
- Recommended composition needs regular review as new rules are introduced.

## Alternatives considered

1. Make recommended equal to all.
   - Rejected: too disruptive for first-time adopters.
2. Keep recommended minimal and avoid new additions.
   - Rejected: under-delivers practical value and slows policy evolution.

## Follow-up work

- Re-evaluate recommended membership when new rules are added.
- Document rationale for each recommended inclusion in changelog/release notes.
