# Independent code audit — hotel-rate-check (15 Jun 2026)

A fresh clean-room read of every file under `app/`, `lib/`, `middleware.ts`,
`next.config.ts`, configs — not a re-triage of the earlier VS Code audit.

## Verdict

Feature-complete and architecturally sound. **No build-blockers found by reading.**
But two correctness items should be resolved before selling, and — most importantly —
**none of this has been verified by an actual `next build` / test run** (the sandbox
compiler couldn't read freshly-edited files). Run the build + tests locally first.

## Verified solid (read and confirmed correct)

- **No build-blockers**: barrel exports resolve; all icons exist; all 8 SEO slugs
  match `SEO_CONTENT`; `after` import valid in Next 16; no server-only module is
  imported into a `"use client"` component; `next/image` domains match usage.
- **Payment security**: webhook verifies HMAC over `t.rawBody`, enforces ±300s
  replay window, `timingSafeEqual`; raw body read before parse; nodejs runtime.
- **Idempotency**: atomic `claim()` (KV `SET NX EX`) before booking; webhook fulfils
  in `after()` and 200s immediately — no double-book, no retry storm.
- **Net cost never leaks**: customer-facing types expose only `sellPrice`;
  `netTotalFare`/`RecommendedSellingRate` are server-only; net fields appear only
  under the Basic-Auth-protected `/api/tbo/*`.
- **Pricing floor / package filter / safe Book flow / occupancy limits / currency
  guard / status handling** all correct (see earlier notes).
- **Route-param + env-var consistency** verified end to end.

## Fixed in this pass

- **Orphan spam relay removed** — `app/api/rate-check/route.ts` was a live,
  unauthenticated POST relaying arbitrary data to Formspark with no caller. Now
  returns 410. (`git rm -r app/api/rate-check` locally.)
- **`robots.ts`** — dropped the removed quote-* paths; added `/book` + `/search`.
- **Rate limiter** — now logs when KV is unavailable (it fails open by design).

## Open — resolve before / soon after go-live

- **MEDIUM — multi-room booking is built on an unverified assumption.**
  `quoteForBooking` / `publicPreBook` use `rooms[0]` and one `BookingCode` +
  `TotalFare`. Multi-room *search* works, and we collect a lead guest per room, but
  PreBook/price/Book act on a single room's rate. **This is only correct if a TBO
  multi-room Search returns one `BookingCode` whose `TotalFare` covers all rooms.**
  The mock fixture is single-room so this can't be confirmed offline. **Action:**
  verify against a real multi-room TBO response during certification; until then,
  either confirm the bundled-rate model or restrict search to 1 room.
- **MEDIUM — price-drift could silently overcharge.** `quoteForBooking` re-PreBooks
  at payment time and charges the *current* price. TBO rates are live; if the rate
  rose between the `/book` render and submit, the customer pays more than shown with
  no confirmation. **Action:** send the displayed price from the client and reject
  (409 "price changed — please review") beyond a small tolerance. (~30 min build.)
- **LOW — `/api/payments/create-checkout` trusts client price.** It's Basic-Auth
  staff-only (contained), but unlike the public route it doesn't re-derive price
  server-side. Re-derive from `bookingCode` for defence-in-depth, or treat as
  formally staff-trusted.

## The one caveat that matters most

**The build is unverified.** Everything above is from reading the code; the sandbox
could not compile it. Before paying the TBO deposit, run locally and confirm green:

```
npm run build
npm run test:tbo
npm run test:payments
```

If those pass, the code is in good shape. If `build` flags a `TS1127` "Invalid
character" on any file, that's the known trailing-NUL artifact — re-save that file
in your editor and rebuild.
