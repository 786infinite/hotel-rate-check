# Hotel Rate Check — Site Analysis & Enhancement Plan
_21 Jun 2026 · covers the two issues you flagged + a prioritised gap analysis vs leading hotel-only booking sites._

---

## 1. The two things you flagged

### A) "Characters look different" — it's the FONTS, not corrupted text
**Verified:** byte-scanned every `.tsx/.ts/.css` file. Every special glyph (`— £ → · ' © …`) is correct UTF-8. There is **no mojibake** (no `Â£`, no `â€"`, no `�`). So the text itself is fine.

The fonts are wired correctly:
- `app/layout.tsx` loads `Fraunces` + `Inter` via `next/font/google` → CSS vars `--font-fraunces` / `--font-inter`.
- `app/globals.css` → body uses `--font-inter`; `.font-display` / `.font-display-italic` use `--font-fraunces`.

**So why does it look off?** The headings are falling back to **Georgia / system serif** because `next/font` isn't actually serving Fraunces/Inter. Two likely causes:
1. **Stale `.next` cache** left over from the earlier broken builds (most likely).
2. **`next/font/google` can't fetch the fonts at build time** (offline / network-restricted dev box). When the fetch fails, Next silently uses the fallback serif — which reads as "different characters."

**Fix — do this first (1 min):**
```
# stop dev server, then:
Remove-Item -Recurse -Force .next
npm run dev
```
Hard-refresh (Ctrl+F5). If the headings now render in the clean Fraunces serif, it was the cache.

**If it's STILL wrong → self-host the fonts** (removes the network dependency entirely): switch `next/font/google` → `next/font/local` with the Fraunces + Inter `.woff2` files in `app/fonts/`. I can wire this for you — it makes the build deterministic and faster, and is the right call for production anyway.

---

### B) "Logic isn't right" — what I actually found

The booking **engine** logic is solid: pricing is server-only, the TBO net/wholesale cost never reaches the browser, and the sell price is re-derived server-side before charging. No problems there.

The issues are in the **layer you see** — homepage + search wiring:

| # | Issue | Where | Severity | Fix |
|---|-------|-------|----------|-----|
| L1 | Destination tiles ("Paris → View hotels") and the featured card ("Search hotels →") just **scroll to the search box** (`href="#book"`) — they don't run a search. Feels broken. | `app/page.tsx` | High | Link to `/search?destination=Paris&checkIn=…&checkOut=…` with sensible default dates, OR have them prefill + submit the hero search. |
| L2 | Hero date pickers have **no `min` (past dates allowed)** and **no check that check-out is after check-in**. A bad range is silently clamped to 1 night server-side. | `app/page.tsx` hero form | Med | `min={today}` on both; default check-in = tomorrow, check-out = +2; block check-out ≤ check-in. |
| L3 | Result cards show each hotel's **native currency** (could be EUR/USD from TBO) but checkout charges **GBP**. Mismatch is confusing and can trip the GBP guard. | `app/search/page.tsx` + `lib/booking/public.ts` | Med | Decide policy: display GBP everywhere (convert for display) or label "≈ charged in GBP at checkout". (Ties to the FX decision in memory.) |
| L4 | Until TBO credentials are in, search returns **sample/mock hotels**. Correct by design, but a first-time viewer reads it as "the logic is wrong." | mock `HotelIndex` | Low | Add a small "Sample data — live rates once connected" ribbon in non-production. |

None of these are engine bugs — they're wiring/UX gaps that make the site *feel* incorrect.

---

## 2. Gap analysis vs leading hotel-only booking sites

Researched Booking.com, Hotels.com, citizenM, Mr & Mrs Smith, Premier Inn, Hilton/Marriott direct, plus CRO/UX sources (Baymard, NN/g, the CMA rulings on OTA dark patterns). Your **transparency promise is a real wedge** — the big OTAs were legally forced (CMA 2019, expanded 2025) to drop fake urgency and hidden fees, so "every charge shown, honestly" is yours to own. Several items below are the *honest* version of patterns they got fined for.

