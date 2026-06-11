import Link from "next/link";

const NAV = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/business-hotel-rate-check", label: "Business" },
  { href: "/hotel-rate-check", label: "Guides" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071526]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8a84f] text-sm font-black text-[#071526]">
            HRC
          </span>
          <span className="text-lg font-black tracking-tight text-white">
            Hotel<span className="text-[#d8a84f]">Rate</span>Check
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-white/80 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-[#d8a84f]">
              {n.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#book"
          className="rounded-full bg-[#d8a84f] px-5 py-2.5 text-sm font-bold text-[#071526] shadow hover:bg-[#f0c76b]"
        >
          Book a hotel
        </Link>
      </div>
    </header>
  );
}
