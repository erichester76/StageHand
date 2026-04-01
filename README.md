# StageHand

StageHand is now scaffolded as a unified Expo / React Native app for iOS and Android. It ships three synchronized experiences inside one codebase:

- Manager view for songs, links, shows, lineups, set lists, members, and tip allocation
- Band member view for active show details, request queue, set list visibility, and payout snapshot
- Crowd view designed to expand into a tablet-friendly two-column layout for request entry, queue boosting, merch, and direct support tipping

## Run it

From `/Users/eric/Documents/StageHand`:

```bash
npm install
npm run start
```

Then open the project in Expo Go or a simulator:

- `npm run ios`
- `npm run android`

## What is included

- Expo SDK 55 project scaffold with React Native 0.83 and React 19.2 alignment
- Local persistence with AsyncStorage so seeded demo data survives app restarts
- Shared in-memory model for songs, members, shows, request queue, and support tips
- Responsive layout logic that gives the crowd view a tablet-optimized split pane
- Native-friendly UI built with core React Native components only
- Refactored `src/` structure for screens, reusable UI, shared state, helpers, and theme tokens
- Repo-ready roadmap and GitHub issue templates for feature, bug, and architecture tracking
- Root-level `AGENTS.md` and `ROADMAP.md` for future contributors and coding agents

## Project structure

- `App.tsx`: app shell, role switcher, and top-level composition
- `src/hooks/useStageHandState.ts`: shared local state, persistence, and state actions
- `src/screens/`: manager, member, and crowd experiences
- `src/components/`: reusable UI primitives and role switcher
- `src/lib/` and `src/types/`: seed data, helpers, and shared types
- `ROADMAP.md`: canonical working roadmap for issues and milestones
- `AGENTS.md`: repo operating guide for future coding agents and contributors
- `.github/ISSUE_TEMPLATE/`: issue templates ready for a future GitHub repo

## Tracking work

Once this is published to GitHub, use the issue templates in `.github/ISSUE_TEMPLATE/` and reference `ROADMAP.md` from every feature or architecture issue so product direction and implementation stay connected.

## Product direction from here

1. Add authentication and role-aware access so managers, members, and crowd sessions see the correct interface automatically.
2. Replace simulated tipping with payment integrations such as Stripe plus handoff links for Venmo, Cash App, and PayPal.
3. Move shared state into a backend with realtime sync so the queue, payouts, and set list update live across multiple devices.
