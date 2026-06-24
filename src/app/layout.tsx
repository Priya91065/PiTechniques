import type { Metadata, Viewport } from "next";
import type { JSX, ReactNode } from "react";

/**
 * Resolve the canonical site origin for `metadataBase`. Robust against a
 * misconfigured NEXT_PUBLIC_SITE_URL: an empty/whitespace value falls back to
 * localhost, a value missing the scheme (e.g. "example.com") gets "https://"
 * prepended, and anything still unparseable falls back instead of throwing —
 * a bad env var must never crash the production build.
 */
function resolveMetadataBase(): URL {
  const fallback = "http://localhost:3000";
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return new URL(fallback);
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withScheme);
  } catch {
    return new URL(fallback);
  }
}

/**
 * Neutral root shell. It only owns <html>/<body> and the document <head>
 * metadata. Visual chrome and styling are supplied per-route:
 *  - the faithful homepage ( / ) brings its own original stylesheets + header/footer.
 *  - the (site) group brings the styled-components provider stack.
 */
export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: {
    default: "Homepage - Pi Techniques",
    template: "%s - Pi Techniques",
  },
  description:
    "Our services extend from small websites to complex web applications, new ideas or old legacy systems, IT infrastructure from 5 computers to 200 computers. Our clients are individuals, mid size companies and global corporations. We take great care in assessing each clients requirement to provide the perfect custom fitted solution.",
  authors: [{ name: "Pi Techniques" }],
  icons: { shortcut: "/images/favicon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 3,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
