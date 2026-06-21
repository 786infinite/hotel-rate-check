"use client";

import { useState } from "react";

/**
 * Header brand logo — uses the real gold horizontal lockup
 * (public/images/logo.png). Falls back to a CSS monogram if the file is missing
 * so the header never breaks.
 */
export default function BrandLogo() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="flex items-center gap-3">
        <span className="font-display flex h-11 w-11 items-center justify-center rounded-lg border border-[#d8a84f]/45 text-xl font-semibold tracking-tight text-[#d8a84f]">
          HRC
        </span>
        <span className="hidden text-sm font-semibold uppercase tracking-[0.3em] text-white sm:block">
          Hotel Rate Check
        </span>
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo.png"
      alt="Hotel Rate Check"
      className="h-12 w-auto md:h-14"
      onError={() => setFailed(true)}
    />
  );
}
