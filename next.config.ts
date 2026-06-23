import type { NextConfig } from "next";

/** Conservative security headers applied to every response. No CSP — the
 *  faithful site relies on inline styles/scripts and a Google Maps iframe, so a
 *  strict policy would break it; the host/CDN can layer CSP on if desired. */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    styledComponents: true,
  },
  images: {
    // Local assets only; allow svg via the public folder.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
