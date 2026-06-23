"use client";

import React, { type JSX } from "react";
import { useReveal } from "@/hooks/useReveal";

/** Mounts the IntersectionObserver that drives `.reveal` animations. */
export default function RevealController({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  useReveal();
  return <>{children}</>;
}
