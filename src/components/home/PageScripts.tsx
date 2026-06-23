"use client";

import { useEffect } from "react";
import { initInlineBehaviours } from "./inlineBehaviours";

/**
 * Reusable loader for the inner (non-home) faithful pages. Loads the common
 * library set the PHP footer loaded on every page, then any page-specific
 * scripts (p5 hero, services.js, career.js, …) in order. Because navigation
 * between faithful pages is a full document load (plain <a> links), a
 * per-document dedupe is enough; StrictMode's double mount is guarded by the
 * module-level promise.
 */
const BASE_SCRIPTS: readonly string[] = [
  "/js/ScrollTrigger.min.js",
  "/js/jquery-3.7.1.min.js",
  "/js/bootstrap.min.js",
  "/js/wow.min.js",
  "/js/jquery.matchHeight-min.js",
  "/js/common.min.js",
  "/js/gsap.min.js",
];

const loaded = new Set<string>();

function loadScript(src: string): Promise<void> {
  if (loaded.has(src)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.dataset.piFaithful = "1";
    el.onload = () => {
      loaded.add(src);
      resolve();
    };
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(el);
  });
}

let chain: Promise<void> | null = null;

function loadAll(scripts: readonly string[]): Promise<void> {
  if (!chain) {
    chain = (async () => {
      for (const src of scripts) {
        try {
          await loadScript(src);
        } catch (err) {
          console.error(err);
        }
      }
    })();
  }
  return chain;
}

export default function PageScripts({
  extra = [],
  onReady,
}: {
  /** Page-specific scripts appended after the shared base set. */
  extra?: readonly string[];
  /** Runs once after all scripts have executed (e.g. page matchHeight). */
  onReady?: () => void;
}): null {
  useEffect(() => {
    (window as Window & { BASE_URL?: string }).BASE_URL = "/";

    let cancelled = false;
    loadAll([...BASE_SCRIPTS, ...extra]).then(() => {
      if (cancelled) return;
      // Replay the lifecycle events for listeners that bound during load
      // (services.js / career.js use DOMContentLoaded), then wire the shared
      // footer behaviours and any page-specific ready hook.
      document.dispatchEvent(new Event("DOMContentLoaded"));
      window.dispatchEvent(new Event("load"));
      initInlineBehaviours();
      onReady?.();
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
