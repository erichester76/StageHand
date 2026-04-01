# StageHand Domain Event Model

Issue: `#6`

## Purpose

Define the event contract that drives StageHand's live sync across manager, member, and crowd devices.

This document is intentionally narrow:

- it defines **domain events**
- it does not define full database schema
- it does not replace API endpoint or Edge Function design

The goal is to make subsequent work on auth, realtime subscriptions, schema design, and payment flows converge on one shared vocabulary.

## Decision

Use a **show-scoped domain event model** with:

- a standard event envelope
- explicit event types for business-significant changes
- client subscriptions scoped to the active show
- privileged commands handled separately from emitted events

Events represent **facts that already happened**, not requests that might happen.

Examples:

- `show.activated` is an event
- `activate_show` is a command
- `request.boosted` is an event
- `boost_request_payment` is a command or payment workflow step

## Event design principles

### 1. Events are facts

Use past-tense naming for events because they describe committed domain state changes.

Good:

- `show.activated`
- `request.created`
- `lineup.updated`

Avoid:

- `show.activate`
- `request.create`
- `lineup.update`

### 2. Events are scoped

Most StageHand events should include a `band_id` and `show_id`.

This keeps subscriptions narrow and lets clients listen to only the current live show instead of an entire band's history.

### 3. Events are append-only facts

Clients should treat events as immutable facts. Corrections should happen through new events, not by mutating historical event payloads.

### 4. Sensitive workflows emit safe events

Payments, privileged staff actions, and device provisioning may require internal steps, but the public event stream should expose only the minimum data needed by consumers.

## Standard event envelope

All domain events should use a shared envelope like this:

```json
{
  "event_id": "evt_01HXYZ...",
  "event_type": "request.created",
  "occurred_at": "2026-04-01T22:00:00Z",
  "band_id": "band_123",
  "show_id": "show_456",
  "producer": {
    "actor_type": "crowd_device",
    "actor_id": "device_789"
  },
  "version": 1,
  "payload": {}
}
```

## Envelope fields

- `event_id`: unique immutable id for deduplication and auditing
- `event_type`: stable string identifier
- `occurred_at`: server-assigned timestamp in UTC
- `band_id`: band-level partition key
- `show_id`: show-level partition key when applicable
- `producer.actor_type`: who caused the event
- `producer.actor_id`: specific user, member, manager, or device id when available
- `version`: payload contract version
- `payload`: event-specific body

## Actor types

Use a constrained actor type set:

- `manager_user`
- `band_member_user`
- `crowd_device`
- `crowd_guest`
- `system`
- `payment_webhook`

## Core event list

These are the first-class events StageHand should support first.

### Show lifecycle

#### `show.created`

When a manager creates a new show.

Payload:

```json
{
  "show_id": "show_456",
  "venue_id": null,
  "venue_name": "The Copper Room",
  "city": "Brooklyn, NY",
  "scheduled_start_at": "2026-04-05T00:00:00Z",
  "notes": "Acoustic first set, full band second set"
}
```

Consumers:

- manager view
- calendar workflows
- member devices when preloading upcoming shows

#### `show.activated`

When a manager marks a show as the currently live show.

Payload:

```json
{
  "show_id": "show_456",
  "activated_by": "usr_manager_1",
  "previous_show_id": "show_444"
}
```

Consumers:

- manager devices
- member devices
- crowd tablets

This is one of the highest-priority events because it changes which subscription set matters.

#### `show.updated`

When show metadata changes after creation.

Payload:

```json
{
  "show_id": "show_456",
  "changed_fields": ["venue_name", "scheduled_start_at", "notes"]
}
```

Consumers:

- manager devices
- member devices
- crowd tablets if public-facing metadata changed

### Lineup and set flow

#### `lineup.updated`

When the manager changes which members are attached to a show.

Payload:

```json
{
  "show_id": "show_456",
  "member_ids": ["mem_1", "mem_2", "mem_3"],
  "removed_member_ids": ["mem_4"]
}
```

Consumers:

- manager devices
- member devices

#### `setlist.updated`

When the active set list changes in any meaningful way.

Payload:

```json
{
  "show_id": "show_456",
  "setlist_version": 3,
  "entries": [
    {
      "setlist_entry_id": "set_1",
      "song_id": "song_1",
      "position": 1
    }
  ]
}
```

Consumers:

- manager devices
- member devices
- optionally crowd tablets if we later expose “coming up next”

Use a full ordered list snapshot inside the payload rather than only incremental moves for the first version. That makes recovery easier for reconnecting clients.

