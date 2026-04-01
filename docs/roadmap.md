# StageHand planning notes

This document captures the earliest product roadmap and backlog anchors for the Expo-based StageHand experience. It is intentionally concise so GitHub issues can reference sections directly when writing tickets.

## Vision
StageHand connects the band manager, the members on stage, and the crowd in a single mobile experience that keeps song catalogs, set lists, payment links, and live requests in sync. The crowd interface is designed for tablets so venues can mount the tablet near the stage or merch table while the manager and members retain full control on handsets.

## Short-term priorities (next milestone)
1. Break the single-file prototype into discrete screens + shared state: manager, member, and crowd views share a lightweight store so updates propagate immediately across interfaces.
2. Wire role-aware launch flow with authentication stubs so a manager view cannot be accidentally exposed to crowd devices.
3. Add analytics events and telemetry scaffolding (request added, tip boosted, show switched) to reassure teams when the queue is live.

## Mid-term focuses
1. Replace local storage with a real backend API + realtime sync (WebSocket or similar) and persist request/tip state per show.
2. Shape integrations for push-to-venmo/vhall Cash App, Stripe in-app payments, and merch links from the manager profile.
3. Add multi-device layout polish for the crowd view so it behaves as a house-busy control surface on tablets.
4. Hardening: automated tests for the shared store, request sorting, and payout math plus CI checks.

## Backlog ideas
- Set list templating + zero-touch import/export from Spotify playlist or CSV.
- Venue-facing check-in mode that turns requests into paginated printouts for bartenders.
- Built-in promotions for tip challenges and request lotteries.

## Tracking & cadence
- Open new GitHub issues for every feature, bug, or architecture change; link them to this document via `[roadmap](docs/roadmap.md)`.
- Use the issue templates below to keep requirements consistent.
- Tag issues with `role:manager`, `role:member`, `role:crowd`, `type:feature`, `type:bug`, or `type:architecture`.

## Success signals
- Average request throughput and tip volume per show increase after a new release.
- Crowd tablets stay synchronized with the manager view while a show is live (less than 3 seconds lag in the staging environment).
- Teams can walk through set list updates without writing new code (UI-first).
