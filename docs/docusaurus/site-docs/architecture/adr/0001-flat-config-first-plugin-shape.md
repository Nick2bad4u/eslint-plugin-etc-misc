---
sidebar_position: 2
title: ADR 0001 - Flat Config-first plugin shape
---

# ADR 0001: Flat Config-first plugin shape

## Status

Accepted

## Context

The plugin is intended for modern ESLint usage and is maintained in a codebase
already centered on Flat Config. Supporting legacy `.eslintrc` formats would
increase complexity and testing surface area.

## Decision

- Export Flat Config-ready presets from `plugin.configs`.
- Keep presets self-contained by including `plugins` mappings directly.
- Document Flat Config as the only supported configuration style.

## Consequences

### Positive

- Smaller API surface and easier maintenance.
- Faster onboarding for teams already on ESLint v9+ / v10+.
- Fewer compatibility shims in tests and docs.

### Negative

- Teams on legacy config formats must migrate before adopting this plugin.

## Alternatives considered

1. Dual support (Flat Config + legacy `.eslintrc`) — rejected due to maintenance
   cost and long-term direction of ESLint.
2. Runtime translation layer from legacy config to flat config — rejected due to
   complexity and fragile edge cases.
