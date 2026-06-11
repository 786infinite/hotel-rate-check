import type { MetadataRoute } from "next";

const BASE_URL = "https://www.hotelratecheck.com";

/**
 * robots.txt — allow public pages, disallow internal/admin, transactional and
 * per-customer pages, and the API. Points crawlers at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/rate-search",
        "/quote-link-builder",
        "/quote-acceptance",
        "/quote-accepted",
        "/payment-received",
        "/booking-status",
        "/thank-you",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
