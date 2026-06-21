"use client";
export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="no-print rounded-full bg-[#0b1b2e] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#b88434]">
      Print / Save as PDF
    </button>
  );
}
