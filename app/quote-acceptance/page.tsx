import { notFound } from "next/navigation";

// Retired: the manual quote-link flow is replaced by instant online booking
// (/search → /book). The /api/quote-acceptance handler never existed, so this
// page 404s rather than silently failing. Remove fully on your machine:
//   git rm -r app/quote-acceptance app/quote-accepted app/quote-link-builder
export default function Page() {
  notFound();
}
