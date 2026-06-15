# Audit response — hotel-rate-check (15 Jun 2026)

Triage of the VS Code full-code audit. The audit was accurate; nothing was a false
positive. Status of each finding below.

## Fixed this round

- **#1 (Critical) — `/api/payments/create-checkout` unauthenticated + client-priced.**
  Added it to the Basic-Auth matcher in `middleware.ts` (it's a staff-only route).
  `/api/payments/webhook` and `/api/payments/status` stay public by design.
  The public booking route (`/api/book/create-checkout`) was already server-priced.
- **#2a (part of High #2) — no idempotency.** Added an atomic `claim()` to the
  quote store (KV `SET NX EX` lock; in-memory `Set`). `onPaymentSucceeded` claims
  before booking; a retried/duplicate webhook loses the claim and is ignored, so
  no double-book.
- **#5 (Medium) — webhook replay window.** `verifyWebhook` now rejects any
  signature whose `t=` timestamp is more than ±5 minutes from now.

## Planned — needs a decision from you

- **#2b (High) — synchronous 120 s book in the webhook.** Idempotency (#2a) now
  prevents the *double-book*, but a Book that hits the 120 s recovery still blocks
  the webhook past most serverless timeouts. Proper fix = make fulfilment async:
  webhook verifies + returns 200 immediately, booking runs out-of-band, and the
  120 s BookingDetail-recovery happens on a scheduled re-check.
  **Decision:** which mechanism — Vercel Cron, Upstash QStash, or a queue? (Depends
  on your Vercel plan.)
- **#3 (High) — public routes not rate-limited.** `/api/book/create-checkout` and
  `/api/search` have only a per-instance in-memory limiter (near-useless on
  serverless). **Decision:** Cloudflare Turnstile (bot challenge) vs a KV-backed
  limiter — or both. Needed before go-live.
- **#7 (Medium) — currency.** We charge Stripe in the hotel's currency; the stated
  policy is charge-in-GBP. **Resolve by confirming with TBO what currency our B2C
  rates return in** (already an open question to TBO). Then either it's always GBP
  (no change) or we add a net→GBP conversion + a guard that refuses to charge a
  non-GBP amount.
- **#4 (High) — dead `/api/quote-acceptance`.** This is the retired manual
  quote-link flow (`quote-acceptance` / `quote-accepted` / `quote-link-builder`).
  Recommend **removing** those pages/clients (not building the handler) since the
  instant-booking model replaces them. Sandbox can't delete files — do
  `git rm -r app/quote-acceptance app/quote-accepted app/quote-link-builder` locally,
  or I can neutralize them to `notFound()`.

## Planned — contained, no decision needed (next)

- **#6 (Medium) — PII in console logs.** Gate guest PII (CustomerNames / EmailId /
  PhoneNumber) behind a debug flag in the default log sink; scrub by default.
- **#8 (Medium) — Windows test scripts.** `tsc lib/tbo/*.ts` doesn't glob on
  Windows. Switch the test scripts to a `tsconfig` with an `include` glob.
- **Low/polish:** validate `sellPriceMinor` as a positive integer + email/phone
  format in checkout; `<label>`s on the homepage search form; custom `not-found.tsx`;
  Organization/WebSite JSON-LD. (Some overlap with the conversion enhancements.)

## Verification note

All edits are byte-clean on disk and structurally confirmed via the editor view.
The sandbox shell's compiler keeps reading stale/truncated copies of freshly-edited
files (lexical errors on valid code), so a green `tsc`/test run isn't possible in
this environment — confirm with `npm run build` / `npm run test:payments` locally.
The idempotency change is compatible with all existing tests (the replay test
returns `ignored` via the pre-existing `status==="booked"` check).
