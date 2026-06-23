"use client";

import type { JSX, ReactNode } from "react";
import EmotionCacheProvider from "@/lib/EmotionCacheProvider";
import ThemeModeProvider from "@/lib/admin/ThemeModeProvider";
import NotificationProvider from "@/components/admin/NotificationProvider";
import ConfirmProvider from "@/components/admin/ConfirmProvider";

/**
 * Client provider stack for the admin area: Emotion SSR cache + MUI theme
 * (light/dark) + toast notifications + confirm dialogs. Fully isolated from the
 * public site's original CSS.
 */
export default function AdminProviders({ children }: { children: ReactNode }): JSX.Element {
  return (
    <EmotionCacheProvider options={{ key: "mui" }}>
      <ThemeModeProvider>
        <NotificationProvider>
          <ConfirmProvider>{children}</ConfirmProvider>
        </NotificationProvider>
      </ThemeModeProvider>
    </EmotionCacheProvider>
  );
}
