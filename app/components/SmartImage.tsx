"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Background image that degrades gracefully.
 *
 * Renders a next/image as an absolutely-positioned fill layer. If `src` is
 * empty/undefined, or the image fails to load (bad URL, 404, offline), it
 * renders nothing — so whatever sits behind it (our brand gradient) shows
 * through. This means the site never displays a broken-image icon, and the
 * gradient remains the safe fallback everywhere a photo is optional.
 *
 * Parent element MUST be `relative overflow-hidden`.
 */
export default function SmartImage({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  className = "object-cover",
}: {
  src?: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
