"use client";

import { createTheme, type Theme } from "@mui/material/styles";
import { breakpoints, colors, fonts } from "@/constants/tokens";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xxl: true;
  }
  interface Palette {
    brand: { orange: string; dark: string; greyText: string };
  }
  interface PaletteOptions {
    brand?: { orange: string; dark: string; greyText: string };
  }
}

export const theme: Theme = createTheme({
  breakpoints: {
    values: {
      xs: breakpoints.xs,
      sm: breakpoints.sm,
      md: breakpoints.md,
      lg: breakpoints.lg,
      xl: breakpoints.xl,
      xxl: breakpoints.xxl,
    },
  },
  palette: {
    mode: "light",
    primary: { main: colors.orange },
    background: { default: colors.pageBg, paper: colors.black },
    text: { primary: colors.textDark, secondary: colors.textBody },
    brand: {
      orange: colors.orange,
      dark: colors.blackHeader,
      greyText: colors.textGrey,
    },
  },
  typography: {
    fontFamily: fonts.body,
    button: { textTransform: "none" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.pageBg,
          fontFamily: fonts.body,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          overflowX: "hidden",
        },
      },
    },
  },
});
