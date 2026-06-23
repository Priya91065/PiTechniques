"use client";

import React, { type JSX } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as ScThemeProvider } from "styled-components";
import EmotionCacheProvider from "@/lib/EmotionCacheProvider";
import StyledComponentsRegistry from "@/lib/StyledComponentsRegistry";
import { theme } from "@/styles/theme/theme";
import { GlobalStyle } from "@/styles/GlobalStyle";

/** Tokens exposed to styled-components via its own ThemeProvider. */
const scTheme = {
  mui: theme,
};

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <EmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StyledComponentsRegistry>
          <ScThemeProvider theme={scTheme}>
            <GlobalStyle />
            {children}
          </ScThemeProvider>
        </StyledComponentsRegistry>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}
