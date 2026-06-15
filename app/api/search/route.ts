/**
 * POST /api/search  (PUBLIC, customer-facing)
 *
 * Returns live rooms with the customer SELL price only. Net/wholesale cost and
 * supplier identity never appear here — see lib/booking/public.ts.
 *
 * Public route (not behind the /api/tbo Basic Auth). Lightly rate-limited.
 * In TBO_MOCK=1 mode this returns spec fixtures with no credentials/network.
 */

import { NextResponse } from "next/server";
import { publicSearch } from "@/lib/booking/public";
import { parseRoomsParam, toPaxRooms } from "@/lib/booking/occupancy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Body {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  /** Encoded occupancy, e.g. "2|2-5,8". Legacy `adults` still accepted. */
  rooms?: string;
  adults?: number;
  nationality?: string;
}

// Best-effort in-memory rate limit (per warm instance). Real protection should
// come from the platform edge / a KV-backed limiter; this just blunts abuse.
const HITS = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = HITS.get(ip);
  if (!rec || now > rec.resetAt) {
    HITS.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const missing = (["destination", "checkIn", "checkOut"] as const).filter((k) => !body[k]);
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required field(s): ${missing.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    const roomsParam = body.rooms ?? (body.adults ? String(body.adults) : undefined);
    const result = await publicSearch({
      destination: body.destination!,
      checkIn: body.checkIn!,
      checkOut: body.checkOut!,
      paxRooms: toPaxRooms(parseRoomsParam(roomsParam)),
      nationality: body.nationality,
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
