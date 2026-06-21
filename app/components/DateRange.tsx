"use client";
import { useState } from "react";

function nextDay(d: string): string {
  const x = new Date(d + "T00:00:00Z");
  x.setUTCDate(x.getUTCDate() + 1);
  return x.toISOString().slice(0, 10);
}

export default function DateRange({
  defaultCheckIn, defaultCheckOut, min,
}: { defaultCheckIn: string; defaultCheckOut: string; min: string }) {
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  return (
    <>
      <label className="rounded-2xl px-4 py-3 transition hover:bg-white/5 md:border-l md:border-white/10">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">Check-in</span>
        <input
          required name="checkIn" type="date" min={min} value={checkIn}
          onChange={(e) => { setCheckIn(e.target.value); if (e.target.value >= checkOut) setCheckOut(nextDay(e.target.value)); }}
          className="mt-1.5 w-full bg-transparent text-[15px] font-medium text-white outline-none [color-scheme:dark]"
        />
      </label>
      <label className="rounded-2xl px-4 py-3 transition hover:bg-white/5 md:border-l md:border-white/10">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">Check-out</span>
        <input
          required name="checkOut" type="date" min={nextDay(checkIn)} value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="mt-1.5 w-full bg-transparent text-[15px] font-medium text-white outline-none [color-scheme:dark]"
        />
      </label>
    </>
  );
}
