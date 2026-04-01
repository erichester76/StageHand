# Device Mode Provisioning Flow

Issue: `#3`

## Purpose

Define how a StageHand device becomes a:

- manager device
- band-member device
- crowd tablet

This is a product and operational workflow decision, not just a UI decision. It needs to work for actual show-night setup, shared venue hardware, and future authentication.

## Decision

Use a **three-mode device provisioning flow** with different trust levels:

- **Manager device**: private, authenticated, persistent
- **Band-member device**: private, authenticated, persistent
- **Crowd tablet**: semi-public, kiosk-oriented, resettable

Provisioning should happen at **first launch** or whenever staff deliberately changes the device role.

## Device classes

### 1. Manager device

Typical hardware:

- band manager's phone
- lead performer's phone
- a trusted backstage tablet

Properties:

- protected access
- persistent identity
- full administrative permissions
- can provision other devices

Primary responsibilities:

- manage catalog, shows, set lists, members, payout settings, links
- activate the live show
- moderate the queue
- control crowd device assignment

### 2. Band-member device

Typical hardware:

- each player's phone
- a shared onstage tablet

Properties:

- protected access
- persistent identity
- read-heavy access with limited operational controls

Primary responsibilities:

- view active show
- view set list
- view queue and support totals
- receive lineup and set changes in real time

### 3. Crowd tablet

Typical hardware:

- mounted venue tablet
- merch-table iPad
- stage-side audience kiosk

Properties:

- public-facing
- simplified interaction model
- intentionally restricted permissions
- should be easy to reset or reprovision by staff

Primary responsibilities:

- accept requests
- accept request boosts
- show public queue state
- surface merch and support links

## Provisioning principles

### 1. Device role is chosen explicitly

The app should never assume a device's role from screen navigation alone.

A device should enter one of the three roles through an explicit provisioning choice.

### 2. Role persistence is local first

The selected device mode should persist locally so the app reopens into the same role after restart.

That persistence may later synchronize to backend-backed device sessions, but the first behavior should still feel immediate and reliable offline.

### 3. Manager and member roles are protected

Manager and band-member roles should require authenticated entry in the long term.

Until full auth is in place, the existing passcode gate is acceptable scaffolding, but it should be treated as temporary.

### 4. Crowd role is public but controlled

Crowd mode should be intentionally easy to enter during setup and intentionally hard to escape during live operation.

### 5. Reprovisioning is a staff action

Changing a device from one role to another should be a deliberate operational step, not a casual navigation pattern.

## First-launch flow

### Recommended first-launch sequence

1. App opens into **device setup**
2. Staff selects one of:
   - Manager device
   - Band-member device
   - Crowd tablet
3. The app explains what that role means
4. The app enforces the access rule for that role
5. The app persists the selected role locally
6. The app opens into the provisioned workspace

## Role-specific provisioning flows

### Manager provisioning

Short-term flow:

1. Select **Manager device**
2. Enter local manager passcode
3. Persist `manager` as the device role
4. Open manager workspace

Long-term flow:

1. Select **Manager device**
2. Sign in with manager account
3. Bind device session to band and user identity
4. Persist secure session
5. Open manager workspace

### Band-member provisioning

Short-term flow:

1. Select **Band-member device**
2. Enter local member passcode
3. Persist `member` as the device role
4. Open band-member workspace

Long-term flow:

1. Select **Band-member device**
2. Sign in with a member account or band-scoped invite
3. Bind device session to band and member identity
4. Persist secure session
5. Open band-member workspace

### Crowd tablet provisioning

Short-term flow:

1. Select **Crowd tablet**
2. Optionally assign a label such as `Front-of-house tablet`
3. Persist `crowd` as the device role
4. Open kiosk-style crowd workspace

Long-term flow:

1. Manager provisions a crowd tablet from manager mode
2. App creates a band/show-scoped device session
3. Tablet stores a public device credential or token
4. Tablet reopens directly into crowd mode until staff reprovisions it

## Recommended provisioning model

Use a **band-scoped device session** concept when backend support is introduced.

That means each device can eventually be represented by a record such as:

```json
{
  "device_session_id": "dev_100",
  "band_id": "band_123",
  "device_role": "crowd",
  "label": "Front-of-house tablet",
  "status": "active",
  "assigned_show_id": "show_456"
}
```

This aligns directly with the event model from `docs/architecture/domain-event-model.md`, especially `device.provisioned`.

## Access expectations by role

### Manager device

Can access:

- full band configuration
- all show management controls
- payment and payout setup
- device provisioning controls

Cannot be treated as:

- public kiosk hardware

### Band-member device

Can access:

- active show view
- set list
- request queue
- member-facing payout context

Should not access:

- band-wide admin settings
- device provisioning controls
- payment configuration

### Crowd tablet

Can access:

- request submission
- request boosting
- merch links
- support links
- public queue state

Must not access:

- band management
- member payout rules
- lineup editing
- device setup without a staff exit path

## Reprovisioning flow

### Safe reprovisioning rule

Changing the device role should require a staff-only path.

Recommended flow:

1. Staff enters protected exit path
2. Existing device role/session is cleared or replaced
3. App returns to device setup
4. Staff selects the new role
5. App provisions the device again

This directly leads into issue `#4`, which should define the crowd kiosk exit path in detail.

## UX guidance

### Crowd tablet UX

Optimize for:

- large tap targets
- low-friction request flow
- clear support actions
- no backstage clutter

Avoid:

- exposing role-switch controls in the normal crowd UI
- showing manager/member terminology to the public

### Manager and member UX

Optimize for:

- reliable re-entry into the last provisioned role
- low setup friction before a show
- clear signals about which workspace is active

## Short-term implementation alignment

The current app already approximates this flow through:

- a launch screen
- local role persistence
- passcode-gated manager and member entry
- open crowd entry

That is acceptable for now.

What should change next:

- rename the current launch pattern as **device setup**
- make crowd mode feel more intentionally kiosk-like
- remove the feeling that role switching is just a developer toggle
- add a protected reprovisioning path instead of casual mode switching

## Open questions

- Should a crowd tablet be bound to a specific active show, or only to a band until the manager activates a show?
- Should band members sign in individually, or should there be a shared show-night member access path?
- Should a manager be able to remotely revoke or reassign a crowd device session?
- Do we want one shared member role, or member-specific permissions later?

## Acceptance criteria mapping

This document satisfies issue `#3` by defining:

- the first-launch workflow
- how crowd devices differ from protected workspaces
- the manager/member access path

## What this unblocks

This decision unblocks:

- `#4` crowd kiosk exit flow
- backend device session schema
- auth/session design for manager and member roles
- future provisioning UI implementation
