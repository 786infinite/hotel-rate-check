import { ShieldIcon, CheckIcon, TagIcon, BedIcon } from "./icons";

const items = [
  { Icon: ShieldIcon, label: "Secure online payment" },
  { Icon: CheckIcon, label: "Confirmed with the hotel" },
  { Icon: TagIcon, label: "All charges shown before you pay" },
  { Icon: BedIcon, label: "Hotel accommodation only" },
];

/** Reassurance row to sit next to a booking CTA. */
export default function TrustStrip({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 ${className}`}>
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <it.Icon className="h-4 w-4 text-[#b88434]" />
          {it.label}
        </li>
      ))}
    </ul>
  );
}