Effort: **L** = low · **M** = medium · **H** = high.

### MUST-HAVE (table stakes / directly your brand)
- **All-in price on every result card, per-night + total, "incl. all taxes & fees" (M)** — your differentiator; surface the TBO rate breakdown.
- **Refundable / non-refundable badges everywhere, with concrete dates** ("Free cancellation until 23:59, 14 Aug") (L). You already mark refundable on cards — extend to real dates + checkout summary.
- **Core filters: price, stars, free-cancellation-only, board, distance** + filter chips, result count, "clear all" (M). Free-cancellation must be a top-level filter.
- **Sort: price / stars / distance**, with a transparent default (L).
- **Guest checkout, minimal fields, progress steps, persistent all-in breakdown** (L–M).
- **Confirmation page + email with the full price breakdown + cancellation + support contact** (M).
- **Homepage hero search above the fold + 3 transparency value props** (you have the hero; add the 3 props) (L).

### HIGH-IMPACT
- **Group room rates by room type with option toggles** (board / refundable / pay-now) instead of stacking 7 near-identical rows — the classic "Agoda overload" failure (M).
- **Map view with all-in price pins** (list ↔ map toggle) — biggest "feels like a real booking site" gap (H; defer if tight).
- **Skeleton loading** on results + room lists — the wholesale API is slow; skeletons beat spinners (L).
- **Mobile sticky bottom CTA bar** ("Book — £X all-in") + **proper mobile date picker** (M). Mobile is most traffic and converts lowest.
- **Business/contractor block**: VAT receipt, company/cost-centre field, downloadable invoice (M) — speaks to your second audience; few OTAs lead with it.
- **Secure-payment trust signals at the card step** ("Payments secured by Stripe", card logos, lock) (L).

### NICE-TO-HAVE
- Destination inspiration tiles that **prefill a real search** (fixes L1 too) (M).
- Photo gallery + lightbox on the hotel/room page (M).
- Trustpilot slot designed now, populated once you have real post-stay reviews (M).

### DO NOT (breaks the honesty brand)
- ❌ Countdown timers, "12 people viewing", "booked 3 min ago", strategically-shown "sold out" — the exact dark patterns the CMA fined OTAs for.
- ❌ Borrowed / scraped review widgets, or any fabricated rating.
- ✅ Honest alternatives: real per-rate allotment only ("3 rooms left at this rate"), "your price is held while you book", and genuine free-cancellation reassurance — which removes the *need* for fake pressure.

---

## 3. ui-ux-pro-max quick wins (apply across pages)
- **Touch targets ≥44px**, **8px+ spacing** — check the occupancy stepper buttons and mobile filter controls.
- **Skeletons** for anything > ~300ms (search, prebook) — never a bare spinner on the slow API.
- **Reserve image space** (`next/image` width/height or aspect-ratio) to keep **CLS < 0.1**; convert hero/gallery to WebP/AVIF.
- **Inline form validation on blur** (dates, guest details), error below the field, focus first invalid field on submit.
- **One primary CTA per screen**; visible focus rings; 4.5:1 contrast (check gold-on-cream text).
- Tabular figures for prices to stop layout shift in result/total columns.

---

## 4. Do-first list (ranked)
1. **Clean `.next` rebuild** → confirm fonts load (fixes "characters") (L). _If not, self-host fonts._
2. **Make destination tiles + featured card run a real search** (fixes L1) (M).
3. **Date picker min/defaults/validation** (L2) (L).
4. **All-in price + refundable badges + concrete cancellation dates** on result cards (M).
5. **Core filters + sort + chips** on `/search` (M).
6. **Skeleton loading** on search/prebook (L).
7. **Mobile sticky CTA + mobile date picker** (M).
8. **Guest checkout polish**: minimal fields, progress, persistent breakdown (L–M).
9. **Confirmation page + email** completeness (M).
10. **Currency display policy** (L3) + **sample-data ribbon** (L4) (L).

_Sources: Baymard, NN/g, Hotelchamp, GOV.UK/CMA OTA rulings, web.dev Core Web Vitals, WCAG 2.2._
