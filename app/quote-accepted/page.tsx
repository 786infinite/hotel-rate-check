import { notFound } from "next/navigation";

// Retired with the manual quote-link flow (replaced by instant online booking).
// Remove fully on your machine: git rm -r app/quote-accepted
export default function Page() {
  notFound();
}
