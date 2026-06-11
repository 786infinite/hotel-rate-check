# HotelRateCheck.com — Website Audit

**Date:** 2026-06-12 · Scope: full codebase (`app/`, `lib/`, config) of the Next.js site.

## Verdict
Healthy and coherent. The site now reads as an online hotel-booking platform end to end,
the build is clean (type-checks, lints, 23 tests pass), security basics are sound, and the
SEO foundation is in place. A handful of medium/low fixes below would tighten accessibility,
rich-results and abuse-resistance before go-live.

---

## What's good

- **Build health:** source `tsc` PASS, `eslint app` PASS, `test:tbo` 12/12, `test:payments` 11/11.
- **Secrets hygiene:** `.env*` gitignored; `.env.local` not tracked; no hardcoded API keys/secrets in source.
- **Routing & access control:**
  - Admin/internal protected by Basic Auth + noindex: `/rate-search`, `/api/tbo/*`, `/quote-link-builder`.
  - Payment webhook correctly **public** (so Stripe can call it); signature-verified in code.
  - Transient/private pages noindexed: booking-status, payment-received, quote-acceptance, quote-accepted, quote-link-builder, rate-search, thank-you.
- **SEO foundation:** `robots.ts` (9 internal paths disallowed), `sitemap.ts` (14 URLs), `metadataBase` set; metadata on every public page (home inherits from root layout); canonical + Service/Article + FAQ JSON-LD on all 10 SEO pages.
- **Positioning:** fully consistent "book hotels online" model — zero "manual / we'll get back to you" residue in public copy — while keeping the protective legal lines (hotel-only, terms before pay, confirmed once the hotel confirms, refund-if-not-fulfilled).
- **Images:** no raw `<img>` tags.

---

## Findings & recommendations

### High
1. **Not yet committed/deployed from here.** This session's work is on disk but git can't write in the sandbox. Commit + `npm run build` + push from your machine to bank and deploy it.
2. **Booking/payment is gated to mock (by design).** The public site presents online booking, but no real transaction can complete until Stripe live keys + TBO certification land (env flip). Keep copy honest until then (currently it is). Do **not** flip `PAYMENTS_MOCK`/`BOOKING_MODE` live until both a payment provider and a supplier path are real.

### Medium
3. **Forms have no `<label>` elements** (homepage booking form, contact, rate-check) — inputs use placeholders only. This is a WCAG/accessibility gap and hurts autofill and screen readers. Add proper `<label>`s (visually hidden if you want to keep the look).
4. **No Organization / WebSite JSON-LD sitewide**, and the **homepage FAQ section has no FAQPage schema**. Adding these improves rich results and brand knowledge-panel eligibility. (The 10 SEO pages already have JSON-LD; the homepage and core pages do not.)
5. **Core pages lack explicit canonical** (home, contact, privacy, terms, cookies). Low duplicate-content risk, but add `alternates.canonical` for completeness.
6. **`POST /api/payments/create-checkout` is public and unauthenticated.** Anyone could spam it to create quotes (KV writes) and Stripe sessions. Before go-live add a guard: rate-limiting, an origin/referer check, a CAPTCHA/Turnstile, or a short-lived token from the page.

### Low
7. **No custom `not-found.tsx` / error page** — add a branded 404/500 for polish.
8. **Stale `.next` generated types** are corrupted in the sandbox (can't delete here); they regenerate on your machine's `npm run build`. Not a code issue.
9. Build artifacts (`.tbo-build`, `.pay-build`, `tsconfig.check.json`) are gitignored — fine; they exist only from sandbox testing.
10. Homepage example figures (£649 etc.) are illustrative — they're labelled "Example", which is correct; keep it that way to avoid implying a guaranteed price.

---

## Quick wins (small, high-value)
- Add `<label>`s to the three forms (accessibility).
- Add Organization + WebSite JSON-LD in the root layout, and FAQPage JSON-LD on the homepage.
- Add `alternates.canonical` to the five core pages.
- Add a basic guard (rate-limit/origin/Turnstile) to `create-checkout` before go-live.
- Add `app/not-found.tsx`.

## Pre-go-live gates (external, yours)
- TBO: deposit → staging credentials → certification; solve static-IP egress.
- Stripe: live keys; attach Vercel KV (`KV_REST_API_URL`/`TOKEN`).
- Then flip `PAYMENTS_MOCK=0`, add TBO creds, and set `BOOKING_MODE` per your certification status.
- Legal copy from `legal-wording-suggestions.md` reviewed by a solicitor and pasted into `/terms` and `/privacy`.
