"use client";

import { createGlobalStyle } from "styled-components";
import { colors, fonts } from "@/constants/tokens";

/**
 * Global base styles + the keyframes used across the site (logo marquee,
 * arrow fly-out on hover, scroll-reveal fade family, hero particle fade).
 * Mirrors animatehome.css / animation.css / style.css from the source.
 */
export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    font-family: ${fonts.body};
    background-color: ${colors.pageBg};
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul {
    list-style: none;
  }

  img {
    max-width: 100%;
  }

  /* ---- Scroll reveal (WOW.js parity) ---- */
  .reveal {
    opacity: 0;
    will-change: transform, opacity;
    transition: opacity 1s ease, transform 1s ease;
  }
  .reveal.reveal--in { opacity: 1; transform: none !important; }

  .reveal.fadeIn { }
  .reveal.fadeInUp { transform: translateY(40px); }
  .reveal.fadeInLeft { transform: translateX(-60px); }
  .reveal.fadeInRight { transform: translateX(60px); }
  .reveal.zoomIn { transform: scale(0.92); }

  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity: 1 !important; transform: none !important; transition: none; }
    .logos-slide { animation: none !important; }
    *, *::before, *::after { scroll-behavior: auto !important; }
  }

  /* ---- Client logo marquee ---- */
  @keyframes slide {
    from { transform: translateX(0); }
    to { transform: translateX(-100%); }
  }

  /* ---- Arrow fly-out micro interaction ---- */
  @keyframes arrowFly {
    0% { transform: translate(0, 0); opacity: 1; }
    40% { transform: translate(10px, -10px); opacity: 0; }
    41% { transform: translate(-10px, 10px); opacity: 0; }
    100% { transform: translate(0, 0); opacity: 1; }
  }
  @keyframes arrowFlyRight {
    0% { transform: translate(0, 0); opacity: 1; }
    40% { transform: translate(14px, 0); opacity: 0; }
    41% { transform: translate(-14px, 0); opacity: 0; }
    100% { transform: translate(0, 0); opacity: 1; }
  }
  @keyframes arrowFlyDown {
    0% { transform: translate(0, 0); opacity: 1; }
    40% { transform: translate(0, 10px); opacity: 0; }
    41% { transform: translate(0, -10px); opacity: 0; }
    100% { transform: translate(0, 0); opacity: 1; }
  }
`;
