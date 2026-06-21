# Pre-Credentials Checklist — everything doable before TBO API access
_Goal: get the entire site + payment + email pipeline production-ready so that when TBO credentials land, go-live is config + certification only, not building._

**Key insight:** payments (Stripe) and email (Zoho ZeptoMail) are independent of TBO. With `TBO_MOCK=1` + `BOOKING_MODE=manual` you can test the WHOLE customer journey for real — search → hotel detail → book → **real Stripe test payment** → confirmation page + receipt + **real confirmation email**. Only the live hotel booking itself waits on TBO.

Env-var names below are exactly what the code reads.

---

## 1. Foundation: Vercel + domain + DNS  (do first — webhooks & email links need the live URL)
- [ ] Create the Vercel project, connect the GitHub repo, deploy (it runs in mock until env is set).
- [ ] Add domain `hotelratecheck.com` (+ `www`) in Vercel; let it issue SSL.
- [ ] Confirm the production URL works (it'll be the base for Stripe webhooks + email).

## 2. Stripe  (you have the account)
- [ ] **Start account activation / business verification (KYC)** now — this can take days; doing it early means live payments are ready when you are.
- [ ] Set the account default currency to **GBP** (the app refuses non-GBP).
- [ ] Grab **test** keys → set `STRIPE_SECRET_KEY` (`sk_test_…`) and `PAYMENTS_PROVIDER=stripe`; leave `PAYMENTS_MOCK` unset so real (test-mode) Stripe is used.
- [ ] Create a **webhook endpoint** → `https://hotelratecheck.com/api/payments/webhook`; subscribe to the checkout/payment-success event the app handles (confirm the exact event in `lib/payments/stripe.ts`). Copy its signing secret → `STRIPE_WEBHOOK_SECRET` (`whsec_…`).
- [ ] In Stripe → Branding/Checkout: set business name, logo, **statement descriptor**, support email/phone.
- [ ] **Test the full pay flow** with Stripe test cards (`4242…`) end-to-end with `BOOKING_MODE=manual` — confirms payment → KV quote → email all fire without TBO.
- [ ] Do **not** enable live customer charges until TBO can actually fulfil (soft-launch after certification).

## 3. Zoho ZeptoMail  (you have the Zoho account)
- [ ] In ZeptoMail, **add + verify the sending domain** `hotelratecheck.com` — add the SPF/DKIM/CNAME records it gives you to DNS.
- [ ] Add a **DMARC** record for the domain (improves inbox placement).
- [ ] Create a Mail Agent → copy the **Send Mail token** → `ZEPTOMAIL_TOKEN`.
- [ ] Set `ZEPTOMAIL_API_URL` to your Zoho **data-centre region** (code defaults to EU `https://api.zeptomail.eu/v1.1/email`; use `.com` for US, `.in` for IN — a region mismatch = auth failure).
- [ ] Set `EMAIL_FROM` = `Hotel Rate Check <bookings@hotelratecheck.com>` (must be a verified sender on the verified domain); leave `NOTIFY_MOCK` unset to send for real.
- [ ] **Test delivery**: run a Stripe test booking → confirm the "payment received" and "booking confirmed" emails arrive and land in the inbox (not spam); tune SPF/DKIM/DMARC until clean.

## 4. Vercel KV  (durable quote store + rate limiter)
- [ ] Provision a Vercel KV (Upstash) store → set `KV_REST_API_URL` + `KV_REST_API_TOKEN`. Without it the store is in-memory (not durable across serverless invocations) — fine for a quick test, but provision before any real bookings.

## 5. Environment variables (set in Vercel now — test values, swap to live later)
Set now:
- [ ] `PAYMENTS_PROVIDER=stripe`, `STRIPE_SECRET_KEY` (test), `STRIPE_WEBHOOK_SECRET` (test)
- [ ] `ZEPTOMAIL_TOKEN`, `ZEPTOMAIL_API_URL`, `EMAIL_FROM`
- [ ] `KV_REST_API_URL`, `KV_REST_API_TOKEN`
- [ ] `BOOKING_MODE=manual`  (collect payment, no TBO call — until certified)
- [ ] `TBO_MOCK=1`  (until credentials arrive)
- [ ] Optional: `COMPANY_NUMBER` / `COMPANY_VAT_NUMBER` only if overriding the built-in real defaults.

Leave for when TBO credentials arrive: `TBO_BASE_URL`, `TBO_USERNAME`, `TBO_PASSWORD`, then flip `TBO_MOCK=0` and (after certification) `BOOKING_MODE=auto`.

## 6. Legal & finance (do now — needed before real sales)
- [ ] **VAT / TOMS:** confirm with your accountant how UK hotel resales are treated (Tour Operators' Margin Scheme) and whether/what VAT invoice you issue. You have VAT GB516006822 and the receipt is built; just confirm the treatment before issuing formal VAT invoices.
- [ ] Finalise **Terms, Privacy, Cookies** (see `legal-wording-suggestions.md`; ideally a solicitor sign-off). Add a **cookie-consent banner** if you add analytics/marketing cookies (UK GDPR/PECR).
- [ ] Confirm the **refund policy** wording matches your actual process (auto-refund on failed booking; manual for cancellations).

## 7. Pricing
- [ ] **Decide the markup %** (deferred earlier). The sell-price seam exists (`priceForCustomer`) — wire and test the markup now against mock prices so it's ready the moment real rates flow.

## 8. Content, SEO, analytics (now)
- [ ] Final pass on homepage copy, destinations, meta/OG/favicon (mostly done), `sitemap`, `robots`.
- [ ] Add privacy-friendly **analytics** (GA4 or Plausible) wired to consent.
- [ ] Make sure `quotes@` / `bookings@` inboxes are real and monitored.

## 9. Pre-launch QA (now — mock + Stripe test)
- [ ] Full walkthrough on desktop + mobile: search → hotel detail (gallery/map/amenities) → book → Stripe test pay → confirmation page → receipt PDF → email.
- [ ] Accessibility + Lighthouse/Core Web Vitals pass.
- [ ] Exercise the failed-booking path (`refund_due`) and check the customer-facing wording.
- [ ] Check 404 / error states.

---

## Blocked on TBO credentials (cannot do yet)
- Live hotel search / availability / pricing / booking.
- TBO **certification** (running their required test cases).
- **Static content ingest** — pulling TBO's hotel master into a search index/DB for real hotel names, images, coordinates, amenities, and destination coverage at scale (the mock + defensive parsers stand in until then).
- Verifying the defensive static-content parsers against real responses.
- Flipping `TBO_MOCK=0` + `BOOKING_MODE=auto`.

_See `GO_LIVE.md` for the credential-day cutover steps._
