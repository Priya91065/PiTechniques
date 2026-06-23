"use client";

import React, { useState, type JSX } from "react";
import createCache, { type EmotionCache, type Options } from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider as DefaultCacheProvider } from "@emotion/react";

export interface ThemeRegistryProps {
  options: Options & { enableCssLayer?: boolean };
  children: React.ReactNode;
}

interface RegistryState {
  cache: EmotionCache;
  flush: () => string[];
}

/**
 * Emotion cache provider that streams MUI styles correctly during SSR.
 */
export default function EmotionCacheProvider({
  options,
  children,
}: ThemeRegistryProps): JSX.Element {
  const [registry] = useState<RegistryState>(() => {
    const cache = createCache(options);
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = (): string[] => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = registry.flush();
    if (names.length === 0) {
      return null;
    }
    let styles = "";
    for (const name of names) {
      styles += registry.cache.inserted[name];
    }
    return (
      <style
        data-emotion={`${registry.cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <DefaultCacheProvider value={registry.cache}>
      {children}
    </DefaultCacheProvider>
  );
}
