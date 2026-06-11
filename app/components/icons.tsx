/** Lightweight inline SVG icons (no external assets). Inherit color via currentColor. */
import type { SVGProps } from "react";

const base = (props: SVGProps<SVGSVGElement>) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export function SearchIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
export function TagIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(p)}>
      <path d="M3 12V7a2 2 0 0 1 2-2h5l9 9-7 7-9-9Z" />
      <circle cx="7.5" cy="9.5" r="1.2" />
    </svg>
  );
}
export function ShieldIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(p)}>
      <path d="M12 3 5 6v6c0 4 3 6.5 7 8 4-1.5 7-4 7-8V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
export function CheckIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
  );
}
export function BedIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(p)}>
      <path d="M3 7v10M3 12h18v5M21 12v5M3 12V9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
    </svg>
  );
}
export function CardIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
export function StarIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(p)}>
      <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.8 1-5.8L3.5 9.9l5.9-.9L12 3Z" />
    </svg>
  );
}
