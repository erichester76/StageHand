# First Payment Flow

Issue: `#7`

## Purpose

Choose the first production payment approach for StageHand across:

- direct support tips
- request boosts
- merch handoff

This document decides what we should ship first, not the final long-term monetization system.

## Decision

Use a **hybrid first-release payment strategy**:

- **Stripe Payment Links / Checkout** for the first live payment collection flows
- **Stripe Connect** as the long-term payout foundation, not a release-one requirement
- **manager-configured external support links** for Venmo, Cash App, and PayPal handoff
- **no in-app store billing** for StageHand's first payment flows

For the first release, StageHand should not build native in-app purchase flows for requests, tips, or merch.

## Why this is the right first move

StageHand's early monetization is primarily about:

- tips
- song request boosts
- merch sales or merch handoff
- payments connected to a real-world performance context

That is different from selling digital app features or digital content access. Apple's App Review Guidelines say apps selling physical goods or services consumed outside the app must use payment methods other than in-app purchase, and Google Play's Payments policy similarly says Play billing must not be used for physical goods, physical services, or peer-to-peer payments. citeturn1search0turn0search0

Given those constraints, the lowest-risk first release is to use Stripe-hosted or Stripe-managed payment flows for money movement and keep the app focused on orchestration and live queue behavior. Stripe's hosted Checkout and Payment Links are both low-code options, while Stripe Connect is the platform product designed for marketplaces and multi-party money movement. citeturn2search0turn2search1turn0search8

## Recommended first-release payment architecture

### 1. Direct support tips

Use **Stripe Payment Links or Stripe Checkout** for direct support tips in v1.

Why:

- low implementation effort
- Stripe-hosted experience reduces PCI surface area
- usable from crowd tablets immediately
- consistent with manager-controlled payout reporting

Recommended first-release user flow:

1. crowd user taps `Support the band`
2. app opens a Stripe-hosted payment page
3. payment completes
4. Stripe webhook confirms payment
5. StageHand records `support_tip.recorded`

### 2. Request boosts

Treat request boosts as a **specialized tip flow**, not a separate payment system.

Recommended first-release user flow:

1. crowd user taps `Boost +$5`
2. app creates or opens a Stripe-hosted payment flow tied to the request
3. webhook confirmation records the payment
4. StageHand emits `request.boosted`

Important rule:

Do not increase the queue score until payment is confirmed. That aligns directly with the event model already established in `docs/architecture/domain-event-model.md`.

Important policy rule:

Keep request boosts framed as support for a live, real-world performance outcome, not as the sale of a digital in-app entitlement. If StageHand later turns boosts into app-only perks, premium digital ranking features, badges, or other in-app unlocks, the app-store billing analysis changes materially. citeturn1search0turn0search0

### 3. Merch

For the first release, do **not** build native merch checkout inside StageHand.

Instead:

- let the manager configure a merch URL
- open the band's existing merch store in a browser or webview handoff

Why:

- keeps StageHand from owning product, tax, fulfillment, and shipping complexity too early
- respects the fact that merch is already likely to live in an external storefront
- avoids coupling StageHand's first release to ecommerce stack work

## Stripe product recommendation

### Use first

- **Stripe Payment Links** for fastest launch and QR/shareable flows
- **Stripe Checkout** when we need more control than raw Payment Links

Stripe's docs describe Payment Links as a no-code hosted page that can be shared across channels, while Checkout is a Stripe-hosted or embedded prebuilt payment page built on Checkout Sessions. citeturn2search1turn2search0

### Add next

- **Stripe PaymentSheet / mobile payment UI** only after the hosted payment path is working and reviewed

Stripe's React Native docs show that in-app PaymentSheet and Payment Element flows require server-side endpoints plus the React Native SDK, which is a bigger integration step than hosted links or Checkout. citeturn2search2turn2search3turn2search8

### Plan for payouts

- **Stripe Connect** should be the payout foundation once StageHand itself is acting as a platform that collects and routes funds, even if the first release initially avoids automated connected-account payouts

