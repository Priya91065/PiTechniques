# Pi Techniques — Next.js Recreation

A pixel-faithful recreation of [pitechniques.com](https://www.pitechniques.com/),
rebuilt as a modern, production-ready **Next.js 15 (App Router)** application in
**100% TypeScript**, styled with **styled-components** and themed with
**Material UI**.

## Tech stack

- **Next.js 15** (App Router, React 19)
- **TypeScript** (strict mode, no `any`, no `.js`/`.jsx` files)
- **styled-components** (all component styling; SSR-safe via a registry)
- **Material UI** theme provider (design tokens + breakpoints)
- **Next/Image-ready** asset pipeline (assets live in `public/images`)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
# open http://localhost:3000

# 3. Production build
npm run build
npm run start
```

> This project was authored in an offline environment, so `node_modules` is not
> included. Run `npm install` once to fetch the pinned dependencies in
> `package.json`.

## Project structure

```
src/
├── app/                      # App Router routes
│   ├── layout.tsx            # Root layout: providers + header + footer
│   ├── page.tsx              # Home
│   ├── about/                # About Us
│   ├── services/             # Services
│   ├── case-studies/         # Listing + [slug] detail
│   ├── careers/              # Listing + [slug] detail
│   ├── contact-us/           # Contact (map + form)
│   ├── privacy-policy/ …      # Policy pages
│   └── not-found.tsx         # 404
├── components/
│   ├── common/               # Hero, Section, SectionLabel, RevealController
│   ├── ui/                   # ArrowButton, Tag, HeroParticles, ClientLogos,
│   │                         #   Testimonials, TeamCard, ContactForm
│   ├── navigation/Header.tsx
│   └── footer/Footer.tsx
├── sections/                 # Page-level compositions (one folder per page)
├── lib/                      # SSR registries + combined Providers
├── styles/                   # MUI theme + GlobalStyle (keyframes, reset)
├── hooks/                    # useReveal (scroll reveal), useCountUp
├── constants/                # Design tokens + all page content data
└── types/                    # Shared TypeScript interfaces
```

## How the original was reproduced

- **Content** (copy, services, team, case studies, jobs, testimonials, policy
  text) was extracted verbatim from the original source and lives in typed
  modules under `src/constants/`.
- **Design tokens** (colors, type scale, spacing, breakpoints) were taken from
  the original stylesheet and centralised in `src/constants/tokens.ts`.
- **Animations**: the WOW.js scroll reveals are reproduced by `useReveal`
  (IntersectionObserver); the counter by `useCountUp`; the client-logo marquee,
  arrow fly-out hover, and section transitions by CSS keyframes in
  `GlobalStyle`.
- **Hero particle field**: a from-scratch typed `<canvas>` component
  (`HeroParticles`) reproduces the original's seek/flee dot-field physics
  (dots flee the cursor and turn orange, then steer home). It is generated
  procedurally per page rather than sampled from a bitmap.

## Notes & fidelity caveats

- The contact form validates on the client and shows success/error states; it
  is not wired to a live backend (the original posts to a PHP endpoint with
  reCAPTCHA).
- The hero animation is a faithful behavioural recreation, not a pixel-identical
  replay, because the original samples banner bitmaps that were not part of the
  provided assets.
- The Google Maps embed on the contact page uses the original place embed URL.

## Accessibility & performance

- Semantic landmarks (`header`, `main`, `footer`, `nav`), labelled controls,
  visible focus, and `prefers-reduced-motion` support (reveals and the marquee
  disable under reduced motion).
- Static generation for case-study and career detail routes via
  `generateStaticParams`.
```
