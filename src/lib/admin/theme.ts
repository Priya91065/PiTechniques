import { createTheme, type Theme } from "@mui/material/styles";

export type ThemeMode = "light" | "dark";

/**
 * Builds the admin MUI theme for a given mode. Brand orange primary on a
 * neutral surface; dark mode uses deep neutrals close to the public site's
 * black palette.
 */
export function buildAdminTheme(mode: ThemeMode): Theme {
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: { main: "#F7941E" },
      secondary: { main: isDark ? "#CDCDCE" : "#1B1B1B" },
      background: {
        default: isDark ? "#121212" : "#f4f5f7",
        paper: isDark ? "#1b1b1b" : "#ffffff",
      },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: '"DM Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    },
    components: {
      MuiCard: { defaultProps: { elevation: isDark ? 2 : 1 } },
    },
  });
}
