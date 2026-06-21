"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { /* hook a logger here later */ }, []);
  return (
    <main className="mx-auto max-w-xl px-6 py-20 text-center text-[#071526]">
      <h1 className="font-display text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-3 text-gray-600">Sorry — that didn’t load. Please try again.</p>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={reset} className="rounded-full bg-[#0b1b2e] px-6 py-3 text-sm font-bold text-white hover:bg-[#b88434]">Try again</button>
        <Link href="/" className="rounded-full border border-[#b88434] px-6 py-3 text-sm font-semibold hover:bg-[#b88434] hover:text-white">Home</Link>
      </div>
    </main>
  );
}
