import type { MetadataRoute } from "next";

const BASE_URL = "https://www.hotelratecheck.com";

/**
 * sitemap.xml — public, indexable pages only. Add SEO service/guide pages here
 * as they are created (e.g. /hotel-rate-check, /business-hotel-rate-check).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    "",
    "/hotel-rate-check",
    "/business-hotel-rate-check",
    "/group-hotel-rate-check",
    "/contractor-hotel-accommodation",
    "/corporate-hotel-rate-check",
    "/dubai-hotel-rate-check",
    "/how-to-check-if-a-hotel-rate-is-good",
    "/non-refundable-hotel-rates-explained",
    "/hotel-local-taxes-explained",
    "/free-cancellation-vs-cheaper-hotel-rates",
    "/contact",
    "/privacy",
    "/cookies",
    "/terms",
  ];
  return paths.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
