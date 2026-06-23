"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type JSX,
  type ReactNode,
} from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { buildAdminTheme, type ThemeMode } from "@/lib/admin/theme";

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggle: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: "light",
  toggle: () => undefined,
});

export function useThemeMode(): ThemeModeContextValue {
  return useContext(ThemeModeContext);
}

const STORAGE_KEY = "pi-admin-theme";

/**
 * Provides the admin MUI theme with a persisted light/dark toggle.
 * Starts "light" on the server + first client render (no hydration mismatch),
 * then syncs from localStorage after mount.
 */
export default function ThemeModeProvider({ children }: { children: ReactNode }): JSX.Element {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") setMode(stored);
  }, []);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      toggle: () =>
        setMode((prev) => {
          const next: ThemeMode = prev === "light" ? "dark" : "light";
          localStorage.setItem(STORAGE_KEY, next);
          return next;
        }),
    }),
    [mode],
  );

  const theme = useMemo(() => buildAdminTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
