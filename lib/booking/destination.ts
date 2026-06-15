/**
 * Destination resolution + static hotel content (SERVER-ONLY).
 *
 * Turns a free-text query ("London", "Hilton London") into TBO hotel codes, and
 * provides hotel display content (name, star rating, address, images) from the
 * TBO Static content API. TBO confirmed (10 Jun 2026) we may display + cache
 * this content, refreshed ~monthly.
 *
 * IMPORTANT — two honest caveats:
 *  1. The TBO static methods (cityList / hotelCodeList / hotelDetails) return
 *     untyped payloads in our client (the spec didn't pin their shapes). The
 *     parsers below are DEFENSIVE and try the likely field names; they must be
 *     verified/tuned against the first real staging responses.
 *  2. For production, the right design is to INGEST TBO's full static hotel
 *     master on a schedule into a search index/DB, then match locally — not call
 *     CityList/HotelCodeList live per search (slow, and it counts against the
 *     30 QPM staging limit). This module is structured so that ingest can back
 *     the same `HotelIndex` interface later. The live path here is an interim,
 *     low-volume lookup with monthly in-memory caching.
 *
 * Mock mode (TBO_MOCK=1) returns the spec fixture hotel so the whole flow works
 * offline with no credentials.
 */

import * as tbo from "@/lib/tbo";

export interface HotelContent {
  hotelCode: string;
  name: string;
  starRating?: number;
  address?: string;
  description?: string;
  images: string[];
}

export interface HotelIndex {
  /** Free-text → up to `limit` TBO hotel codes. */
  resolveCodes(query: string, limit?: number): Promise<string[]>;
  /** Display name for a hotel code (best-effort). */
  name(hotelCode: string): Promise<string | undefined>;
  /** Full static content for a hotel code (best-effort). */
  content(hotelCode: string): Promise<HotelContent | undefined>;
}

// --- Mock implementation (offline / TBO_MOCK=1) ------------------------------

const MOCK_CONTENT: Record<string, HotelContent> = {
  "1120548": {
    hotelCode: "1120548",
    name: "Golden Sands Hotel Apartments",
    starRating: 3,
    address: "Bur Dubai, Dubai, United Arab Emirates",
    description: "Comfortable apartment-style rooms a short walk from the creek.",
    images: [],
  },
  "1435427": {
    hotelCode: "1435427",
    name: "City Centre Hotel",
    starRating: 4,
    address: "City Centre",
    images: [],
  },
};

class MockHotelIndex implements HotelIndex {
  async resolveCodes(): Promise<string[]> {
    return ["1120548"];
  }
  async name(hotelCode: string): Promise<string | undefined> {
    return MOCK_CONTENT[hotelCode]?.name;
  }
  async content(hotelCode: string): Promise<HotelContent | undefined> {
    return MOCK_CONTENT[hotelCode];
  }
}

// --- Live implementation (TBO Static content API) ----------------------------

/** Common destination → ISO country code, to seed CityList lookups. Extend as
 *  needed, or replace with a full static ingest (see module header). */
const DESTINATION_COUNTRY: Record<string, string> = {
  london: "GB",
  manchester: "GB",
  edinburgh: "GB",
  birmingham: "GB",
  paris: "FR",
  istanbul: "TR",
  dubai: "AE",
  "new york": "US",
};

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function norm(s: string): string {
  return s.trim().toLowerCase();
}

/** Dig an array of records out of an unknown TBO static payload. */
function findArray(payload: unknown, keys: string[]): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    for (const k of keys) {
      if (Array.isArray(obj[k])) return obj[k] as Record<string, unknown>[];
    }
    // Fall back to the first array-valued property.
    for (const v of Object.values(obj)) {
      if (Array.isArray(v)) return v as Record<string, unknown>[];
    }
  }
  return [];
}

function pickString(rec: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = rec[k];
    if (typeof v === "string" && v) return v;
    if (typeof v === "number") return String(v);
  }
  return undefined;
}

class TboHotelIndex implements HotelIndex {
  private cityCache = new Map<string, CacheEntry<{ code: string; name: string }[]>>();
  private codesCache = new Map<string, CacheEntry<string[]>>();
  private contentCache = new Map<string, CacheEntry<HotelContent>>();

  private fresh<T>(entry: CacheEntry<T> | undefined): T | undefined {
    return entry && entry.expiresAt > Date.now() ? entry.value : undefined;
  }