### Crowd requests

#### `request.created`

When a crowd user submits a song request.

Payload:

```json
{
  "request_id": "req_123",
  "song_id": "song_42",
  "requester_display_name": "Taylor",
  "message": "Birthday request",
  "initial_tip_amount": 5,
  "queue_score": 500
}
```

Consumers:

- manager devices
- member devices
- crowd tablets

#### `request.boosted`

When an existing request receives an additional confirmed boost.

Payload:

```json
{
  "request_id": "req_123",
  "boost_id": "boost_888",
  "increment_amount": 5,
  "new_tip_total": 25,
  "new_boost_count": 4,
  "queue_score": 2504
}
```

Consumers:

- manager devices
- member devices
- crowd tablets

Important rule:

Only emit this event after the boost is confirmed by the accepted payment or support workflow.

#### `request.cleared`

When a manager removes a request from the live queue because it was played, declined, or otherwise resolved.

Payload:

```json
{
  "request_id": "req_123",
  "resolution": "played"
}
```

Consumers:

- manager devices
- member devices
- crowd tablets

### Support and monetization

#### `support_tip.recorded`

When a direct support tip is successfully recorded.

Payload:

```json
{
  "support_tip_id": "tip_321",
  "amount": 20,
  "channel": "stripe",
  "message": "Great set"
}
```

Consumers:

- manager devices
- member devices
- crowd tablets if public support activity is displayed

#### `payout_rule.updated`

When manager changes allocation rules for band members.

Payload:

```json
{
  "band_id": "band_123",
  "allocations": [
    { "member_id": "mem_1", "allocation_percent": 35 },
    { "member_id": "mem_2", "allocation_percent": 25 }
  ]
}
```

Consumers:

- manager devices
- member devices

### Device and session control

#### `device.provisioned`

When a device is assigned a role such as manager, member, or crowd tablet.

Payload:

```json
{
  "device_session_id": "dev_100",
  "device_role": "crowd",
  "label": "Front-of-house tablet"
}
```

Consumers:

- manager/admin workflows
- device management screens

This event is useful for audit and operational support, but it does not need to be part of every live show subscription stream.

## Ordering and idempotency

### Ordering

Ordering only needs to be strong **within a single show stream**, not across the entire product.

Treat `show_id` as the primary ordering boundary for:

- queue updates
- set list updates
- lineup changes
- crowd-facing state

### Idempotency

Consumers must deduplicate by `event_id`.

Producers of privileged actions should also use command-level idempotency keys where retries are possible, especially for:

- request boosts
- direct support tips
- show activation

## Subscription model

### Manager devices

Subscribe to:

- active show lifecycle
- lineup and set list events
- request events
- support tip events
- payout rule changes

### Member devices

Subscribe to:

- active show lifecycle
- lineup and set list events
- request events
- support tip events
- payout rule changes relevant to their band

### Crowd tablets

Subscribe to:

- active show lifecycle
- public queue events
- public support-tip events if surfaced

Do not expose manager-only internal metadata on crowd subscriptions.

## Commands vs events

Keep this separation explicit:

### Commands

Commands ask the system to do something.

Examples:

- activate this show
- add this song to the set list
- boost this request
- provision this device

### Events

Events confirm that something already happened.

Examples:

- `show.activated`
- `setlist.updated`
- `request.boosted`
- `device.provisioned`

This separation matters because commands can fail, but emitted events should only represent committed outcomes.

## What should not be an event yet

Avoid over-modeling the first version.

Do not introduce a large analytics or telemetry event catalog inside the core domain stream yet. Examples that should stay out of the domain stream for now:

- screen opened
- role switcher tapped
- user typed in request field
- payment sheet opened

Those belong in analytics, not in the operational event model.

## Open questions

- Should crowd tablets subscribe to aggregated queue rank only, or full request detail with names/messages?
- Should `setlist.updated` remain a full ordered snapshot, or eventually split into granular move/add/remove events?
- Should payout events be emitted as explicit snapshots after every tip, or computed on demand from recorded tips plus payout rules?
- Do public crowd sessions stay anonymous, or do we want optional lightweight guest identity later?

## What this unblocks

This event model unblocks:

- realtime channel design
- Edge Function command boundaries
- initial Postgres table design
- public vs protected read-model design
- payment event handling

## Next issue linkage

After this document, the most natural follow-on work is:

- auth and authorization design
- device provisioning flow
- payment flow design
- initial schema design for bands, shows, queue entries, and boosts
