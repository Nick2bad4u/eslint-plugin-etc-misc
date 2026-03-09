# Recovery Plan: Lint, Type, and Test Stabilization

This document is the updated working plan for completing the plugin migration and restoring all quality gates.

## Current objective

Pivot from migration work to full quality stabilization:

- 0 ESLint errors
- 0 ESLint warnings
- 0 TypeScript typecheck errors
- 0 failing tests

## Migration status snapshot

- Legacy folders removed:
  - `eslint-plugin-etc/`
  - `eslint-plugin-misc/`
- Legacy rule parity status:
  - `eslint-plugin-etc` exported rule surface: migrated
  - `eslint-plugin-misc` canonical migrated set: migrated
  - Caveat to confirm intentionally dropped behavior: legacy `wrap` rule

## Phase A — Baseline and diagnostics

1. Capture current failures with machine-readable outputs:
   - ESLint (`src`, `test`) rule/category breakdown
   - Typecheck error inventory
   - Vitest failure inventory
2. Group issues by root cause, not by file.

## Phase B — ESLint warnings/errors remediation

1. Fix structural export/import warnings using boundary-aware patterns.
2. Normalize test imports and naming to satisfy lint rules.
3. Remove/replace suppressions only where justified and documented.
4. Re-run lint with `--max-warnings=0` until green.

## Phase C — TypeScript typecheck remediation

1. Fix strict type mismatches in rule adapters/internal utilities.
2. Update RuleTester test shapes to current typings (`messageId`, option schemas, etc.).
3. Verify `npm run typecheck` passes with zero errors.

## Phase D — Test stabilization

1. Fix failing tests due API behavior shifts and autofix expectations.
2. Ensure invalid cases with fixers include `output` where required.
3. Re-run `vitest` until all tests pass.

## Phase E — Final gate

Run in order and require all green:

1. `npx eslint src test --max-warnings=0`
2. `npm run typecheck`
3. `npx vitest run`

## Implementation standards

- Prefer root-cause fixes over silencing symptoms.
- Keep rule metadata/docs/tests synchronized.
- Avoid broad lint disables; if needed, scope tightly and justify.
- Preserve modern ESLint flat-config and strict TypeScript patterns.

## Progress log

- 2026-03-09: Created recovery plan document and began Phase A diagnostics.
