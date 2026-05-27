"use client";

import Link from "next/link";
import { useState } from "react";

const EMAIL = "quotes@hotelratecheck.com";

export default function EmailActions() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      window.location.href =
        "mailto:quotes@hotelratecheck.com?subject=Hotel%20Rate%20Check%20enquiry";
    }
  }

  return (
    <div className="flex flex-col gap-4 md:items-end">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <a
          href="mailto:quotes@hotelratecheck.com?subject=Hotel%20Rate%20Check%20enquiry"
          className="font-semibold text-[#071526] hover:text-[#b88434]"
        >
          quotes@hotelratecheck.com
        </a>

        <button
          type="button"
          onClick={copyEmail}
          className="rounded-full border border-gray-300 px-4 py-2 text-xs font-bold text-[#071526] hover:border-[#b88434] hover:text-[#b88434]"
        >
          {copied ? "Copied" : "Copy email"}
        </button>
      </div>

      <nav
        aria-label="Footer legal links"
        className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 md:justify-end"
      >
        <Link href="/terms" className="hover:text-[#b88434]">
          Terms
        </Link>
        <Link href="/privacy" className="hover:text-[#b88434]">
          Privacy
        </Link>
        <Link href="/cookies" className="hover:text-[#b88434]">
          Cookies
        </Link>
        <Link href="/contact" className="hover:text-[#b88434]">
          Contact
        </Link>
      </nav>

      <p>Hotel rate checking service.</p>
    </div>
  );
}