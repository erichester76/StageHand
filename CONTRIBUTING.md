# Contributing to StageHand

StageHand is using an issue-first workflow from the beginning so product decisions, architecture changes, and implementation work stay traceable.

## Working agreement

1. Open or reference a GitHub issue before starting meaningful code changes.
2. Link the issue to the relevant roadmap section in `ROADMAP.md`.
3. Keep changes scoped to the issue so review, rollback, and release notes stay clean.
4. Use pull requests for integration, even for early infrastructure work.
5. Update docs and issue status when scope or assumptions change.

## Issue types

- Feature work: use `.github/ISSUE_TEMPLATE/feature-request.md`
- Bugs: use `.github/ISSUE_TEMPLATE/bug-report.md`
- Architecture and platform tasks: use `.github/ISSUE_TEMPLATE/architecture-task.md`

## Branching

- Keep `main` releasable.
- Create short-lived branches from issues, for example `feature/12-crowd-kiosk-launch` or `arch/18-realtime-state`.

## Commit guidance

- Prefer small, reviewable commits that map to one issue or one clear sub-step.
- Mention the issue number in the commit body or pull request description once GitHub issues are active.

## Early-stage note

The current app still uses local persistence and local launch passcodes. That is intentional for the prototype stage. Treat those as scaffolding until backend auth, realtime sync, and payments are in place.