Stripe documents Connect as the product for marketplaces and platforms managing payments and moving money between multiple parties, including destination charges and separate charges and transfers. citeturn0search8turn2search2turn2search4

Practical rule:

Do not introduce Connect in the first release unless StageHand is actually taking platform responsibility for collection and downstream payout routing. If each band owns its own payment destination, simpler hosted flows are a better first fit. citeturn0search8turn2search0turn2search1

## Why not native in-app purchase

Native app-store billing is the wrong first abstraction for StageHand because the early payment flows do not primarily represent digital app content unlocks. Apple explicitly distinguishes physical goods and services outside the app from in-app purchases, and Google Play explicitly excludes physical goods, physical services, and peer-to-peer payments from Play billing. citeturn1search0turn0search0

For StageHand, trying to force request boosts or band support into app-store billing would create avoidable product and review ambiguity. The better first model is real-world payment handling through Stripe plus externally configured support links.

## Venmo, Cash App, and PayPal

Keep Venmo, Cash App, and PayPal in the first release as **manager-configured external support links**, not as the canonical transactional record.

That means:

- they remain available as convenience options for the crowd
- they should not be the first source of truth for request ordering or payout accounting

Why:

- hosted links are easy for bands to understand
- but they do not give StageHand the same structured webhook-confirmed event flow as Stripe

So the app should distinguish:

- **tracked transactional flows**: Stripe-backed support tips and request boosts
- **untracked external links**: Venmo, Cash App, PayPal

## Recommended v1 product behavior

### Manager

Managers should be able to:

- enable or disable Stripe-backed support tips
- enable or disable Stripe-backed request boosts
- configure merch URL
- configure Venmo, Cash App, and PayPal links
- view confirmed Stripe-backed support and boost totals

### Crowd

Crowd should see:

- `Boost request` using Stripe-backed flow
- `Support the band` using Stripe-backed flow
- merch button that opens external store
- optional alternative support links for Venmo, Cash App, and PayPal

### Member

Members should see:

- confirmed Stripe-backed totals
- confirmed request boosts reflected in queue state
- external-link support channels treated as ancillary unless manually reconciled

## Data and event implications

The first payment flow should produce these system outcomes:

- successful direct tip -> `support_tip.recorded`
- successful request boost -> `request.boosted`
- failed or abandoned payment -> no queue or payout mutation

Recommended metadata on Stripe-backed records:

- `band_id`
- `show_id`
- `request_id` when applicable
- `device_session_id`
- `payment_channel`
- `payment_intent_id` or checkout session identifier

## Payout model for v1

For the first release:

- collect money through Stripe-backed flows
- record confirmed gross amounts
- calculate member allocation inside StageHand
- postpone fully automated connected-account payouts until the payout model is settled

That lets us launch operationally useful payment capture without prematurely committing to automated money movement for every band member.

## Tradeoffs

### Strengths

- lowest-risk mobile launch path
- avoids unnecessary app-store billing complexity
- gets real webhook-confirmed transaction data into StageHand quickly
- preserves a path toward Stripe Connect payouts later

### Costs

- first-release payment UX is less “native” than a fully embedded PaymentSheet flow
- Venmo, Cash App, and PayPal remain outside the canonical event ledger
- payout automation is deferred rather than solved immediately
- request boosts must be messaged carefully so they stay anchored to the live-show context instead of looking like a digital app unlock

## Open questions

- Should request boosts use a fixed amount only in v1, or allow custom amounts?
- Should Stripe-backed direct tips and boosts settle into the platform first or directly to connected accounts once Connect is enabled?
- Do we want to expose both Stripe and external links at the same time in the crowd UI, or prefer Stripe first and show external links as secondary options?
- Should merch open in the system browser only, or is an in-app browser acceptable for the first release?

## What this unblocks

This decision unblocks:

- webhook and payment-event design
- manager payment settings UI
- request boost confirmation flow
- payout reporting design
- schema work for payment-backed queue updates
