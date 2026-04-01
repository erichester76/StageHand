# StageHand Issue Seeds

Use these as the first GitHub issues once the remote is created. Each one maps directly to `ROADMAP.md`.

## A1. Create GitHub repository settings baseline

- Type: architecture
- Roadmap: `Now / A. Repository and delivery workflow`
- Goal: connect the local repo to GitHub and establish the minimum repo protections for issue-first development.
- Acceptance criteria:
  - `main` is pushed to GitHub
  - branch protection is enabled for `main`
  - pull requests are required for merges
  - the README, roadmap, and issue templates are visible in the remote repo

## A2. Create StageHand label taxonomy

- Type: architecture
- Roadmap: `Now / A. Repository and delivery workflow`
- Goal: create a stable label set so every issue can be filtered by area and work type.
- Acceptance criteria:
  - labels exist for `type:*`
  - labels exist for `role:*`
  - labels exist for `priority:*`
  - label naming is documented in the repo

## B1. Define device-mode provisioning flow

- Type: feature
- Roadmap: `Now / B. Role-aware app shell`
- Goal: decide how a phone or tablet becomes a manager device, member device, or crowd device.
- Acceptance criteria:
  - workflow is documented for first launch
  - crowd devices are clearly distinguished from protected workspaces
  - manager/member access path is explicit

## B2. Add kiosk exit flow for crowd tablets

- Type: feature
- Roadmap: `Now / B. Role-aware app shell`
- Goal: prevent venue users from casually escaping the crowd interface while still allowing staff to recover the device.
- Acceptance criteria:
  - crowd mode has a defined exit gesture or admin path
  - exit path requires elevated access
  - behavior is documented for show-night staff

## C1. Choose backend and realtime strategy

- Type: architecture
- Roadmap: `Now / C. Realtime architecture`
- Goal: choose the first backend and live sync approach for shows, requests, boosts, and payouts.
- Acceptance criteria:
  - backend candidates are compared
  - recommended stack is documented
  - live event model is outlined
  - decision includes tradeoffs and unknowns

## C2. Define StageHand domain event model

- Type: architecture
- Roadmap: `Now / C. Realtime architecture`
- Goal: identify the core events that drive live sync across manager, member, and crowd devices.
- Acceptance criteria:
  - events are listed for show activation, request creation, request boost, set list changes, and lineup changes
  - payload shape is sketched for each event
  - open questions are captured

## D1. Define first payment flow

- Type: architecture
- Roadmap: `Now / D. Payments and support links`
- Goal: choose how request boosts and direct tips should be handled in the first real release.
- Acceptance criteria:
  - hosted-link vs native payment options are compared
  - recommendation covers iOS and Android constraints
  - request boosts and direct support tips are modeled separately

## D2. Design band payout reporting model

- Type: feature
- Roadmap: `Now / D. Payments and support links`
- Goal: clarify how members see payout information and how managers configure allocations.
- Acceptance criteria:
  - payout math assumptions are documented
  - member-facing reporting fields are defined
  - manager editing workflow is described
