# TBO Hotel API client (`lib/tbo`)

Server-side TypeScript client for the TBO Holidays Hotel API v2.1. Staging-ready;
drop in credentials and it connects. **Never import these modules into client
components** — they read TBO credentials from the environment.

## Environment variables

Set in `.env.local` (local) and in the Vercel project (deploy). `.env.local` is gitignored.

| Var            | Purpose                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| `TBO_BASE_URL` | `http://api.tbotechnology.in/TBOHolidays_HotelAPI` for staging. HTTPS production URL after certification. |
| `TBO_USERNAME` | Basic Auth username (issued by TBO after deposit/certification).        |
| `TBO_PASSWORD` | Basic Auth password.                                                    |

Until `TBO_USERNAME`/`TBO_PASSWORD` are set, any call throws a clear "credentials missing" error.

## Files

| File              | Responsibility                                                            |
| ----------------- | ------------------------------------------------------------------------- |
| `types.ts`        | Exact request/response types + enums from the spec.                       |
| `config.ts`       | Env-based base URL + Basic Auth header; per-method timeouts.              |
| `status.ts`       | TBO status codes, descriptions, retriable/fresh-search helpers.          |
| `client.ts`       | POST/JSON/Basic-Auth fetch wrapper, timeouts, error mapping (`TboApiError`). |
| `logging.ts`      | Certification-grade JSON request/response logging (card data redacted).  |
| `methods.ts`      | `search`, `preBook`, `book`, `cancel`, `bookingDetail`, static content.  |
| `booking-flow.ts` | `bookWithRecovery` — enforces the 120s BookingDetail recovery rule.       |
| `pricing.ts`      | `priceForCustomer` — markup + RecommendedSellingRate floor + pay-at-hotel.|
| `filters.ts`      | `filterSellableRooms` — suppress package/flight-only rates.               |
| `index.ts`        | Barrel export. Import via `@/lib/tbo`.                                    |

## Booking rules enforced

- **PreBook before payment** — re-validate price/availability/cancellation each time.
- **Never sell below `RecommendedSellingRate`** — `priceForCustomer` clamps up to it.
- **Show `AtProperty` supplements** as separate pay-at-hotel charges; never folded into your price.
- **Suppress package/airline-only rates** via `filterSellableRooms`.
- **Book timeout recovery** — on timeout/network/HTTP failure, `bookWithRecovery` waits 120s
  then calls `BookingDetail` by `BookingReferenceId`. It **never retries Book** on uncertainty.
- **Never expose** TBO net/wholesale rates to customers (internal logs only).

## Example (server action / route handler)

```ts
import * as tbo from "@/lib/tbo";

// 1. Search
const s = await tbo.search({
  CheckIn: "2026-08-01",
  CheckOut: "2026-08-03",
  HotelCodes: "1120548",
  GuestNationality: "GB",
  PaxRooms: [{ Adults: 2, Children: 0, ChildrenAges: [] }],
  IsDetailedResponse: false,
});

// 2. PreBook the chosen room immediately before payment
const code = s.HotelResult![0].Rooms[0].BookingCode;
const pb = await tbo.preBook({ BookingCode: code });
const hotel = pb.HotelResult![0];

// 3. Filter to hotel-only rooms and price for the customer
const rooms = tbo.filterSellableRooms(hotel);
const price = tbo.priceForCustomer(rooms[0], hotel.Currency); // sellPrice, payAtHotel[], clampedToFloor

// 4. Take payment via Stripe, verify the webhook, THEN book:
const outcome = await tbo.bookWithRecovery({
  BookingCode: rooms[0].BookingCode,
  CustomerDetails: [{ CustomerNames: [{ Title: "Mr", FirstName: "A", LastName: "B", Type: "Adult" }] }],
  ClientReferenceId: "internal-123",
  BookingReferenceId: tbo.newBookingReferenceId(),
  TotalFare: rooms[0].TotalFare,
  EmailId: "guest@example.com",
  PhoneNumber: "447000000000",
});

switch (outcome.status) {
  case "confirmed":
  case "confirmed_via_recovery":
    // generate voucher from BookingDetail, email the customer
    break;
  case "no_booking":
  case "failed":
    // refund via Stripe or offer an alternative
    break;
}
```

## Not included (next steps)

- Stripe Checkout + webhook that triggers `bookWithRecovery` after verified payment.
- Internal protected dashboard (search/PreBook/quote builder/log export).
- Voucher/confirmation PDF generation from `BookingDetail` (TBO returns data, not a PDF).
- Persistent log sink (`setTboLogSink`) writing to DB/file for certification export.
- Production static-IP egress (TBO whitelists a fixed IP for live; plain Vercel serverless won't suffice).
