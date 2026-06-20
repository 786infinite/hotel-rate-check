import Link from "next/link";
import BrandLogo from "./BrandLogo";

const NAV = [
  { href: "/#destinations", label: "Destinations" },
  { href: "/business-hotel-rate-check", label: "Business" },
  { href: "/hotel-rate-check", label: "Guides" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071526]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Hotel Rate Check — home">
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="transition hover:text-[#f0c76b]">
              {n.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#book"
          className="rounded-full bg-[#d8a84f] px-5 py-2.5 text-sm font-bold text-[#071526] transition hover:bg-[#f0c76b]"
        >
          Search hotels
        </Link>
      </div>
    </header>
  );
}
