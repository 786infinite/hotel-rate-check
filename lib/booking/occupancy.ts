/**
 * Room occupancy helpers — multi-room + children.
 *
 * Framework-agnostic and dependency-free, so the client picker and the server
 * both use the same parse/encode/clamp logic. TBO confirmed limits (10 Jun 2026):
 * max 6 rooms, max 6 adults per room, max 4 children per room. Child ages are
 * required for each child.
 *
 * URL encoding ("rooms" query param): rooms joined by "|", each room is
 * "<adults>" or "<adults>-<age,age,...>". Examples:
 *   "2"            → 1 room, 2 adults
 *   "2|2-5,8"      → room 1: 2 adults; room 2: 2 adults + children aged 5 and 8
 */

export interface RoomOccupancy {
  adults: number;
  childrenAges: number[];
}

/** Plain shape matching tbo.PaxRoom (kept here to avoid a server-only import). */
export interface PaxRoomShape {
  Adults: number;
  Children: number;
  ChildrenAges: number[];
}

export const MAX_ROOMS = 6;
export const MAX_ADULTS_PER_ROOM = 6;
export const MAX_CHILDREN_PER_ROOM = 4;
export const MAX_CHILD_AGE = 17;

function clamp(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.trunc(n)));
}

export function defaultRooms(): RoomOccupancy[] {
  return [{ adults: 2, childrenAges: [] }];
}

export function normalizeRoom(r: RoomOccupancy): RoomOccupancy {
  return {
    adults: clamp(r.adults, 1, MAX_ADULTS_PER_ROOM),
    childrenAges: r.childrenAges.slice(0, MAX_CHILDREN_PER_ROOM).map((a) => clamp(a, 0, MAX_CHILD_AGE)),
  };
}

export function normalizeRooms(rooms: RoomOccupancy[]): RoomOccupancy[] {
  const out = rooms.slice(0, MAX_ROOMS).map(normalizeRoom);
  return out.length ? out : defaultRooms();
}

export function encodeRooms(rooms: RoomOccupancy[]): string {
  return normalizeRooms(rooms)
    .map((r) => (r.childrenAges.length ? `${r.adults}-${r.childrenAges.join(",")}` : `${r.adults}`))
    .join("|");
}

export function parseRoomsParam(s: string | undefined | null): RoomOccupancy[] {
  if (!s) return defaultRooms();
  const rooms = s
    .split("|")
    .map((part) => {
      const [aStr, agesStr] = part.split("-");
      const adults = clamp(parseInt(aStr, 10), 1, MAX_ADULTS_PER_ROOM);
      const ages = (agesStr ? agesStr.split(",") : [])
        .map((x) => clamp(parseInt(x, 10), 0, MAX_CHILD_AGE));
      return normalizeRoom({ adults, childrenAges: ages });
    });
  return normalizeRooms(rooms);
}

/** Build TBO PaxRooms from occupancy. Falls back to a legacy single "adults" count. */
export function toPaxRooms(rooms: RoomOccupancy[]): PaxRoomShape[] {
  return normalizeRooms(rooms).map((r) => ({
    Adults: r.adults,
    Children: r.childrenAges.length,
    ChildrenAges: r.childrenAges,
  }));
}

export function totalAdults(rooms: RoomOccupancy[]): number {
  return rooms.reduce((sum, r) => sum + r.adults, 0);
}

export function totalChildren(rooms: RoomOccupancy[]): number {
  return rooms.reduce((sum, r) => sum + r.childrenAges.length, 0);
}

export function occupancySummary(rooms: RoomOccupancy[]): string {
  const a = totalAdults(rooms);
  const c = totalChildren(rooms);
  const parts = [
    `${rooms.length} room${rooms.length === 1 ? "" : "s"}`,
    `${a} adult${a === 1 ? "" : "s"}`,
  ];
  if (c) parts.push(`${c} child${c === 1 ? "" : "ren"}`);
  return parts.join(" · ");
}
