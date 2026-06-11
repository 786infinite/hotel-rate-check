import type { Metadata } from "next";
import Link from "next/link";
import { SEO_CONTENT, type ServiceContent } from "./content";

const BASE_URL = "https://www.hotelratecheck.com";

function getContent(slug: string): ServiceContent {
  const content = SEO_CONTENT[slug];
  if (!content) throw new Error(`No SEO content for slug "${slug}"`);
  return content;
}

/** Build Next metadata for a content slug. Call from a page's `export const metadata`. */
export function buildServiceMetadata(slug: string): Metadata {
  const c = getContent(slug);
  return {
    title: c.title,
    description: c.metaDescription,
    keywords: c.keywords,
    alternates: { canonical: `/${c.slug}` },
    openGraph: {
      title: c.title,
      description: c.metaDescription,
      url: `${BASE_URL}/${c.slug}`,
      siteName: "Hotel Rate Check",
      type: "website",
    },
  };
}

/** Shared renderer for SEO service/guide pages. */
export default function ServicePage({ slug }: { slug: string }) {
  const c = getContent(slug);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const primaryJsonLd =
    c.pageType === "service"
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: c.h1,
          serviceType: "Hotel rate checking and assisted booking",
          areaServed: "GB",
          provider: { "@type": "Organization", name: "HotelRateCheck.com", url: BASE_URL },
          description: c.metaDescription,
        }
      : {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: c.h1,
          description: c.metaDescription,
          author: { "@type": "Organization", name: "HotelRateCheck.com" },
        };

  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#071526]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(primaryJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#b88434]">Hotel Rate Check</p>
        <h1 className="text-3xl font-bold md:text-5xl">{c.h1}</h1>
        <p className="mt-5 text-lg leading-8 text-gray-700">{c.intro}</p>

        <div className="mt-8">
          <Link href="/#book" className="inline-flex rounded-full bg-[#071526] px-7 py-4 text-base font-bold text-white hover:bg-[#b88434]">
            Book a hotel
          </Link>
        </div>

        {c.sections.map((s) => (
          <div key={s.h2}>
            <h2 className="mt-12 text-2xl font-bold">{s.h2}</h2>
            <p className="mt-4 text-gray-800">{s.body}</p>
          </div>
        ))}

        <h2 className="mt-12 text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-4 space-y-5">
          {c.faqs.map((f) => (
            <div key={f.q}>
              <h3 className="text-lg font-bold text-[#071526]">{f.q}</h3>
              <p className="mt-2 text-gray-800">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[#b88434]/30 bg-white p-6">
          <h2 className="text-xl font-bold">{c.ctaHeading}</h2>
          <p className="mt-3 text-gray-800">{c.ctaBody}</p>
          <Link href="/#book" className="mt-5 inline-flex rounded-full bg-[#071526] px-6 py-3 text-sm font-bold text-white hover:bg-[#b88434]">
            Book a hotel online
          </Link>
        </div>

        <Link
          href="/hotel-rate-check"
          className="mt-8 inline-flex rounded-full border border-[#b88434] px-4 py-2 text-sm font-semibold text-[#071526] hover:bg-[#b88434] hover:text-white"
        >
          ← About hotel rate checks
        </Link>
      </section>
    </main>
  );
}
