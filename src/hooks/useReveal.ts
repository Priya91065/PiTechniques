"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Adds the `reveal--in` class to any `.reveal` element when it scrolls into
 * view. Mirrors the WOW.js fade family used throughout the source site.
 *
 * `RevealController` lives in the persistent (site) layout, so without a
 * dependency the observer would only ever be set up for the first page that
 * mounts. Re-running on `pathname` change re-scans the freshly rendered page so
 * its sections reveal correctly when navigating (incl. back/forward).
 */
export function useReveal(): void {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal:not(.reveal--in)")
    );
    if (els.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("reveal--in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("reveal--in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);
}
