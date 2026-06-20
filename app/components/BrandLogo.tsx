"use client";

import { useState } from "react";

/**
 * Brand logo for the header. Uses the gold HRC monogram image + a crisp text
 * wordmark with a gold divider (echoing the brand lockup). Falls back to a CSS
 * monogram if the image file isn't present, so the header never breaks.
 *
 * Save your transparent gold monogram PNG as:  public/images/monogram.png
 */
export default function BrandLogo() {
  const [failed, setFailed] = useState(false);

  return (
    <span className="flex items-center gap-3">
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/monogram.png"
          alt=""
          className="h-10 w-auto"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="font-display flex h-11 w-11 items-center justify-center rounded-lg border border-[#d8a84f]/45 text-xl font-semibold tracking-tight text-[#d8a84f]">
          HRC
        </span>
      )}
      <span className="hidden h-7 w-px bg-[#d8a84f]/40 sm:block" aria-hidden="true" />
      <span className="hidden text-sm font-semibold uppercase tracking-[0.3em] text-white sm:block">
        Hotel Rate Check
      </span>
    </span>
  );
}
