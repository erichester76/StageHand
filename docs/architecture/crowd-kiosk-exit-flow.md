# Crowd Kiosk Exit Flow

Issue: `#4`

## Purpose

Define how staff can safely exit crowd mode on a public tablet without exposing backstage controls to the audience.

This is the operational companion to `docs/architecture/device-mode-provisioning.md`.

## Decision

Use a **hidden, staff-only kiosk exit path** for crowd tablets with two steps:

1. a non-obvious exit gesture that is unlikely to be triggered accidentally by the public
2. a protected confirmation step that requires elevated access

The kiosk exit flow should never expose the device setup or manager/member workspaces directly from a single casual tap.

## Why this approach

Crowd tablets live in a semi-public environment:

- near the stage
- at the merch table
- on a shared venue device

That means the exit path must balance two goals:

- staff must be able to recover or reprovision the device quickly
- the public must not be able to stumble into backstage functionality

## Recommended flow

### Normal crowd state

In normal operation:

- the crowd sees only public request/support UI
- there is no visible role switcher
- there is no visible “back” or “settings” control for backstage workflows

### Staff exit gesture

Use a hidden gesture to begin the exit flow.

Recommended v1 gesture:

- long press on the crowd header area for 3 seconds

Alternative acceptable options:

- five-tap on a hidden corner target
- long press plus secondary tap confirmation

Why long press is preferred first:

- easy to implement
- difficult to trigger accidentally
- easy to explain to staff

### Exit confirmation step

After the hidden gesture succeeds, show a staff-only confirmation sheet or modal:

- title: `Staff access`
- copy: `Exit crowd kiosk mode?`
- options:
  - `Cancel`
  - `Continue`

If the user continues, require elevated verification.

### Verification step

Short-term verification:

- require the manager passcode

Long-term verification:

- require manager auth or privileged device admin session

Band-member passcode should **not** be sufficient to exit crowd kiosk mode by default. Crowd device reprovisioning is an administrative action and should remain under manager-level control unless we deliberately loosen that rule later.

### Successful exit result

After successful verification:

1. the crowd device session is cleared or marked for reprovision
2. the device returns to **device setup**
3. staff can choose:
   - Crowd tablet
   - Manager device
   - Band-member device

## Recommended user experience

### Crowd-facing behavior

The crowd should never see:

- “manager”
- “member”
- “device setup”
- “switch role”
- “admin mode”

Those terms belong only in staff flows.

### Staff-facing behavior

The exit flow should be:

- discoverable in documentation and setup guidance
- easy to perform with one hand
- difficult to trigger by accident
- recoverable if entered accidentally

## Concrete v1 proposal

Implement this exact v1 flow:

1. crowd tablet header receives a `3 second long press`
2. app opens `Staff access` modal
3. modal requires manager passcode
4. successful passcode clears local crowd session
5. app returns to device setup screen

This is the simplest safe behavior consistent with the current local-only session architecture.

## State transitions

### Crowd mode to device setup

Current state:

- `activeRole = crowd`

Exit path:

- hidden gesture succeeds
- manager passcode verified
- local session cleared

Result:

- `activeRole = null`
- app shows launch/device setup screen

### Failed verification

If passcode verification fails:

- keep the device in crowd mode
- show a generic failure message
- do not reveal backstage options

### Cancel behavior

If the staff modal is opened accidentally:

- cancel should immediately dismiss the modal
- the crowd UI should remain undisturbed

## Threat model

### Threats we care about now

- curious audience member discovering backstage screens
- accidental role switching during a live show
- venue staff handing the tablet back in the wrong mode

### Threats we do not fully solve yet

- a determined attacker with unlimited physical access
- OS-level kiosk escape
- rooted/jailbroken device abuse

Those concerns matter later, but issue `#4` should solve the practical show-night workflow first.

## Operational guidance for staff

Recommended show-night instruction:

1. long press the header for 3 seconds
2. enter the manager passcode
3. return to device setup
4. reprovision if needed

This should be documented in any eventual venue setup checklist.

## Future evolution

Once real authentication and backend device sessions exist:

- the exit flow can require active manager authentication
- manager can remotely revoke a crowd device session
- crowd devices can be bound to a specific show session
- exit attempts can be logged as audit events

Possible future domain event:

- `device.deprovisioned`

That event is not required for the current local-only implementation, but it is a logical extension of the device session model.

## Implementation notes for current codebase

The current app already has:

- local role persistence
- a device setup screen
- passcode-gated manager/member access

To implement this issue later in the app:

- crowd mode should gain a hidden header gesture
- manager passcode validation should reuse the existing access settings source
- successful exit should call the same local session clear path used by reprovisioning

## Acceptance criteria mapping

This document satisfies issue `#4` by defining:

- a crowd mode exit path
- elevated verification for staff-only access
- documented behavior suitable for show-night use

## What this unblocks

This decision unblocks:

- kiosk-mode UI implementation
- protected reprovisioning in the app shell
- future backend-backed device session revocation
