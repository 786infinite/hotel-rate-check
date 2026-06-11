# TBO Integration — Status & Handoff

**Last updated:** 2026-06-10

Server-side TBO Holidays Hotel API integration for HotelRateCheck.com, built to
spec v2.1. Staging-ready and fully runnable offline (mock mode) before live
credentials/deposit. Net rates are internal-only and never reach customers.

## What's built

- `lib/tbo/` — typed API client: Search, PreBook, Book, Cancel, BookingDetail,
  static content. Basic Auth, per-method timeouts, status mapping, certification
  logging (card data redacted).
  - `bookWithRecovery` enforces the mandatory 120s BookingDetail recovery and
    never retries Book on an uncertain result.
  - `priceForCustomer` applies markup and clamps up to `RecommendedSellingRate`;
    surfaces `AtProperty` charges as separate pay-at-hotel items.
  - `filterSellableRooms` suppresses package/airline-only rates.
  - Mock mode (`TBO_MOCK=1`) returns spec fixtures — no credentials/network.
- `app/api/tbo/search` + `app/api/tbo/prebook` — protected route handlers.
- `app/rate-search` — internal dashboard (search → PreBook → price, cancellation,
  pay-at-hotel, rate conditions, margin, package-only warning). Doubles as the
  certification demo.
- `middleware.ts` — Basic Auth + noindex now also cover `/rate-search` and `/api/tbo`.
- `lib/tbo/__tests__/logic.test.cjs` — 12 logic tests (`npm run test:tbo`).

## Environment variables (.env.local — gitignored)

| Var | Value |
| --- | --- |
| `TBO_MOCK` | `1` to run offline against fixtures; unset/`0` for live |
| `TBO_BASE_URL` | `http://api.tbotechnology.in/TBOHolidays_HotelAPI` (staging); HTTPS production URL after certification |
| `TBO_USERNAME` / `TBO_PASSWORD` | Basic Auth — issued by TBO after deposit/certification |

## Try it now (offline)

1. Ensure `.env.local` has `TBO_MOCK=1` and `HRC_ADMIN_USERNAME`/`HRC_ADMIN_PASSWORD` set.
2. `npm run dev`, open `/rate-search`, log in with the admin Basic Auth.
3. Click **Search** then **Recheck (PreBook)** — runs against spec fixtures.
4. `npm run test:tbo` runs the logic tests.

## When credentials arrive

1. Put `TBO_USERNAME`/`TBO_PASSWORD` in `.env.local` and Vercel; set `TBO_MOCK=0` (or remove it).
2. Run the certification test cases through `/rate-search`; export JSON logs.
3. Solve production static-IP egress before going live (plain Vercel serverless has no fixed outbound IP).

## Not yet built (next)

- Stripe Checkout + webhook that calls `bookWithRecovery` after verified payment.
- Voucher/confirmation generation from BookingDetail (TBO returns data, not a PDF).
- Persistent log sink (`setTboLogSink`) → DB/file for certification export.
- Quote builder / customer-facing flow.

## Verification status

- `npx tsc --noEmit` — passes (whole project).
- `npm run test:tbo` — 12/12 pass.
- `npx eslint lib/tbo` — clean.
- `npm run build` — run on your machine; it could not complete in the build
  sandbox due to a read-only `.next` directory (environment-only, not a code issue).
