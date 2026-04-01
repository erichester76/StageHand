# StageHand Roadmap

This is the working roadmap for StageHand. Use it as the anchor for GitHub issues, branch planning, and milestone conversations.

## Vision

StageHand gives working bands one coordinated mobile system for managing the show and interacting with the crowd. The manager, band members, and audience each get a purpose-built experience, with the crowd interface optimized for tablets placed near the stage or merch table.

## Product pillars

### 1. Live show control
- Manage song catalog, shows, set lists, lineup assignments, and member payouts.
- Give the band a reliable onstage view of the current show state.

### 2. Crowd engagement
- Let the audience request songs, boost requests with tips, and support the band without friction.
- Keep the crowd tablet fast, legible, and resilient in a busy venue environment.

### 3. Monetization
- Support direct tips, request-based tipping, merch handoff, and payment-link integrations.
- Evolve toward real in-app or hosted payment flows.

### 4. Operational trust
- Keep show data synchronized across devices.
- Make the system safe for shared venue hardware and manager-controlled backstage tools.

## Current baseline

Completed foundation already in the repo:

- Expo / React Native mobile scaffold for iOS and Android
- Shared state hook with local persistence
- Manager, member, and crowd experiences
- Tablet-aware crowd layout
- Local launch/access gate for manager and member workspaces
- Issue templates and issue-first contribution workflow

## Now

These are the next issues we should open and work in order:

### A. Repository and delivery workflow
- Create GitHub remote and push `main`
- Enable branch protection and PR review expectations
- Create labels for `type:*`, `role:*`, and `priority:*`

### B. Role-aware app shell
- Replace the current local launch gate with a more explicit session model
- Define how a manager device, member device, and crowd tablet are provisioned
- Design a safe “exit kiosk mode” flow for crowd tablets

### C. Realtime architecture
- Choose backend stack for shows, requests, set lists, and member data
- Define event model for request creation, boosts, show activation, and lineup changes
- Decide how devices subscribe to live show state

### D. Payments and support links
- Define first payment strategy: hosted links, Stripe, or hybrid
- Model request boosts and direct tips separately
- Decide how payout reporting should work for band members

## Next

These should follow once the above work is in motion:

### E. Authentication and authorization
- Real auth for managers and members
- Device/session permissions for crowd tablets
- Role-based routing and protected screens

### F. Reliability and testing
- Add linting, test runner, and CI
- Add tests for payout math, request ranking, and state transitions
- Add error states and empty/loading patterns across the app

### G. UX polish
- Improve tablet kiosk ergonomics for the crowd view
- Refine manager workflows for fast show-night editing
- Improve member readability for low-light stage use

## Later

Longer-horizon ideas worth tracking as separate issues when capacity allows:

- Set list templates and reusable show presets
- Spotify playlist or CSV import/export
- Venue check-in or bartender-assist mode
- Promotions such as request challenges or tip goals
- Analytics dashboard for show performance and crowd engagement

## Success measures

- Crowd requests and tip activity increase during live shows
- Managers can set up and run a show without leaving the app
- Crowd tablets stay in sync with backstage changes fast enough to feel live
- The band member view is dependable enough to use during an actual set

## Issue mapping

Every GitHub issue should reference one of these sections:

- `Now / A-D`
- `Next / E-G`
- `Later`

If an issue does not map cleanly, either the roadmap is missing a section or the work is not yet well defined enough to start.
