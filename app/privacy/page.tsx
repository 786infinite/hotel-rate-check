import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Hotel Rate Check",
  description:
    "Privacy policy explaining how Hotel Rate Check collects and uses customer information.",
};

export default function PrivacyPage() {
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

          <h1 className="text-3xl font-bold md:text-5xl">Privacy Policy</h1>

          <p className="mt-4 text-sm text-gray-600">
            Last updated: 27 May 2026
          </p>

          <div className="mt-8 space-y-8 text-base leading-7 text-gray-800">
            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                1. Who we are
              </h2>
              <p className="mt-3">
                Hotel Rate Check is an online hotel booking service operated by 786
                Infinite Ltd, a company registered in England and Wales. You can
                contact us at{" "}
                <a
                  href="mailto:quotes@hotelratecheck.com"
                  className="font-semibold text-[#b88434] underline"
                >
                  quotes@hotelratecheck.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                2. Information we collect
              </h2>
              <p className="mt-3">
                When you make a booking enquiry or booking, we may collect:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Your name</li>
                <li>Your email address</li>
                <li>Your phone number, if provided</li>
                <li>Hotel name and destination</li>
                <li>Check-in and check-out dates</li>
                <li>Guest numbers</li>
                <li>Any notes or information you send us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                3. How we use your information
              </h2>
              <p className="mt-3">We use your information to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Respond to your booking enquiry</li>
                <li>Check available hotel rates with our supply partners</li>
                <li>Send you quotes or booking information</li>
                <li>Deal with payment, confirmation and customer service</li>
                <li>Keep business and legal records</li>
                <li>Improve our website and enquiry process</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                4. Lawful basis
              </h2>
              <p className="mt-3">
                We normally process your information because it is necessary to
                respond to your enquiry, take steps before entering into a
                booking contract, provide our service, meet legal obligations,
                or pursue our legitimate business interests in operating and
                improving Hotel Rate Check.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                5. Sharing your information
              </h2>
              <p className="mt-3">
                We may share relevant booking details with hotel suppliers,
                booking partners, payment providers, email providers, website
                hosting providers and professional advisers where needed to
                provide our service or run the business.
              </p>
              <p className="mt-3">
                We do not sell your personal information.
              </p>
              <p className="mt-3">
                Some hotels and suppliers are located outside the UK and the
                European Economic Area (EEA). Where we transfer your information
                internationally, we take steps intended to ensure an appropriate
                level of protection in line with applicable data protection law.
              </p>
              <p className="mt-3">
                Card payments are processed by our payment provider on their
                secure, hosted payment pages. We do not see or store your full
                card details.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                6. Forms and website providers
              </h2>
              <p className="mt-3">
                Our website uses trusted third-party services to host the site,
                receive enquiry forms and deliver email notifications. These
                providers may process information on our behalf so that your
                enquiry can be received and answered.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                7. How long we keep information
              </h2>
              <p className="mt-3">
                We keep enquiry and booking information only for as long as
                needed for customer service, business records, legal,
                accounting, tax, fraud prevention and dispute handling purposes.
              </p>
              <p className="mt-3">
                If you make an enquiry but do not book, we may keep the enquiry
                for a reasonable period so we can deal with follow-up questions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                8. Your rights
              </h2>
              <p className="mt-3">
                Depending on the situation, you may have rights to access,
                correct, delete, restrict or object to the use of your personal
                information. You may also have the right to data portability and
                to complain to the UK Information Commissioner’s Office.
              </p>
              <p className="mt-3">
                To make a privacy request, email{" "}
                <a
                  href="mailto:quotes@hotelratecheck.com"
                  className="font-semibold text-[#b88434] underline"
                >
                  quotes@hotelratecheck.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                9. Data protection requests
              </h2>
              <p className="mt-3">
                If you want to access, correct, delete or restrict the personal
                information we hold about you, email{" "}
                <a
                  href="mailto:quotes@hotelratecheck.com?subject=Data%20protection%20request"
                  className="font-semibold text-[#b88434] underline"
                >
                  quotes@hotelratecheck.com
                </a>
                .
              </p>
              <p className="mt-3">
                For security, we may need to confirm your identity before
                providing, changing or deleting personal information. We will
                handle data protection requests as soon as reasonably possible
                and in line with applicable data protection law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                10. Security
              </h2>
              <p className="mt-3">
                We use reasonable steps to protect the information we receive.
                No website, email system or online service can be guaranteed to
                be completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                11. Updates
              </h2>
              <p className="mt-3">
                We may update this privacy policy from time to time. The latest
                version will be shown on this page.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
