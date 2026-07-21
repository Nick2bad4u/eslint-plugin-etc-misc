# Releasing `eslint-plugin-etc-misc`

## One-time setup

1. Configure npm trusted publishing for
   `Nick2bad4u/eslint-plugin-etc-misc` and
   `.github/workflows/release.yml`.
2. Confirm GitHub Actions can write repository contents and request an OIDC
   identity token.
3. Install the GitHub CLI and authenticate with permission to dispatch and
   inspect workflows.

The release workflow publishes with npm provenance. It does not require a
long-lived `NPM_TOKEN` when trusted publishing is configured correctly.

## Pre-release checks

Release from a clean, current `main` after the exact source commit has passed
CI and security checks.

```powershell
npm ci --force
npm run release:check
npm run lint:package-check:strict
npm run docs:typecheck
npm run docs:build
npm run changelog:preview
```

Also install the packed tarball in an isolated production consumer and verify
ESM, CommonJS, declarations, real ESLint execution, and `npm audit --omit=dev`.

## Create a release

Do not bump `package.json`, create a tag, or publish manually. Dispatch the
release workflow from the verified `main` commit:

```powershell
gh workflow run release.yml `
  --ref main `
  -f release_type=<patch|minor|major> `
  -f ref=main `
  -f skip_verify=false
```

Use the optional `version=x.y.z` input only when an explicit version is
required; it overrides `release_type`.

The workflow:

1. checks out the requested branch with full history and tags;
2. installs with `npm ci --force` and runs `npm run release:check`;
3. computes and applies the requested version;
4. rebuilds the package and verifies the version is unpublished;
5. commits the manifest and lockfile version, creates the annotated `v*` tag,
   and pushes both;
6. generates release notes from the exact tag with `git-cliff`;
7. publishes to npm with provenance; and
8. creates the GitHub release with npm tarball and ZIP assets.

Never set `skip_verify=true` for a normal release.

## Post-release verification

The release workflow pushes its version commit and tag with `GITHUB_TOKEN`.
GitHub intentionally does not emit new `push` workflow runs for those writes,
so explicitly dispatch the release-commit checks after the release completes:

```powershell
gh workflow run ci.yml --ref main
gh workflow run codeql.yml --ref main
gh workflow run deploy-docusaurus.yml --ref main
```

Wait for those CI, security, and documentation runs. Then verify:

- the release commit is the target of the Git tag and GitHub release;
- npm `latest` resolves to the expected version;
- npm provenance/signatures and registry integrity are present;
- the registry tarball matches the expected package files and public API;
- fresh ESM, CommonJS, and NodeNext consumers work;
- the published production dependency tree has no audit advisories;
- the live documentation and rule links resolve; and
- local `main`, remote `main`, the tag, and the working tree are consistent.

## Changelog commands

- `npm run changelog:preview` previews unreleased notes.
- `npm run changelog:generate` writes `CHANGELOG.md` locally.
- `npm run changelog:release-notes` renders the release at `HEAD`.

The workflow generates the GitHub release body at release time; it does not
commit a generated changelog.

## Related docs

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [Architecture ADR index](./docs/docusaurus/site-docs/architecture/adr/index.md)
