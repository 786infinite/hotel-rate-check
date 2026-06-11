"use client";

import { useState } from "react";

interface PayAtHotelCharge { description: string; price: number; currency: string }
interface SearchRoom {
  name: string[]; bookingCode: string; mealType?: string; isRefundable: boolean;
  netCost: number; sellPrice: number; recommendedSellingRate: string | null;
  clampedToFloor: boolean; payAtHotel: PayAtHotelCharge[];
}
interface SearchHotel { hotelCode: string; currency: string; rooms: SearchRoom[] }
interface CancelPolicy { FromDate: string; ChargeType: string; CancellationCharge: number; Index?: string }
interface PreBookResult {
  status: string; sellable: boolean; packageOnly: boolean; currency: string;
  room: {
    name: string[]; bookingCode: string; mealType?: string; isRefundable: boolean;
    netCost: number; sellPrice: number; recommendedSellingRate: string | null;
    clampedToFloor: boolean; grossMargin: number; payAtHotel: PayAtHotelCharge[]; cancelPolicies: CancelPolicy[];
  };
  rateConditions: string[];
}

const inputClass = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none";
const labelClass = "block text-xs font-medium text-gray-600 mb-1";

function newReference(): string {
  return `HRC${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`.slice(0, 25);
}

export default function RateSearchClient() {
  const [form, setForm] = useState({
    CheckIn: "", CheckOut: "", HotelCodes: "1120548", GuestNationality: "GB",
    Adults: 2, Children: 0, ChildrenAges: "", markupPct: 10,
  });
  const [hotels, setHotels] = useState<SearchHotel[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [preBook, setPreBook] = useState<PreBookResult | null>(null);
  const [preBookError, setPreBookError] = useState<string | null>(null);
  const [preBookingCode, setPreBookingCode] = useState<string | null>(null);

  // Payment-link panel state
  const [pay, setPay] = useState({ title: "Mr", firstName: "", lastName: "", email: "", phone: "" });
  const [creatingLink, setCreatingLink] = useState(false);
  const [payResult, setPayResult] = useState<{ checkoutUrl: string; reference: string } | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function runSearch() {
    setSearching(true); setSearchError(null); setHotels(null);
    setPreBook(null); setPreBookError(null); setPayResult(null); setPayError(null);
    const childrenAges = form.ChildrenAges.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => Number.isFinite(n));
    try {
      const res = await fetch("/api/tbo/search", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CheckIn: form.CheckIn, CheckOut: form.CheckOut, HotelCodes: form.HotelCodes, GuestNationality: form.GuestNationality,
          PaxRooms: [{ Adults: Number(form.Adults), Children: Number(form.Children), ChildrenAges: childrenAges }],
          markupPct: Number(form.markupPct),
        }),
      });
      const data = await res.json();
      if (!res.ok) setSearchError(data.error ?? "Search failed");
      else if (data.status === "no_availability") setHotels([]);
      else setHotels(data.hotels as SearchHotel[]);
    } catch { setSearchError("Network error calling search"); }
    finally { setSearching(false); }
  }

  async function runPreBook(bookingCode: string) {
    setPreBookingCode(bookingCode); setPreBook(null); setPreBookError(null); setPayResult(null); setPayError(null);
    try {
      const res = await fetch("/api/tbo/prebook", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ BookingCode: bookingCode, markupPct: Number(form.markupPct) }),
      });
      const data = await res.json();
      if (!res.ok) setPreBookError(data.error ?? "PreBook failed");
      else setPreBook(data as PreBookResult);
    } catch { setPreBookError("Network error calling prebook"); }
    finally { setPreBookingCode(null); }
  }

  async function createPaymentLink() {
    if (!preBook) return;
    setCreatingLink(true); setPayError(null); setPayResult(null);
    const reference = newReference();
    const origin = window.location.origin;
    try {
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference,
          bookingCode: preBook.room.bookingCode,
          totalFare: preBook.room.netCost,
          sellPriceMinor: Math.round(preBook.room.sellPrice * 100),
          currency: preBook.currency,
          description: preBook.room.name.join(" + "),
          guest: { title: pay.title, firstName: pay.firstName, lastName: pay.lastName },
          email: pay.email, phone: pay.phone,
          successUrl: `${origin}/booking-status?reference=${reference}`,
          cancelUrl: `${origin}/rate-search`,
        }),
      });
      const data = await res.json();
      if (!res.ok) setPayError(data.error ?? "Could not create payment link");
      else setPayResult({ checkoutUrl: data.checkoutUrl, reference: data.reference });
    } catch { setPayError("Network error creating payment link"); }
    finally { setCreatingLink(false); }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900">Rate Search</h1>
      <p className="mt-1 text-sm text-gray-500">
        Internal TBO search &amp; PreBook. Runs against spec fixtures when <code className="rounded bg-gray-100 px-1">TBO_MOCK=1</code>;
        live once credentials are set. Net rates shown here are internal only — never expose them to customers.
      </p>

      {/* Search form */}
      <section className="mt-6 rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div><label className={labelClass}>Check-in</label><input type="date" className={inputClass} value={form.CheckIn} onChange={(e) => update("CheckIn", e.target.value)} /></div>
          <div><label className={labelClass}>Check-out</label><input type="date" className={inputClass} value={form.CheckOut} onChange={(e) => update("CheckOut", e.target.value)} /></div>
          <div><label className={labelClass}>Hotel codes</label><input className={inputClass} value={form.HotelCodes} onChange={(e) => update("HotelCodes", e.target.value)} /></div>
          <div><label className={labelClass}>Nationality (ISO-2)</label><input className={inputClass} value={form.GuestNationality} onChange={(e) => update("GuestNationality", e.target.value.toUpperCase())} /></div>
          <div><label className={labelClass}>Adults</label><input type="number" min={1} max={8} className={inputClass} value={form.Adults} onChange={(e) => update("Adults", Number(e.target.value))} /></div>
          <div><label className={labelClass}>Children</label><input type="number" min={0} max={4} className={inputClass} value={form.Children} onChange={(e) => update("Children", Number(e.target.value))} /></div>
          <div><label className={labelClass}>Children ages</label><input className={inputClass} value={form.ChildrenAges} placeholder="e.g. 5, 9" onChange={(e) => update("ChildrenAges", e.target.value)} /></div>
          <div><label className={labelClass}>Markup %</label><input type="number" min={0} className={inputClass} value={form.markupPct} onChange={(e) => update("markupPct", Number(e.target.value))} /></div>
        </div>
        <button onClick={runSearch} disabled={searching} className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
          {searching ? "Searching…" : "Search"}
        </button>
        {searchError && <p className="mt-3 text-sm text-red-600">{searchError}</p>}
      </section>

      {hotels && hotels.length === 0 && <p className="mt-6 text-sm text-gray-600">No availability for these criteria.</p>}
      {hotels?.map((hotel) => (
        <section key={hotel.hotelCode} className="mt-6">
          <h2 className="text-sm font-semibold text-gray-700">Hotel {hotel.hotelCode} · {hotel.currency}</h2>
          <div className="mt-2 space-y-2">
            {hotel.rooms.map((room) => (
              <div key={room.bookingCode} className="rounded-lg border border-gray-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{room.name.join(" + ")}</p>
                    <p className="text-xs text-gray-500">
                      {room.mealType ?? "—"} · {room.isRefundable ? "Refundable" : "Non-refundable"}
                      {room.clampedToFloor && " · price raised to minimum selling rate"}
                    </p>
                    {room.payAtHotel.length > 0 && (
                      <p className="mt-1 text-xs text-amber-700">
                        Pay at hotel: {room.payAtHotel.map((c) => `${c.price} ${c.currency} (${c.description})`).join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">Sell {room.sellPrice} {hotel.currency}</p>
                    <p className="text-xs text-gray-400">net {room.netCost} {hotel.currency}</p>
                    <button onClick={() => runPreBook(room.bookingCode)} disabled={preBookingCode === room.bookingCode} className="mt-2 rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 disabled:opacity-50">
                      {preBookingCode === room.bookingCode ? "Rechecking…" : "Recheck (PreBook)"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {preBookError && <p className="mt-6 text-sm text-red-600">{preBookError}</p>}

      {preBook && (
        <section className="mt-6 rounded-lg border-2 border-gray-900 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">PreBook result</h2>
            {preBook.sellable
              ? <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Sellable hotel-only</span>
              : <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">Do not sell{preBook.packageOnly ? " — package/airline-only rate" : ""}</span>}
          </div>

          <p className="mt-2 text-sm font-medium text-gray-900">{preBook.room.name.join(" + ")}</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <Stat label="Sell price" value={`${preBook.room.sellPrice} ${preBook.currency}`} />
            <Stat label="Net cost" value={`${preBook.room.netCost} ${preBook.currency}`} muted />
            <Stat label="Gross margin" value={`${preBook.room.grossMargin} ${preBook.currency}`} />
            <Stat label="Refundable" value={preBook.room.isRefundable ? "Yes" : "No"} />
          </div>

          {preBook.room.payAtHotel.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-amber-700">Pay at hotel (show to customer)</p>
              <ul className="mt-1 list-inside list-disc text-xs text-amber-700">
                {preBook.room.payAtHotel.map((c, i) => <li key={i}>{c.price} {c.currency} — {c.description}</li>)}
              </ul>
            </div>
          )}

          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-700">Cancellation policy (final)</p>
            <ul className="mt-1 text-xs text-gray-600">
              {preBook.room.cancelPolicies.map((p, i) => (
                <li key={i}>From {p.FromDate}: {p.ChargeType === "Percentage" ? `${p.CancellationCharge}%` : `${p.CancellationCharge}`} charge</li>
              ))}
              {preBook.room.cancelPolicies.length === 0 && <li>No structured policy returned.</li>}
            </ul>
          </div>

          {preBook.rateConditions.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-semibold text-gray-700">Rate conditions ({preBook.rateConditions.length})</summary>
              <ul className="mt-1 list-inside list-disc text-xs text-gray-500">
                {preBook.rateConditions.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </details>
          )}

          {/* Create payment link */}
          {preBook.sellable && (
            <div className="mt-5 rounded-lg border border-gray-300 bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-700">Create customer payment link</p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                <div>
                  <label className={labelClass}>Title</label>
                  <select className={inputClass} value={pay.title} onChange={(e) => setPay((p) => ({ ...p, title: e.target.value }))}>
                    <option>Mr</option><option>Mrs</option><option>Ms</option>
                  </select>
                </div>
                <div><label className={labelClass}>First name</label><input className={inputClass} value={pay.firstName} onChange={(e) => setPay((p) => ({ ...p, firstName: e.target.value }))} /></div>
                <div><label className={labelClass}>Last name</label><input className={inputClass} value={pay.lastName} onChange={(e) => setPay((p) => ({ ...p, lastName: e.target.value }))} /></div>
                <div><label className={labelClass}>Email</label><input type="email" className={inputClass} value={pay.email} onChange={(e) => setPay((p) => ({ ...p, email: e.target.value }))} /></div>
                <div><label className={labelClass}>Phone</label><input className={inputClass} value={pay.phone} onChange={(e) => setPay((p) => ({ ...p, phone: e.target.value }))} /></div>
              </div>
              <button
                onClick={createPaymentLink}
                disabled={creatingLink || !pay.firstName || !pay.lastName || !pay.email || !pay.phone}
                className="mt-3 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {creatingLink ? "Creating…" : `Create payment link (charge ${preBook.room.sellPrice} ${preBook.currency})`}
              </button>
              {payError && <p className="mt-2 text-sm text-red-600">{payError}</p>}
              {payResult && (
                <div className="mt-3 rounded-md border border-green-300 bg-green-50 p-3 text-sm">
                  <p className="font-semibold text-green-800">Payment link ready · ref {payResult.reference}</p>
                  <p className="mt-1 break-all"><a href={payResult.checkoutUrl} className="text-blue-700 underline" target="_blank" rel="noreferrer">{payResult.checkoutUrl}</a></p>
                  <p className="mt-1 text-xs text-gray-600">Send this to the customer. After paying, they land on the booking-status page.</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function Stat({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`font-semibold ${muted ? "text-gray-400" : "text-gray-900"}`}>{value}</p>
    </div>
  );
}
