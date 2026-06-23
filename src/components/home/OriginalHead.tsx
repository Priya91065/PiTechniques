import type { JSX } from "react";

/**
 * Loads the original production stylesheets verbatim, in the exact order the
 * PHP site loaded them (header.php + index.php head). React 19 hoists these
 * <link> tags into <head>; the shared `precedence` keeps their cascade order.
 * This is the source of truth for the homepage's pixel-for-pixel appearance.
 */
const STYLESHEETS = [
  "/css/bootstrap.min.css",
  "/css/style.min.css",
  "/css/animatehome.min.css",
  "/css/hamburgermenu.min.css",
  "/css/loader.min.css",
  "/css/responsive.min.css",
  "/css/owl.carousel.min.css",
  "/css/owl.theme.default.min.css",
  "/css/animation.css",
  "/css/glide.core.min.css",
] as const;

export default function OriginalHead(): JSX.Element {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
        precedence="pi-fonts"
      />
      {STYLESHEETS.map((href) => (
        <link key={href} rel="stylesheet" href={href} precedence="pi-original" />
      ))}
    </>
  );
}
