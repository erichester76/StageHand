# Backend and Realtime Strategy

Issue: `#5`

## Decision

Use **Supabase** as the first backend platform for StageHand.

The recommended v1 stack is:

- Supabase Postgres as the system of record
- Supabase Auth for manager and band-member identity
- Postgres Row Level Security for authorization boundaries
- Supabase Realtime for show-scoped live updates
- Supabase Edge Functions for privileged commands and third-party webhooks

Firebase remains a valid fallback option, but it is not the recommended first choice for StageHand.

## Why this is the best fit

StageHand is not just a chat or feed app. Its core model is relational:

- bands
- members
- shows
- lineups
- set lists
- request queue entries
- support tips
- payout allocations

That shape maps naturally to Postgres and is easier to reason about for reporting, payout math, and operational queries than a document-first model.

Supabase also keeps the stack compact. We get the database, authentication, authorization, realtime subscriptions, and server-side execution model from one platform without changing the current Expo direction.

## Recommended architecture

### Canonical data model

Keep Postgres as the source of truth for:

- `bands`
- `band_members`
- `shows`
- `show_lineups`
- `set_list_entries`
- `song_catalog`
- `request_queue_entries`
- `request_boosts`
- `support_tips`
- `payout_rules`
- `device_sessions`

### Realtime model

Use **show-scoped subscriptions** instead of broad global listeners.

For the first implementation:

- manager devices subscribe to the active show and band admin data
- member devices subscribe to the active show, set list, queue, and payout-facing summaries
- crowd tablets subscribe only to the active show public state and request queue

Avoid subscribing clients to more tables than necessary. Realtime should be narrow, explicit, and driven by the active show session.

### Command model

Use direct client writes only where the security boundary is simple.

Use Edge Functions for sensitive commands such as:

- manager-only show activation
- manager-only lineup changes
- request boost payment confirmation
- support tip payment confirmation
- payout or settlement calculations
- privileged device provisioning

### Security model

Use Supabase Auth plus Row Level Security to separate:

- managers
- band members
- crowd devices / anonymous public sessions

Crowd tablets should not receive manager-only rows. Their queries and subscriptions should resolve against a public, show-scoped read model.

## Why not Firebase first

Firebase has strong realtime primitives and mature auth, and it would be reasonable for a mobile-first app with mostly document-shaped data. But for StageHand, it creates a few disadvantages:

- the data model is more relational than document-oriented
- payout and reporting flows will benefit from SQL and explicit joins
- we already expect manager/member/crowd authorization rules that map cleanly to Postgres + RLS
- Expo integration can stay simpler if we avoid introducing native Firebase modules unless we truly need them later

Firebase should stay on the table if we later decide we need a different offline or mobile-service profile, but it is not the best first backend for this product shape.

## Tradeoffs and constraints

### Supabase strengths

- Strong fit for relational data and reporting-heavy workflows
- RLS gives us a clear authorization story close to the data
- Realtime works well for show-scoped queue and set-list updates
- Edge Functions give us a clean place for privileged logic and webhook processing
- Good fit for Expo / React Native client usage

### Supabase risks

- Realtime subscriptions need careful scoping and data-shape discipline
- We should not rely on raw table replication everywhere for every user-facing view
- High-volume public subscriptions may need denormalized read models or broadcast patterns later

### Firebase strengths

- Excellent realtime listener model
- Mature auth and mobile ecosystem
- Strong fit if we prioritize document sync over relational querying

### Firebase risks for StageHand

- Harder fit for payout rules, reporting, and relational show structures
- Security rules and data modeling may become more complex as the domain grows
- Native Firebase paths add more build/runtime complexity if we later need services outside the JS SDK path

## Implementation guidance

### Phase 1

Use Supabase with these boundaries:

- Auth for managers and members
- anonymous or device-bound public access for crowd sessions
- Postgres tables for canonical write models
- Realtime subscriptions on the queue, set list, and active show session
- Edge Functions for privileged mutations and payment webhook intake

### Phase 2

Add denormalized read models for the crowd tablet if query load or subscription fan-out becomes noisy. The crowd experience should optimize for speed and clarity, not raw normalized table reads.

### Phase 3

Add analytics/event capture once the operational model is stable. Do not build analytics-first. Build for clean transactional state first.

## What this unblocks

This decision unblocks:

- `#6` Define StageHand domain event model
- manager/member auth design
- crowd device provisioning design
- database schema planning
- payment integration boundaries

## Follow-on decisions

The next architecture issue should define the domain event model around this stack:

- `show.activated`
- `lineup.updated`
- `setlist.updated`
- `request.created`
- `request.boosted`
- `support_tip.recorded`
- `device.provisioned`

Those names are placeholders for `#6`, not final event contracts.
