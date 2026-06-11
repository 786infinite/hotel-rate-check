import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy | Hotel Rate Check",
  description:
    "Cookie policy explaining how Hotel Rate Check may use cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#071526]">
      <section className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex rounded-full border border-[#b88434] px-4 py-2 text-sm font-semibold text-[#071526] hover:bg-[#b88434] hover:text-white"
        >
          ← Back to homepage
        </Link>

        <div className="rounded-3xl bg-white p-6 shadow-xl md:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#b88434]">
            Hotel Rate Check
          </p>

          <h1 className="text-3xl font-bold md:text-5xl">Cookie Policy</h1>

          <p className="mt-4 text-sm text-gray-600">
            Last updated: 27 May 2026
          </p>

          <div className="mt-8 space-y-8 text-base leading-7 text-gray-800">
            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                1. What cookies are
              </h2>
              <p className="mt-3">
                Cookies are small files placed on your device when you visit a
                website. Similar technologies may also be used to store or
                access information on your device.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                2. How we use cookies
              </h2>
              <p className="mt-3">
                Hotel Rate Check may use cookies or similar technologies to keep
                the website working, improve performance, understand how people
                use the website, and protect the service from misuse.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                3. Essential cookies
              </h2>
              <p className="mt-3">
                Essential cookies are needed for the website to work properly.
                These may be used for security, network management, page loading
                and form functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                4. Analytics and non-essential cookies
              </h2>
              <p className="mt-3">
                If we add analytics, advertising or other non-essential cookies
                in the future, we will update this policy and add any required
                consent controls before using them.
              </p>
              <p className="mt-3">
                At this stage, Hotel Rate Check is intended to run with a simple
                enquiry form and core website functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                5. Third-party services
              </h2>
              <p className="mt-3">
                We may use third-party services for website hosting, form
                handling and email notifications. These services may use
                technical cookies or similar technologies where needed to provide
                their service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                6. Managing cookies
              </h2>
              <p className="mt-3">
                You can control or delete cookies through your browser settings.
                Blocking some cookies may affect how the website works.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                7. Contact
              </h2>
              <p className="mt-3">
                For questions about this cookie policy, email{" "}
                <a
                  href="mailto:quotes@hotelratecheck.com"
                  className="font-semibold text-[#b88434] underline"
                >
                  quotes@hotelratecheck.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
