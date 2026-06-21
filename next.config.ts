import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin Turbopack's workspace root to this project so a stray parent lockfile
  // (e.g. one in your home folder) doesn't get picked as the root.
  turbopack: { root: process.cwd() },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "geolocation=(), camera=(), microphone=()" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        // TODO: add a tested Content-Security-Policy (must allow Stripe Checkout,
        // Plausible, Leaflet/OpenStreetMap tiles, and Unsplash before enabling).
      ],
    }];
  },
  images: {
    // Licensed free-stock sources (both free for commercial use under their
    // own licenses). Add your own domain/CDN here if you host images elsewhere.
    // Local files in /public need no entry — reference them as "/images/x.jpg".
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;
