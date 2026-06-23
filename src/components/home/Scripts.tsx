"use client";

import { useEffect } from "react";

/**
 * Loads the original homepage JavaScript verbatim, in the same order the PHP
 * site loaded it, then fires DOMContentLoaded/load (which have already passed
 * by the time this client effect runs) so the scripts that bind to those
 * events — loader.js, home.js — initialise correctly. The small footer.php
 * inline behaviours (mobile menu toggle, scroll-to-top, grey-section observer)
 * are reproduced here with plain DOM APIs.
 */
const SCRIPTS: readonly string[] = [
  "/js/ScrollTrigger.min.js",
  "/js/jquery-3.7.1.min.js",
  "/js/bootstrap.min.js",
  "/js/wow.min.js",
  // loader.min.js intentionally omitted — the preloader lifecycle is now owned
  // by the React <Loader> component (see Loader.tsx). Loading it here would
  // double-run and fight React over the #preloader node.
  "/js/jquery.matchHeight-min.js",
  "/js/common.min.js",
  "/js/counter.min.js",
  "/js/owl.carousel.min.js",
  "/js/scripts.min.js",
  "/js/gsap.min.js",
  "/js/home-p5.js",
  "/js/glide.min.js",
  "/js/home.js",
];

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.dataset.piHome = "1";
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(el);
  });
}

/**
 * Loads every homepage script exactly once per document, in order. Hoisted to
 * module scope so the load is NOT tied to a single React mount: in dev,
 * StrictMode mounts the component twice and the first mount's cleanup would
 * otherwise abort the loader, leaving only one script loaded (which broke the
 * homepage on client-side <Link> navigation — Owl/Glide/WOW never loaded).
 */
let scriptsPromise: Promise<void> | null = null;

function loadHomepageScripts(): Promise<void> {
  if (!scriptsPromise) {
    scriptsPromise = (async () => {
      for (const src of SCRIPTS) {
        try {
          await loadScript(src);
        } catch (err) {
          // A single non-critical script shouldn't block the rest.
          console.error(err);
        }
      }
    })();
  }
  return scriptsPromise;
}

function initInlineBehaviours(): void {
  // Mobile menu toggle (footer.php inline).
  const menuIcon = document.querySelector<HTMLElement>(".menu-icon");
  const menu = document.querySelector<HTMLElement>(".menu");
  const header = document.querySelector<HTMLElement>(".header");
  menuIcon?.addEventListener("click", () => {
    menu?.classList.toggle("maxHeight");
    header?.classList.toggle("h-100");
  });

  // Scroll-to-top button border colour over grey sections.
  const scrollBtn = document.querySelector<HTMLElement>(".scrolltotop");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || !scrollBtn) return;
        if (entry.target.classList.contains("grey-section")) {
          scrollBtn.classList.add("border-black");
        } else {
          scrollBtn.classList.remove("border-black");
        }
      });
    },
    { threshold: 0 },
  );
  document.querySelectorAll("section").forEach((s) => observer.observe(s));

  // Smooth scroll to top.
  const toTop = document.querySelector<HTMLElement>(".scrolltotop-new");
  const isIOS =
    /iP(ad|hone|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const handler = (e: Event) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  toTop?.addEventListener(isIOS ? "touchstart" : "click", handler, {
    passive: false,
  });
}

export default function Scripts(): null {
  useEffect(() => {
    (window as Window & { BASE_URL?: string }).BASE_URL = "/";

    let cancelled = false;
    loadHomepageScripts().then(() => {
      if (cancelled) return;
      // The legacy scripts self-initialise (Owl, Glide, WOW, counters) as they
      // execute against the now-mounted homepage DOM. Replay the lifecycle
      // events for any listeners that bound to them during load, then wire up
      // the footer.php inline behaviours against this mount's fresh elements.
      document.dispatchEvent(new Event("DOMContentLoaded"));
      window.dispatchEvent(new Event("load"));
      initInlineBehaviours();
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
