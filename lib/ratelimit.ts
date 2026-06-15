/**
 * Fixed-window rate limiter (SERVER-ONLY).
 *
 * Uses Vercel KV (Upstash REST) so the limit is shared across serverless
 * instances; falls back to a per-instance in-memory window when KV isn't
 * configured (dev / before KV is attached). Dependency-free (fetch only).
 *
 * This blunts abuse and protects the 30 QPM TBO ceiling. For bot defence on the
 * public forms, layer Cloudflare Turnstile on top (config-time, not code).
 */

const mem = new Map<string, { count: number; resetAt: number }>();

async function kv(args: (string | number)[]): Promise<unknown> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const res = await fetch(url.replace(/\/+$/, ""), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as { result?: unknown };
  return res.ok ? json.result : null;
}

/**
 * Returns true if the call is ALLOWED, false if the limit is exceeded.
 * @param key        identity (e.g. `search:${ip}`)
 * @param limit      max calls per window
 * @param windowSec  window length in seconds
 */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const k = `rl:${key}`;
    const count = Number(await kv(["INCR", k])) || 0;
    if (count === 1) await kv(["EXPIRE", k, windowSec]);
    return count === 0 ? true : count <= limit; // count===0 means KV failed → fail open
  }
  const now = Date.now();
  const rec = mem.get(key);
  if (!rec || now > rec.resetAt) {
    mem.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return true;
  }
  rec.count += 1;
  return rec.count <= limit;
}

/** Extract a best-effort client IP from request headers. */
export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
