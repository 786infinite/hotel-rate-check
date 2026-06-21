"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(!localStorage.getItem("hrc-consent")); }, []);
  function choose(v: "accepted" | "rejected") {
    localStorage.setItem("hrc-consent", v);
    window.dispatchEvent(new Event("hrc-consent-changed"));
    setShow(false);
  }
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e7ddcd] bg-white/95 p-4 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700">We use privacy-friendly, cookieless analytics to improve the site. See our <Link href="/cookies" className="font-semibold underline">cookie policy</Link>.</p>
        <div className="flex gap-2">
          <button onClick={() => choose("rejected")} className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold">Reject</button>
          <button onClick={() => choose("accepted")} className="rounded-full bg-[#0b1b2e] px-4 py-2 text-sm font-bold text-white">Accept</button>
        </div>
      </div>
    </div>
  );
}
