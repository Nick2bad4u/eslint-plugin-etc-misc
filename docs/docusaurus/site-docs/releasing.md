---
sidebar_position: 40
---

# Releasing `eslint-plugin-etc-misc`

This page mirrors the root
[`RELEASING.md`](https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/RELEASING.md)
guide.

## One-time setup

1. Configure npm trusted publishing for
   `Nick2bad4u/eslint-plugin-etc-misc` and
   `.github/workflows/release.yml`.
2. Confirm GitHub Actions can write repository contents and request an OIDC
   identity token.
3. Authenticate the GitHub CLI with workflow access.

The workflow publishes with npm provenance and does not need a long-lived
`NPM_TOKEN` when trusted publishing is configured.

## Pre-release checks

Release from a clean, current `main` after the exact source commit passes CI
and security checks.

```powershell
npm ci --force
npm run release:check
npm run lint:package-check:strict
npm run docs:typecheck
npm run docs:build
npm run changelog:preview
```

Verify the packed tarball separately in a clean production consumer, including
ESM, CommonJS, declarations, real ESLint execution, and
`npm audit --omit=dev`.

## Create a release

Do not bump the manifest, create a tag, or publish manually:

```powershell
gh workflow run release.yml `
  --ref main `
  -f release_type=<patch|minor|major> `
  -f ref=main `
  -f skip_verify=false
```

The optional `version=x.y.z` input overrides `release_type`.

The workflow verifies the package, applies and commits the version, creates and
pushes the annotated tag, renders exact-tag release notes, publishes to npm with
provenance, and creates the GitHub release with tarball and ZIP assets. Never
set `skip_verify=true` for a normal release.

## Post-release verification

The release workflow pushes its version commit and tag with `GITHUB_TOKEN`, so
GitHub intentionally suppresses new `push` workflow runs for those writes.
After the release completes, explicitly dispatch the release-commit checks:

```powershell
gh workflow run ci.yml --ref main
gh workflow run codeql.yml --ref main
gh workflow run deploy-docusaurus.yml --ref main
```

Wait for those CI, security, and documentation runs. Then confirm:

- Git tag, GitHub release, release commit, and npm version align;
- npm provenance/signatures and registry integrity are present;
- the published tarball has the expected files and public API;
- fresh ESM, CommonJS, and NodeNext consumers work;
- the production dependency tree has no audit advisories;
- live documentation links resolve; and
- local and remote `main` are clean and consistent.

## Changelog commands

- `npm run changelog:preview` previews unreleased notes.
- `npm run changelog:generate` writes `CHANGELOG.md`.
- `npm run changelog:release-notes` renders the release at `HEAD`.

The release body is generated at workflow runtime and is not committed.

## Related docs

- [Contributor guide](https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/CONTRIBUTING.md)
- [Architecture ADR index](./architecture/adr/index.md)
