"use client";
import { useState } from "react";
import SmartImage from "./SmartImage";

export default function HotelGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  if (!images.length) return null;
  return (
    <div>
      <div className="relative h-[320px] w-full overflow-hidden rounded-3xl bg-[#0a1c30] md:h-[440px]">
        <SmartImage src={images[active]} alt={alt} priority sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button key={i} type="button" onClick={() => setActive(i)} aria-label={`Photo ${i + 1}`}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl ring-2 ${i === active ? "ring-[#d8a84f]" : "ring-transparent"}`}>
              <SmartImage src={src} alt="" sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
