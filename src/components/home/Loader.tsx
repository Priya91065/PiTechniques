"use client";

import { useEffect, useRef, useState } from "react";
import type { JSX } from "react";

/**
 * First-visit skeleton preloader (port of loader.php + loader.js).
 *
 * React owns the element's lifecycle here rather than an external script
 * mutating/removing it. The old loader.js removed the node imperatively, which
 * broke on any React re-render (e.g. Fast Refresh re-inserted the node and the
 * script never ran again, freezing it at the CSS end-state of 30%).
 *
 * Visual phases (faithful to the original):
 *   0 → 30%   driven purely by CSS (.count counter + .progress-bar over 5s)
 *   30 → 100% handed off to JS here, then the preloader unmounts
 * Returning visitors skip it entirely (localStorage `visitedOnce`).
 */
const CSS_PHASE_MS = 5000; // matches the 0→30% CSS animation duration
const STEP_MS = 30;

export default function Loader(): JSX.Element | null {
  // Default visible so SSR and the first client render agree (the element is
  // rendered, then hidden in the effect for returning visitors).
  const [visible, setVisible] = useState(true);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const firstVisit = !localStorage.getItem("visitedOnce");

    if (!firstVisit) {
      document.body.classList.remove("overflow-hidden");
      setVisible(false);
      return;
    }

    localStorage.setItem("visitedOnce", "true");
    document.body.classList.add("overflow-hidden");

    let interval: ReturnType<typeof setInterval> | undefined;

    // After the CSS animation reaches 30%, take over and count to 100%.
    const handoff = setTimeout(() => {
      const bar = barRef.current;
      const counter = countRef.current;
      bar?.classList.add("js-active");
      counter?.classList.add("js-active");

      let i = 30; // CSS already covered 0–30
      const update = (value: number) => {
        if (bar) bar.style.width = value + "%";
        if (counter) counter.textContent = value + "%";
      };
      update(i);

      interval = setInterval(() => {
        i++;
        update(i);
        if (i >= 100) {
          clearInterval(interval);
          document.body.classList.remove("overflow-hidden");
          setVisible(false); // React unmounts the preloader
        }
      }, STEP_MS);
    }, CSS_PHASE_MS);

    return () => {
      clearTimeout(handoff);
      if (interval) clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="loadingScreen" id="preloader">
      <div className="progress-bar" ref={barRef}></div>
      <h1 className="count" ref={countRef}></h1>

      <div className="skeleton-container">
        <div className="group-1">
          <div className="line line1">
            <div className="dash dash-1 exp-40 div"></div>
            <div className="dash dash-2 exp-70 class-name"></div>
            <div className="dash dash-3 exp-110 class"></div>
            <div className="dash dash-4 exp-70 class"></div>
          </div>
          <div className="line line2">
            <div className="dash dash-1 exp-40 div"></div>
            <div className="dash dash-2 exp-70 class-name"></div>
            <div className="dash dash-3 exp-90 class"></div>
          </div>
          <div className="line line3">
            <div className="dash dash-1 exp-300 par"></div>
          </div>
          <div className="line line4">
            <div className="dash dash-1 exp-200 par"></div>
          </div>
          <div className="line line5">
            <div className="dash dash-1 exp-40 div"></div>
          </div>
          <div className="line line6">
            <div className="dash dash-1 exp-40 div"></div>
          </div>
          <div className="line line7">
            <div className="dash dash-1 exp-40 div"></div>
            <div className="dash dash-2 exp-70 class-name"></div>
            <div className="dash dash-3 exp-110 class"></div>
            <div className="dash dash-4 exp-70 class"></div>
          </div>
          <div className="line line8">
            <div className="dash dash-1 exp-40 div"></div>
            <div className="dash dash-2 exp-70 class-name"></div>
            <div className="dash dash-3 exp-90 class"></div>
          </div>
          <div className="line line9">
            <div className="dash dash-1 exp-300 par"></div>
          </div>
          <div className="line line10">
            <div className="dash dash-1 exp-200 par"></div>
          </div>
          <div className="line line11">
            <div className="dash dash-1 exp-40 div"></div>
          </div>
          <div className="line line12">
            <div className="dash dash-1 exp-40 div"></div>
          </div>
          <div className="line line13">
            <div className="dash dash-1 exp-40 div"></div>
            <div className="dash dash-2 exp-70 class-name"></div>
            <div className="dash dash-3 exp-110 class"></div>
            <div className="dash dash-4 exp-70 class"></div>
          </div>
          <div className="line line14">
            <div className="dash dash-1 exp-40 div"></div>
            <div className="dash dash-2 exp-70 class-name"></div>
            <div className="dash dash-3 exp-90 class"></div>
          </div>
          <div className="line line15">
            <div className="dash dash-1 exp-300 par"></div>
          </div>
          <div className="line line16">
            <div className="dash dash-1 exp-200 par"></div>
          </div>
          <div className="line line17">
            <div className="dash dash-1 exp-40 div"></div>
          </div>
          <div className="line line18">
            <div className="dash dash-1 exp-40 div"></div>
          </div>
        </div>

        <div className="group-2 g-3">
          <div className="line line1">
            <div className="dash dash-1 div"></div>
            <div className="dash dash-2 class-name"></div>
            <div className="dash dash-3 class"></div>
            <div className="dash dash-4 class"></div>
          </div>
          <div className="line line2">
            <div className="dash dash-1 div"></div>
            <div className="dash dash-2 exp70 class-name"></div>
            <div className="dash dash-3 exp90 class"></div>
          </div>
          <div className="line line3">
            <div className="dash dash-1 par"></div>
          </div>
          <div className="line line4">
            <div className="dash dash-1 par"></div>
          </div>
          <div className="line line5">
            <div className="dash dash-1 div"></div>
          </div>
          <div className="line line6">
            <div className="dash dash-1 div"></div>
            <div className="dash dash-2 div"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
