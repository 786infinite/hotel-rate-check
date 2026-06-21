import Link from "next/link";
import EmailActions from "./EmailActions";
import { COMPANY } from "@/lib/company";

const cols: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Book",
    links: [
      { href: "/#book", label: "Book a hotel" },
      { href: "/business-hotel-rate-check", label: "Business bookings" },
      { href: "/group-hotel-rate-check", label: "Group bookings" },
    ],
  },
  {
    title: "Guides",
    links: [
      { href: "/hotel-rate-check", label: "Hotel rate checks" },
      { href: "/how-to-check-if-a-hotel-rate-is-good", label: "Is a rate good?" },
      { href: "/non-refundable-hotel-rates-explained", label: "Non-refundable rates" },
      { href: "/hotel-local-taxes-explained", label: "Local taxes & fees" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="bg-[#071526] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-4 lg:px-8">
        <div>
          <Link href="/" aria-label="Hotel Rate Check — home" className="inline-flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Hotel Rate Check" className="h-12 w-auto" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">
            Book hotels online with clear prices and terms. Every charge shown before you pay.
            Hotel accommodation only.
          </p>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-black uppercase tracking-[0.22em] text-[#d8a84f]">{col.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[#d8a84f]">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-white/55 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="space-y-1">
            <p>© 2026 Hotel Rate Check · 786 Infinite Ltd. All rights reserved.</p>
            <p className="text-xs text-gray-400">
              {COMPANY.legalName} trading as {COMPANY.tradingName} · Company No. {COMPANY.companyNumber} · VAT {COMPANY.vatNumber}
              <br />
              {COMPANY.addressLine}
            </p>
          </div>
          <EmailActions />
        </div>
      </div>
    </footer>
  );
}
