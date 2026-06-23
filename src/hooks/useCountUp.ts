"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpResult {
  ref: (node: HTMLElement | null) => void;
  value: number;
}

/**
 * Counts from 0 up to `target` once the element enters the viewport.
 * Replaces the source's jQuery counter.min.js.
 */
export function useCountUp(target: number, durationMs = 1600): CountUpResult {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);
  const nodeRef = useRef<HTMLElement | null>(null);

  const ref = (node: HTMLElement | null): void => {
    nodeRef.current = node;
  };

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const run = (): void => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const tick = (now: number): void => {
        const progress = Math.min((now - start) / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      run();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [target, durationMs]);

  return { ref, value };
}
