/**
 * Notifier factory. Selects the email provider from the environment:
 *   - NOTIFY_MOCK=1            → ConsoleNotifier (logs, never sends)
 *   - RESEND_API_KEY present   → ResendNotifier
 *   - otherwise                → ConsoleNotifier (safe default)
 *
 * Swap/extend by adding an adapter and a branch here.
 */

import { ConsoleNotifier } from "./console";
import type { Notifier } from "./types";

export type { Notifier, EmailMessage, SendResult } from "./types";
export { NotifyError } from "./types";
export {
  composeConfirmationEmail,
  composeReceivedEmail,
  type BookingEmailData,
} from "./templates";

let notifier: Notifier | null = null;

function build(): Notifier {
  if (process.env.NOTIFY_MOCK === "1") return new ConsoleNotifier();
  if (process.env.RESEND_API_KEY) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { ResendNotifier } = require("./resend") as typeof import("./resend");
    return new ResendNotifier();
  }
  return new ConsoleNotifier();
}

export function setNotifier(custom: Notifier): void {
  notifier = custom;
}

export function getNotifier(): Notifier {
  if (!notifier) notifier = build();
  return notifier;
}
