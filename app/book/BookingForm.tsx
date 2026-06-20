"use client";

import { useState } from "react";

const fieldLabel = "block text-[11px] font-bold uppercase tracking-wide text-gray-500";
const fieldInput =
  "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#b88434] focus:ring-2 focus:ring-[#d8a84f]/30";

type Title = "Mr" | "Mrs" | "Ms";
interface Guest {
  title: Title;
  firstName: string;
  lastName: string;
}

export default function BookingForm({
  bookingCode,
  hotel,
  checkIn,
  checkOut,
  priceLabel,
  rooms = 1,
  expectedMinor,
}: {
  bookingCode: string;
  hotel: string;
  checkIn: string;
  checkOut: string;
  priceLabel: string;
  rooms?: number;
  expectedMinor: number;
}) {
  const roomCount = Math.max(1, rooms);
  const [guests, setGuests] = useState<Guest[]>(
    Array.from({ length: roomCount }, () => ({ title: "Mr" as Title, firstName: "", lastName: "" })),
  );
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function patchGuest(i: number, patch: Partial<Guest>) {
    setGuests((gs) => gs.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/book/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingCode, hotel, checkIn, checkOut, guests, email, phone, expectedMinor }),
      });
      const data = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (!res.ok || !data.checkoutUrl) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="text-lg font-black">Guest details</h2>
      <p className="mt-1 text-sm text-gray-600">
        {roomCount === 1 ? "The lead guest for this booking." : "A lead guest for each room."}
      </p>

      {guests.map((g, i) => (
        <div key={i} className={i > 0 ? "mt-5 border-t border-gray-100 pt-4" : "mt-4"}>
          {roomCount > 1 && (
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-[#b88434]">Room {i + 1}</p>
          )}
          <div className="grid gap-3 sm:grid-cols-3">
            <label>
              <span className={fieldLabel}>Title</span>
              <select
                value={g.title}
                onChange={(e) => patchGuest(i, { title: e.target.value as Title })}
                className={fieldInput}
              >
                <option>Mr</option>
                <option>Mrs</option>
                <option>Ms</option>
              </select>
            </label>
            <label>
              <span className={fieldLabel}>First name</span>
              <input required value={g.firstName} onChange={(e) => patchGuest(i, { firstName: e.target.value })} className={fieldInput} />
            </label>
            <label>
              <span className={fieldLabel}>Last name</span>
              <input required value={g.lastName} onChange={(e) => patchGuest(i, { lastName: e.target.value })} className={fieldInput} />
            </label>
          </div>
        </div>
      ))}

      <div className="mt-5 border-t border-gray-100 pt-4">
        <p className="mb-2 text-xs font-black uppercase tracking-wide text-gray-500">Booking contact</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className={fieldLabel}>Email</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className={fieldInput} />
          </label>
          <label>
            <span className={fieldLabel}>Phone</span>
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Mobile number" className={fieldInput} />
          </label>
        </div>
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b1b2e] px-7 py-4 text-base font-bold text-white transition hover:bg-[#b88434] disabled:opacity-60"
      >
        {loading ? "Taking you to secure payment…" : `Pay ${priceLabel} securely`}
      </button>
      <p className="mt-2 text-center text-xs text-gray-500">
        Your booking is confirmed once the hotel confirms it. We email your confirmation or voucher.
      </p>
    </form>
  );
}
