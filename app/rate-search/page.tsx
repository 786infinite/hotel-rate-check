import type { Metadata } from "next";
import RateSearchClient from "./RateSearchClient";

export const metadata: Metadata = {
  title: "Rate Search | Hotel Rate Check (Internal)",
  description: "Internal TBO rate-search and PreBook dashboard.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function RateSearchPage() {
  return <RateSearchClient />;
}
