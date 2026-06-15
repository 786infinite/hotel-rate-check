import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-[#f7f2e9] text-[#071526]">
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">404</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-lg leading-8 text-gray-700">
          The page you were looking for isn’t here. Let’s find you a hotel instead.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/#book"
            className="rounded-full bg-[#071526] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#b88434]"
          >
            Search hotels
          </Link>
          <Link
            href="/"
            className="rounded-full border border-[#b88434] px-7 py-4 text-sm font-bold text-[#071526] transition hover:bg-[#b88434] hover:text-white"
          >
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}
