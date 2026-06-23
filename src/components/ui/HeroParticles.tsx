"use client";

import React, { useEffect, useRef, type JSX } from "react";

interface HeroParticlesProps {
  /** Visual seed selecting one of the per-page dot field patterns. */
  variant?: "home" | "about" | "services" | "case" | "careers";
}

interface Dot {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hot: boolean;
}

const DOT_COLOR = "#F4F4F4";
const HOVER_COLOR = "#F7941E";
const COMFORT = 80;
const MAX_SPEED = 4;
const MAX_FORCE = 1;

/** Procedural density field per page; returns [0..1] intensity at (u,v). */
function field(variant: NonNullable<HeroParticlesProps["variant"]>, u: number, v: number): number {
  switch (variant) {
    case "about": {
      // dense swirling cluster toward the right
      const cx = 0.62;
      const cy = 0.42;
      const dx = u - cx;
      const dy = v - cy;
      const ang = Math.atan2(dy, dx);
      const rad = Math.hypot(dx, dy);
      const swirl = Math.sin(ang * 6 + rad * 18) * 0.5 + 0.5;
      const fall = Math.max(0, 1 - rad * 2.2);
      return swirl * fall;
    }
    case "services": {
      // sweeping wing arc across the top-right
      const wave = Math.sin(u * 6 + Math.cos(v * 4) * 2) * 0.5 + 0.5;
      const band = Math.max(0, 1 - Math.abs(v - (0.35 + u * 0.25)) * 4);
      return wave * band * (0.3 + u * 0.7);
    }
    case "case": {
      // hexagonal molecule grid
      const gx = (u * 9) % 1;
      const gy = (v * 6) % 1;
      const node = Math.max(0, 1 - Math.hypot(gx - 0.5, gy - 0.5) * 3);
      return node * (0.4 + Math.sin(u * 10 + v * 6) * 0.3);
    }
    case "careers": {
      // diagonal light streaks
      const diag = Math.sin((u + v) * 8) * 0.5 + 0.5;
      const streak = Math.max(0, 1 - Math.abs(((u - v) % 0.5) - 0.25) * 6);
      return diag * (0.3 + streak * 0.7);
    }
    case "home":
    default: {
      // flowing comet trail from top-left to mid-right
      const path = v - (0.15 + Math.sin(u * 3) * 0.12 + u * 0.2);
      const band = Math.max(0, 1 - Math.abs(path) * 5);
      const sparkle = Math.sin(u * 22) * Math.cos(v * 18) * 0.5 + 0.5;
      return band * (0.4 + sparkle * 0.6) * (0.5 + u * 0.5);
    }
  }
}

/**
 * Canvas hero animation: a flowing field of dots that flee the cursor (turning
 * orange) and steer back home. Procedurally generated to mirror the source
 * site's image-sampled p5.js dot field without depending on the original
 * bitmap assets.
 */
export default function HeroParticles({ variant = "home" }: HeroParticlesProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    let dots: Dot[] = [];
    const mouse = { x: -10000, y: -10000 };
    let raf = 0;
    let last = 0;

    const build = (): void => {
      dots = [];
      const step = w < 768 ? 18 : 14;
      for (let py = 0; py < h; py += step) {
        for (let px = 0; px < w; px += step) {
          const u = px / w;
          const v = py / h;
          const intensity = field(variant, u, v);
          if (intensity > 0.32 && Math.random() < intensity) {
            const r = 0.5 + intensity * 3.2;
            dots.push({
              ox: px,
              oy: py,
              x: px,
              y: py,
              vx: 0,
              vy: 0,
              r,
              hot: false,
            });
          }
        }
      }
    };

    const resize = (): void => {
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      w = container.offsetWidth;
      h = container.offsetHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const seek = (d: Dot, tx: number, ty: number): void => {
      let dx = tx - d.x;
      let dy = ty - d.y;
      const dist = Math.hypot(dx, dy) || 0.0001;
      const speed = dist < 100 ? (dist / 100) * MAX_SPEED : MAX_SPEED;
      dx = (dx / dist) * speed;
      dy = (dy / dist) * speed;
      let sx = dx - d.vx;
      let sy = dy - d.vy;
      const smag = Math.hypot(sx, sy);
      if (smag > MAX_FORCE) {
        sx = (sx / smag) * MAX_FORCE;
        sy = (sy / smag) * MAX_FORCE;
      }
      d.vx += sx;
      d.vy += sy;
    };

    const frame = (ts: number): void => {
      const minDelay = 1000 / 35;
      if (ts - last >= minDelay) {
        last = ts;
        ctx.clearRect(0, 0, w, h);
        for (const d of dots) {
          const md = Math.hypot(d.x - mouse.x, d.y - mouse.y);
          if (md < COMFORT) {
            d.hot = true;
            seek(d, d.x + (d.x - mouse.x), d.y + (d.y - mouse.y));
          } else {
            d.hot = false;
            seek(d, d.ox, d.oy);
          }
          const vmag = Math.hypot(d.vx, d.vy);
          if (vmag > MAX_SPEED) {
            d.vx = (d.vx / vmag) * MAX_SPEED;
            d.vy = (d.vy / vmag) * MAX_SPEED;
          }
          d.x += d.vx;
          d.y += d.vy;
          ctx.beginPath();
          ctx.fillStyle = d.hot ? HOVER_COLOR : DOT_COLOR;
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: MouseEvent): void => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = (): void => {
      mouse.x = -10000;
      mouse.y = -10000;
    };

    resize();
    if (reduceMotion) {
      // Draw a single static frame.
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        ctx.beginPath();
        ctx.fillStyle = DOT_COLOR;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      raf = requestAnimationFrame(frame);
    }

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
    };
  }, [variant]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", pointerEvents: "auto" }}
      />
    </div>
  );
}
