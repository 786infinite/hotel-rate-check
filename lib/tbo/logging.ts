/**
 * Certification-grade JSON logging.
 *
 * TBO certification requires full request/response JSON for every method
 * (Search → PreBook → Book → BookingDetail). This module captures each call
 * in a consistent, exportable shape.
 *
 * Default sink: console (structured). Swap `sink` for a DB/file/S3 writer in
 * production so logs survive and can be zipped for certification submission.
 *
 * IMPORTANT: card data (PaymentInfo) is redacted before logging. Net/wholesale
 * pricing is TBO's own data in the response and is fine to keep in internal logs,
 * but must never be surfaced to customers.
 */

export interface TboLogEntry {
  timestamp: string;
  method: string;
  correlationId?: string;
  request?: unknown;
  response?: unknown;
  httpStatus?: number;
  tboCode?: number;
  durationMs?: number;
  error?: string;
}

type Sink = (entry: TboLogEntry) => void;

const consoleSink: Sink = (entry) => {
  // Single-line JSON so it's easy to grep/collect from Vercel logs.
  console.log(`[TBO] ${JSON.stringify(entry)}`);
};

let sink: Sink = consoleSink;

/** Replace the log sink (e.g. write to a database or file for certification export). */
export function setTboLogSink(custom: Sink): void {
  sink = custom;
}

// Guest PII (names, email, phone) is scrubbed from logs by default to respect
// GDPR. Set TBO_LOG_PII=1 only when capturing full JSON logs for TBO
// certification — never in normal production.
const LOG_PII = process.env.TBO_LOG_PII === "1";
const PII_KEY = /^(email|emailid|phone|phonenumber|firstname|lastname|customernames|paxname|guestname)$/i;

/** Redact card data always; guest PII unless TBO_LOG_PII=1. */
function redact(value: unknown): unknown {
  if (value == null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(redact);

  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (k === "PaymentInfo" || /card|cvv|cvc/i.test(k)) {
      out[k] = "[REDACTED]";
    } else if (!LOG_PII && PII_KEY.test(k)) {
      out[k] = "[REDACTED]";
    } else {
      out[k] = redact(v);
    }
  }
  return out;
}

export function logTboCall(
  entry: Omit<TboLogEntry, "timestamp"> & { timestamp?: string },
): void {
  sink({
    timestamp: entry.timestamp ?? new Date().toISOString(),
    ...entry,
    request: redact(entry.request),
  });
}
