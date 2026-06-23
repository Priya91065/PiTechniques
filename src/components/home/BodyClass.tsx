"use client";

import { useEffect } from "react";

/**
 * Applies a class to <body> for the lifetime of the route, mirroring the
 * PHP `<body class="$pageClass">`. Original CSS targets `body.homepage`.
 */
export default function BodyClass({ name }: { name: string }): null {
  useEffect(() => {
    const classes = name.split(" ").filter(Boolean);
    document.body.classList.add(...classes);
    return () => {
      document.body.classList.remove(...classes);
    };
  }, [name]);

  return null;
}
