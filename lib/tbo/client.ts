/**
 * Low-level TBO HTTP client.
 *
 * - Server-side only (uses credentials). Never import into client components.
 * - POST + JSON + Basic Auth for every method.
 * - Per-method timeout via AbortController.
 * - Captures the raw JSON request/response for certification logging.
 * - Honors TBO_MOCK=1 to run offline against spec fixtures (no creds/network).
 */

import { getTboConfig } from "./config";
import { describeStatus, isSuccess } from "./status";
import { logTboCall } from "./logging";
import { isMockMode, resolveMock } from "./mock";
import type { TboStatus } from "./types";

export class TboApiError extends Error {
  readonly tboCode?: number;
  readonly httpStatus?: number;
  readonly kind: "timeout" | "network" | "http" | "tbo";
  readonly method: string;

  constructor(
    message: string,
    opts: {
      kind: TboApiError["kind"];
      method: string;
      tboCode?: number;
      httpStatus?: number;
    },
  ) {
    super(message);
    this.name = "TboApiError";
    this.kind = opts.kind;
    this.method = opts.method;
    this.tboCode = opts.tboCode;
    this.httpStatus = opts.httpStatus;
  }
}

interface CallOptions {
  method: string;
  timeoutMs: number;
  body: unknown;
  allowNonSuccess?: boolean;
  correlationId?: string;
}

interface WithStatus {
  Status?: TboStatus;
}

function throwIfBadStatus<T extends WithStatus>(
  parsed: T,
  method: string,
  allowNonSuccess: boolean | undefined,
): void {
  const code = parsed.Status?.Code;
  if (typeof code === "number" && !isSuccess(code) && !allowNonSuccess) {
    throw new TboApiError(`TBO ${method} failed: ${code} ${describeStatus(code)}`, {
      kind: "tbo",
      method,
      tboCode: code,
    });
  }
}

export async function tboCall<T extends WithStatus>(opts: CallOptions): Promise<T> {
  const { method, timeoutMs, body, allowNonSuccess, correlationId } = opts;

  if (isMockMode()) {
    const mock = resolveMock(method, body) as T;
    logTboCall({ method, correlationId, request: body, response: mock, tboCode: mock.Status?.Code, durationMs: 0 });
    throwIfBadStatus(mock, method, allowNonSuccess);
    return mock;
  }

  const config = getTboConfig();
  const url = `${config.baseUrl}/${method}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: config.authHeader,
      },
      body: JSON.stringify(body ?? {}),
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (err) {
    clearTimeout(timer);
    const aborted = err instanceof Error && err.name === "AbortError";
    const apiError = new TboApiError(
      aborted ? `TBO ${method} timed out after ${timeoutMs}ms` : `TBO ${method} network error`,
      { kind: aborted ? "timeout" : "network", method },
    );
    logTboCall({ method, correlationId, request: body, error: apiError.message, durationMs: Date.now() - startedAt });
    throw apiError;
  }
  clearTimeout(timer);

  const rawText = await response.text();
  let parsed: T | undefined;
  try {
    parsed = rawText ? (JSON.parse(rawText) as T) : undefined;
  } catch {
    parsed = undefined;
  }

  logTboCall({
    method,
    correlationId,
    request: body,
    response: parsed ?? rawText,
    httpStatus: response.status,
    tboCode: parsed?.Status?.Code,
    durationMs: Date.now() - startedAt,
  });

  if (!response.ok) {
    throw new TboApiError(`TBO ${method} HTTP ${response.status}`, { kind: "http", method, httpStatus: response.status });
  }
  if (!parsed) {
    throw new TboApiError(`TBO ${method} returned an empty or unparseable body`, { kind: "http", method, httpStatus: response.status });
  }

  throwIfBadStatus(parsed, method, allowNonSuccess);
  return parsed;
}