  /** Cities for a country (cached ~monthly). Defensive parse. */
  private async cities(country: string): Promise<{ code: string; name: string }[]> {
    const cached = this.fresh(this.cityCache.get(country));
    if (cached) return cached;
    const raw = await tbo.cityList(country);
    const list = findArray(raw, ["CityList", "Cities", "Destinations"]).map((rec) => ({
      code: pickString(rec, ["Code", "CityCode", "DestinationId", "Id"]) ?? "",
      name: pickString(rec, ["Name", "CityName", "Destination"]) ?? "",
    })).filter((c) => c.code && c.name);
    this.cityCache.set(country, { value: list, expiresAt: Date.now() + THIRTY_DAYS_MS });
    return list;
  }

  /** Hotel codes for a city (cached ~monthly), capped. Defensive parse. */
  private async hotelCodes(cityCode: string, limit: number): Promise<string[]> {
    const cached = this.fresh(this.codesCache.get(cityCode));
    if (cached) return cached.slice(0, limit);
    const raw = await tbo.hotelCodeList(cityCode);
    const arr = findArray(raw, ["Hotels", "HotelCodes", "TBOHotelCodeList", "HotelList"]);
    const codes = arr
      .map((rec) => pickString(rec, ["HotelCode", "Code", "TBOHotelCode", "Id"]))
      .filter((c): c is string => Boolean(c));
    // Some responses return a comma-separated string instead of objects.
    if (!codes.length && typeof raw === "object" && raw) {
      const s = pickString(raw as Record<string, unknown>, ["HotelCodes", "Codes"]);
      if (s) codes.push(...s.split(",").map((x) => x.trim()).filter(Boolean));
    }
    this.codesCache.set(cityCode, { value: codes, expiresAt: Date.now() + THIRTY_DAYS_MS });
    return codes.slice(0, limit);
  }

  async resolveCodes(query: string, limit = 50): Promise<string[]> {
    const q = norm(query);
    if (!q) return [];

    // If the query is already codes, pass them through.
    if (/^[0-9][0-9, ]*$/.test(query.trim())) {
      return query.replace(/\s+/g, "").split(",").filter(Boolean).slice(0, limit);
    }

    // Seed a country from known destinations, else default GB.
    const countryKey = Object.keys(DESTINATION_COUNTRY).find((c) => q.includes(c));
    const country = countryKey ? DESTINATION_COUNTRY[countryKey] : "GB";

    const cities = await this.cities(country);
    // Match a city by name contained in the query (e.g. "hotels in london").
    const city =
      cities.find((c) => q.includes(norm(c.name))) ??
      cities.find((c) => norm(c.name).includes(countryKey ?? q));
    if (!city) return [];

    return this.hotelCodes(city.code, limit);
  }

  async content(hotelCode: string): Promise<HotelContent | undefined> {
    const cached = this.fresh(this.contentCache.get(hotelCode));
    if (cached) return cached;
    const raw = await tbo.hotelDetails(hotelCode);
    const rec = findArray(raw, ["HotelDetails", "Hotels", "HotelList"])[0];
    if (!rec) return undefined;
    const ratingStr = pickString(rec, ["HotelRating", "StarRating", "Rating"]);
    const ratingNum = ratingStr ? parseInt(ratingStr.replace(/\D/g, ""), 10) : NaN;
    const images = Array.isArray(rec.Images)
      ? (rec.Images as unknown[]).filter((x): x is string => typeof x === "string")
      : [];
    const content: HotelContent = {
      hotelCode,
      name: pickString(rec, ["HotelName", "Name"]) ?? `Hotel ${hotelCode}`,
      starRating: Number.isFinite(ratingNum) ? ratingNum : undefined,
      address: pickString(rec, ["Address", "HotelAddress"]),
      description: pickString(rec, ["Description", "HotelDescription"]),
      images,
    };
    this.contentCache.set(hotelCode, { value: content, expiresAt: Date.now() + THIRTY_DAYS_MS });
    return content;
  }

  async name(hotelCode: string): Promise<string | undefined> {
    return (await this.content(hotelCode))?.name;
  }
}

let index: HotelIndex | null = null;

export function setHotelIndex(custom: HotelIndex): void {
  index = custom;
}

export function getHotelIndex(): HotelIndex {
  if (!index) index = process.env.TBO_MOCK === "1" ? new MockHotelIndex() : new TboHotelIndex();
  return index;
}
