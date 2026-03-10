# Pull request templates

Use the shortest template that fits your PR:

- `feature.md` for new behavior/features
- `bugfix.md` for defect fixes
- `maintenance.md` for refactors/deps/chore work
- `documentation.md` for docs-only changes
- `quick-fix.md` for small, low-risk fixes
- `pull_request_template.md` as the default fallback

Before opening a PR, run the main local quality gate from the repository root:

- `npm run lint:all:fix:quiet`
- `npm run typecheck`
- `npm test`
