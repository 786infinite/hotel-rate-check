"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export interface MapHotel { hotelCode: string; hotelName: string; lat: number; lng: number; priceLabel: string }

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

export default function ResultsMap({ hotels }: { hotels: MapHotel[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const pts = hotels.filter((h) => Number.isFinite(h.lat) && Number.isFinite(h.lng));
    const map = L.map(ref.current, { scrollWheelZoom: false });
    mapRef.current = map;
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    for (const h of pts) {
      const icon = L.divIcon({
        className: "",
        html: `<span style="display:inline-block;background:#0b1b2e;color:#fff;font:600 12px/1 system-ui;padding:6px 10px;border-radius:9999px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.3)">${esc(h.priceLabel)}</span>`,
        iconSize: [0, 0],
      });
      L.marker([h.lat, h.lng], { icon }).addTo(map).bindPopup(`<strong>${esc(h.hotelName)}</strong><br/>${esc(h.priceLabel)}`);
    }

    if (pts.length) {
      map.fitBounds(L.latLngBounds(pts.map((h) => [h.lat, h.lng] as [number, number])).pad(0.2));
    } else {
      map.setView([20, 0], 2);
    }

    return () => { map.remove(); mapRef.current = null; };
  }, [hotels]);

  return <div ref={ref} className="h-[520px] w-full overflow-hidden rounded-3xl ring-1 ring-[#ece4d6]" />;
}
