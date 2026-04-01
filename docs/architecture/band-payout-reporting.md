# Band Payout Reporting Model

Issue: `#8`

## Purpose

Define:

- how StageHand calculates member-facing payout reporting
- what managers can configure
- what members can see
- how payout reporting differs from actual fund settlement

This is a reporting-model decision, not a final automated payout decision.

## Decision

Use a **reporting-first payout model** for the first release.

That means StageHand should:

- record confirmed payment activity
- apply manager-defined split rules
- calculate each member's estimated share
- present those amounts as reporting outputs

StageHand should **not** present first-release payout numbers as guaranteed bank-settlement amounts unless and until actual payout orchestration is implemented.

## Core principles

### 1. Separate reporting from settlement

In v1, payout reporting answers:

- how much has been collected
- how the current split rules apply
- what each member's current estimated share is

It does **not** guarantee:

- that money has been transferred
- that money has cleared to a connected account
- that funds have been manually disbursed

### 2. Only confirmed money counts

Only confirmed, tracked transactions should count toward payout reporting by default.

Included in v1:

- confirmed Stripe-backed support tips
- confirmed Stripe-backed request boosts

Excluded by default in v1:

- abandoned payment attempts
- failed payments
- manual cash tips unless explicitly entered by the manager
- external Venmo, Cash App, or PayPal activity unless manually reconciled

### 3. Allocation rules belong to the band

Managers control payout allocations.

Members can view the current allocation model, but they should not edit it unless a future permissions model explicitly allows that.

### 4. Reports are show-aware

Payout reporting should be available:

- per active show
- per historical show
- optionally in a band-wide aggregate view

The primary unit should be the **show**, because that is how StageHand's live activity is organized.

## Source amounts

### Gross tracked total

The first reporting number is:

- **Gross tracked total**

Definition:

- the sum of confirmed, tracked support tips and request boosts for the show

Formula:

```text
gross_tracked_total = confirmed_support_tips + confirmed_request_boosts
```

### Untracked external total

The second reporting bucket is:

- **Untracked external support**

Definition:

- amounts collected outside the canonical Stripe-backed flow
- for example Venmo, Cash App, PayPal, or cash

These amounts should not be mixed into canonical payout reporting unless the manager explicitly records them.

### Reconciled adjustments

Managers should have a future path to add:

- manual positive adjustments
- manual negative adjustments

Examples:

- cash collected at the merch table
- refunded support amount
- offline support amount added after the show

These adjustments should be clearly labeled and auditable.

## Recommended reporting fields

### Show-level manager report

Managers should see:

- show name and date
- gross tracked total
- request-boost total
- direct-support total
- external/untracked total if manually reconciled
- current split rules
- estimated member shares
- reconciliation status

### Member-facing report

Members should see:

- show name and date
- gross tracked total
- their split percentage
- their estimated share
- whether the number is estimated or settled

Members should not see:

- hidden admin controls
- raw payment-provider identifiers
- edit controls for payout rules

## Recommended labels in the UI

Use careful language.

Preferred labels:

- `Estimated share`
- `Tracked total`
- `Reconciled external support`
- `Awaiting settlement`
- `Settled manually`
- `Settled via payout`

Avoid labels like:

- `You earned`
- `Guaranteed payout`
- `Paid out` unless settlement is actually confirmed

## Allocation model

### Default model

Use percentage-based allocation across active band members.

Example:

```json
[
  { "member_id": "mem_1", "allocation_percent": 35 },
  { "member_id": "mem_2", "allocation_percent": 25 },
  { "member_id": "mem_3", "allocation_percent": 20 },
  { "member_id": "mem_4", "allocation_percent": 20 }
]
```

### Validation rule

The manager workspace should strongly prefer split totals that equal 100%.

If totals do not equal 100%:

- show a warning
- calculate with the stored values only if the manager explicitly keeps them

### Show-specific overrides

The model should eventually allow a show-level override, because not every performance includes every band member.

Recommended rule:

- base payout rules live at the band level
- active show lineup determines who is eligible for that show's split
- manager can override allocations for a specific show if needed

## Eligibility rule

For the first release:

- only members in the active show's lineup should be eligible for that show's payout report

If a member is not in the lineup:

- they should not receive a calculated show share by default

This keeps payout reporting aligned with actual performing participants.

## Reporting states

Each show payout report should have one of these states:

- `live_estimate`
- `ready_for_review`
- `reconciled`
- `settled`

### `live_estimate`

Use while the show is active and tips/boosts are still coming in.

### `ready_for_review`

Use after the show ends but before manager has reviewed external/untracked support.

### `reconciled`

Use after the manager has confirmed any manual adjustments and agrees with the totals.

### `settled`

Use only after funds have actually been distributed or settlement is otherwise confirmed.

## Calculation model

### First-release formula

```text
eligible_pool = gross_tracked_total + reconciled_external_adjustments
member_estimated_share = eligible_pool * allocation_percent
```

### Example

```text
gross_tracked_total = $200
reconciled_external_adjustments = $40
eligible_pool = $240

member allocation = 25%
estimated share = $60
```

## Manager workflow

Recommended first manager workflow:

1. run a show
2. see live tracked totals during the performance
3. review the show after the set
4. optionally add reconciled external support
5. confirm payout report
6. mark as settled later when money is actually distributed

This creates a useful operational loop before payout automation exists.

## Member workflow

Recommended first member workflow:

1. open member workspace
2. view active show totals
3. see current split percentage
4. see estimated share
5. later review final reconciled show report

Members should always understand whether the number is:

- live
- reviewed
- settled

## Auditability

Any manager-entered adjustment should store:

- who made the change
- when it was made
- amount
- reason

Examples of reasons:

- cash tip added
- Venmo amount reconciled
- refund correction
- merch-not-included note

## Exclusions

The following should remain out of payout reporting unless explicitly added later:

- merch revenue by default
- unconfirmed payments
- app-store billing totals
- speculative pending transactions

Merch should stay separate because its cost basis, tax treatment, and fulfillment economics are different from pure support-tip flows.

## Relationship to issue #7

This model assumes the issue `#7` decision:

- Stripe-backed support tips and request boosts are the canonical tracked flows
- external support links remain optional and secondary unless reconciled
- automated platform payouts are deferred

## Suggested UI sections

### Manager payout view

- `Tracked total`
- `External adjustments`
- `Eligible payout pool`
- `Lineup`
- `Allocation rules`
- `Estimated member shares`
- `Settlement status`

### Member payout view

- `Current show`
- `Tracked total`
- `Your percentage`
- `Estimated share`
- `Status`

## Open questions

- Should managers be able to exclude specific transactions from the payout pool?
- Should merch ever be included in member payout calculations, or always remain separate?
- Do we want fixed-amount overrides in addition to percentage-based splits?
- When Stripe Connect arrives, should settlement status update automatically from payout events?

## What this unblocks

This decision unblocks:

- manager payout-report UI design
- member payout-summary UI design
- schema work for reconciled adjustments
- future settlement-state transitions
