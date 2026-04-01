# StageHand Agent Guide

This repository is operated with issue-first GitOps. Treat this file as the working agreement for any future coding agent or contributor.

## Core rules

1. Do not start meaningful implementation work unless there is an issue for it or the user explicitly asks for repo setup/bootstrap work.
2. Keep `main` stable. Work from short-lived branches tied to an issue.
3. Scope changes tightly to the issue. Avoid opportunistic refactors unless they are required to complete the issue safely.
4. Update docs when behavior, architecture, or workflow changes.
5. Run at least one verification command relevant to the change before declaring work complete.

## Source of truth

- Product direction: `ROADMAP.md`
- Contribution workflow: `CONTRIBUTING.md`
- Issue templates: `.github/ISSUE_TEMPLATE/`
- App entry: `App.tsx`
- Shared app state: `src/hooks/useStageHandState.ts`

## Expected workflow

1. Read the relevant issue and confirm which roadmap section it supports.
2. Inspect the current code before proposing structural changes.
3. Implement the smallest coherent slice that moves the issue forward.
4. Verify the change locally.
5. Summarize what changed, risks, and next logical issue-sized follow-ups.

## Branch naming

- Features: `feature/<issue-number>-<short-slug>`
- Bugs: `bug/<issue-number>-<short-slug>`
- Architecture: `arch/<issue-number>-<short-slug>`
- Chores/docs: `chore/<issue-number>-<short-slug>`

## Commit guidance

- Keep commits small and reviewable.
- Prefer one issue or one clear sub-step per commit.
- Reference the issue number in the commit body or PR description once GitHub issues exist.

## Current product shape

StageHand is a unified Expo / React Native app for iOS and Android with three experiences:

- Manager workspace for songs, shows, members, links, access settings, and queue moderation
- Band member workspace for set flow, lineup visibility, queue awareness, and payout context
- Crowd workspace optimized for tablet use during a live show

The current auth model is only a local launch gate with passcodes stored in app state. Treat it as temporary scaffolding until real authentication is implemented.

## Technical guardrails

- Preserve the tablet-first crowd experience when changing layout.
- Keep shared domain types in `src/types/`.
- Keep app-wide helpers and seed/state merge logic in `src/lib/`.
- Keep reusable presentation components in `src/components/`.
- Prefer extending the shared state hook over scattering duplicate state logic across screens.
- Avoid adding dependencies unless they clearly improve the product direction in `ROADMAP.md`.

## Verification baseline

For most app changes, run:

```bash
npx tsc --noEmit
```

Add broader verification as the repo grows, especially tests and lint checks once they exist.
