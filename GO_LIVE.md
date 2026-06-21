# HotelRateCheck.com — Go-Live Checklist & Decisions

Status as of 15 Jun 2026. The full booking pipeline is built and works in mock mode
(`TBO_MOCK=1`, `PAYMENTS_MOCK=1`): search (multi-room + children) → results with hotel
names → PreBook review (price, refundability, cancellation, pay-at-hotel) → per-room
lead-guest details → Stripe checkout → TBO Book → confirmation email.

This file tracks everything still needed to go live, beyond the build itself.

## Decisions — made

- **Markup:** deferred. Default 10% over TBO net, never below RecommendedSellingRate. Revisit later.
- **Email provider:** Zoho — via **ZeptoMail** (Zoho's transactional email API; the Zoho Mail mailbox itself isn't suitable for automated booking emails). (`ZohoNotifier` is built; needs a ZeptoMail Send-Mail token + verified sender — see Config.)
- **Currency:** charge customers in **GBP**; their own bank handles any conversion. No multi-currency charging.
- **Refunds:**
  - Refundability follows the rate's supplier policy, shown before payment.
  - **Auto full refund** when a booking fails after payment (rate gone / Book fails). *(small build pending)*
  - **Manual** for customer-initiated cancellations within a refundable window (call TBO Cancel, confirm charge, refund balance). Automate later.

## Decisions — still open

- **Display FX converter?** Optional, display-only ("≈ €X, charged in £Y"). Easy to add. Yes/no?
- **Markup %** — when ready (currently 10%).

## Information needed from you

- **Company registration number + registered office address** — required on Contact/Terms (UK e-commerce law). Not yet inserted.
- **Sender email + domain for Resend** (e.g. bookings@hotelratecheck.com) so the domain can be verified (SPF/DKIM).
- **Solicitor review** of Terms/Privacy/Cookies copy (recommended before taking live payments).

## Questions to put to TBO

- **What currency are our B2C hotel rates returned in?** (Determines whether any net→GBP FX is needed. If GBP, no FX anywhere.)
- The certification test-case list / sample checklist (referenced but not yet supplied).
- Production base URL (shared only after certification).
- Production QPM limit for our account (staging is 30 QPM).

## Config (when accounts/credentials are ready)

- **TBO:** `TBO_USERNAME`, `TBO_PASSWORD` (after deposit); base URL set to staging `https://api.tbotechnology.in/HotelAPI`; confirm whether static-IP egress is required.
- **Stripe:** live secret key + publishable key + **webhook signing secret**, and **register the webhook endpoint** (`/api/payments/webhook`) in the Stripe dashboard. Turn off `PAYMENTS_MOCK`.
- **Zoho ZeptoMail:** `ZEPTOMAIL_TOKEN` (Send-Mail token) + `EMAIL_FROM` + `ZEPTOMAIL_API_URL` for your region (EU default) + verify the sending domain in ZeptoMail (SPF/DKIM). Turn off `NOTIFY_MOCK`.
- **Vercel KV:** attach a KV store so `KV_REST_API_URL` / `KV_REST_API_TOKEN` are injected (the in-memory quote store does not survive serverless). Set `BOOKING_MODE=auto`, `HRC_ADMIN_USERNAME` / `HRC_ADMIN_PASSWORD`.
- **Pricing markup:** `PRICE_MARKUP_PERCENT` — customer markup over TBO net, e.g. `PRICE_MARKUP_PERCENT=18`. Unset, blank, or out-of-range (outside `0`–`100`) falls back to the default 10%. Never sells below `RecommendedSellingRate`.

## Build remaining (can be done now, no credentials)

- Auto-refund on failed booking (execute Stripe refund in the `refund_due` path).
- Display-only FX converter (if wanted).
- Customer "view / cancel my booking" page (uses BookingDetail + Cancel).
- Amendments = "contact us" copy + route (TBO has no amendments API).
- Insert company number + registered office into Contact/Terms (needs the info above).

## Build remaining (needs live TBO responses)

- Tune the static-content parser in `lib/booking/destination.ts` (CityList / HotelCodeList / HotelDetails shapes are untyped in the spec — defensive parsing is in place but must be verified against real responses).
- Consider a scheduled **static-content ingest** (download TBO's hotel master monthly into a store) instead of live CityList lookups per search — better performance and avoids the 30 QPM ceiling.

## Certification

- Run real staging test bookings (refundable rates), capture full JSON logs for Search / PreBook / Book / BookingDetail.
- Provide TBO a password-protected staging portal (the site's internal pages are already behind Basic Auth via `middleware.ts`).
- Demonstrate the complete booking flow incl. price display, cancellation policy, AtProperty supplements and the customer acceptance step.
