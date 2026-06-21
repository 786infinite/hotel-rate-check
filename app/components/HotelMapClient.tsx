"use client";
import dynamic from "next/dynamic";
import type { MapHotel } from "./ResultsMap";

// next/dynamic with ssr:false is only allowed inside a Client Component (Next 16),
// so the server-rendered hotel page imports this thin wrapper instead.
const ResultsMap = dynamic(() => import("./ResultsMap"), {
  ssr: false,
  loading: () => <div className="h-[320px] w-full animate-pulse rounded-3xl bg-[#e9e1d2]" />,
});

export default function HotelMapClient({ hotels }: { hotels: MapHotel[] }) {
  return <ResultsMap hotels={hotels} />;
}
