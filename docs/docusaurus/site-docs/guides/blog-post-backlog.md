---
sidebar_position: 3
title: Blog post backlog
---

# Blog post backlog

This page tracks high-value blog post ideas sourced from ADRs, release
workflow, benchmarking, and rule curation work.

| Proposed title | Core angle | Source material | Audience | Status |
| --- | --- | --- | --- | --- |
| Why we unified etc + misc into one plugin | Explain the curation strategy and trade-offs | ADR 0003 | New adopters | Idea |
| How we keep 100+ rule docs in sync | Show generated catalog and sync automation | ADR 0004 + sync scripts | Maintainers | Idea |
| Designing a practical recommended preset | Discuss warn/error tiering philosophy | ADR 0005 + `src/configs/recommended.ts` | Teams adopting plugin | Idea |
| Flat Config-first from day one | Migration rationale for modern ESLint | ADR 0001 | ESLint users migrating from legacy | Idea |
| Docs coverage as a hard gate | Why docs parity must fail fast | ADR 0002 + sidebar checks | OSS maintainers | Idea |
| Rule overlap audits: how we avoid duplicates | Method for checking ecosystem overlap before adding rules | Rule scan workflow + tests | Rule authors | Idea |
| Performance guardrails for large rule sets | Benchmark strategy and regression tracking | `benchmarks/README.md` | Performance-focused users | Idea |
| Release engineering without changelog drift | Runtime release notes + no-commit CI changelog policy | `RELEASING.md` + workflows | Maintainers | Idea |
| Immutability rule family deep dive | Why readonly array/map/set/record rules are bundled | Rule docs in `/docs/rules/typescript-*readonly*` | TypeScript teams | Idea |
| Building reliable autofixes in custom ESLint rules | Patterns for safe fixers and suggestions | Rule tests + docs maintenance playbook | Rule developers | Idea |

## Editorial guidance

- Prefer concrete migration and implementation examples.
- Link each post to one primary ADR or guide for historical context.
- Include short runnable snippets and "what changed" sections.
