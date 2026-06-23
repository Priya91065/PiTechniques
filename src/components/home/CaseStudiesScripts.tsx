"use client";

import type { JSX } from "react";
import PageScripts from "@/components/home/PageScripts";

/**
 * Client wrapper so the (server-rendered, DB-driven) case-studies list page can
 * still run the p5 hero + the equal-height matchHeight pass without passing a
 * function prop from a Server Component.
 */
export default function CaseStudiesScripts(): JSX.Element {
  return (
    <PageScripts
      extra={["/js/casestudies-p5.js"]}
      onReady={() => {
        const w = window as unknown as {
          jQuery?: (sel: string) => { matchHeight: (o: unknown) => void };
        };
        const jq = w.jQuery;
        if (!jq) return;
        jq(".common-ui .service-details-new").matchHeight({ remove: true });
        jq(".common-ui .service-details-new").matchHeight({ byRow: true });
      }}
    />
  );
}
