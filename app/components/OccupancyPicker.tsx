"use client";

import { useEffect, useRef, useState } from "react";
import {
  type RoomOccupancy,
  defaultRooms,
  encodeRooms,
  occupancySummary,
  MAX_ROOMS,
  MAX_ADULTS_PER_ROOM,
  MAX_CHILDREN_PER_ROOM,
  MAX_CHILD_AGE,
} from "@/lib/booking/occupancy";

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-[#071526]">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg leading-none disabled:opacity-40"
        >
          −
        </button>
        <span className="w-5 text-center text-sm font-bold tabular-nums">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg leading-none disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function OccupancyPicker({
  name = "rooms",
  initial,
  tone = "light",
}: {
  name?: string;
  initial?: RoomOccupancy[];
  tone?: "light" | "dark";
}) {
  const [rooms, setRooms] = useState<RoomOccupancy[]>(initial?.length ? initial : defaultRooms());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function patchRoom(i: number, patch: Partial<RoomOccupancy>) {
    setRooms((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function setChildCount(i: number, count: number) {
    setRooms((rs) =>
      rs.map((r, idx) => {
        if (idx !== i) return r;
        const ages = r.childrenAges.slice(0, count);
        while (ages.length < count) ages.push(8);
        return { ...r, childrenAges: ages };
      }),
    );
  }
  function setChildAge(i: number, j: number, age: number) {
    setRooms((rs) =>
      rs.map((r, idx) =>
        idx === i ? { ...r, childrenAges: r.childrenAges.map((a, k) => (k === j ? age : a)) } : r,
      ),
    );
  }
  function addRoom() {
    setRooms((rs) => (rs.length < MAX_ROOMS ? [...rs, { adults: 2, childrenAges: [] }] : rs));
  }
  function removeRoom(i: number) {
    setRooms((rs) => (rs.length > 1 ? rs.filter((_, idx) => idx !== i) : rs));
  }

  const triggerText = tone === "dark" ? "text-white" : "text-[#071526]";

  return (
    <div className="relative" ref={ref}>
      <input type="hidden" name={name} value={encodeRooms(rooms)} />
      <span className="block text-[11px] font-bold uppercase tracking-wide text-gray-500">Rooms &amp; guests</span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`mt-1 w-full truncate rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-left text-sm font-medium ${triggerText} outline-none focus:border-[#b88434]`}
      >
        {occupancySummary(rooms)}
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-72 rounded-2xl border border-gray-200 bg-white p-4 text-[#071526] shadow-2xl">
          {rooms.map((room, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-wide text-[#b88434]">Room {i + 1}</p>
                {rooms.length > 1 && (
                  <button type="button" onClick={() => removeRoom(i)} className="text-xs font-semibold text-gray-500 hover:text-red-600">
                    Remove
                  </button>
                )}
              </div>
              <Stepper label="Adults" value={room.adults} min={1} max={MAX_ADULTS_PER_ROOM} onChange={(v) => patchRoom(i, { adults: v })} />
              <Stepper label="Children" value={room.childrenAges.length} min={0} max={MAX_CHILDREN_PER_ROOM} onChange={(v) => setChildCount(i, v)} />
              {room.childrenAges.length > 0 && (
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {room.childrenAges.map((age, j) => (
                    <label key={j} className="text-xs text-gray-600">
                      Child {j + 1} age
                      <select
                        value={age}
                        onChange={(e) => setChildAge(i, j, Number(e.target.value))}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
                      >
                        {Array.from({ length: MAX_CHILD_AGE + 1 }, (_, n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="mt-3 flex items-center justify-between">
            {rooms.length < MAX_ROOMS ? (
              <button type="button" onClick={addRoom} className="text-sm font-bold text-[#b88434] hover:underline">
                + Add room
              </button>
            ) : (
              <span className="text-xs text-gray-400">Max {MAX_ROOMS} rooms</span>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-[#0b1b2e] px-4 py-2 text-xs font-bold text-white hover:bg-[#b88434]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
