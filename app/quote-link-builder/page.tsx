import type { Metadata } from "next";
import QuoteLinkBuilderClient from "./QuoteLinkBuilderClient";

export const metadata: Metadata = {
  title: "Quote Email Builder | Hotel Rate Check",
  description:
    "Internal Hotel Rate Check quote email builder for creating customer quote links.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function QuoteLinkBuilderPage() {
  return <QuoteLinkBuilderClient />;
}