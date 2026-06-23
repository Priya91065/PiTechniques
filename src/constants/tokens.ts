/**
 * Design tokens reverse-engineered from the original pitechniques.com stylesheet.
 * These mirror the exact colors, spacing and type scale of the source site.
 */

export const colors = {
  orange: "#F7941E",
  // Backgrounds
  pageBg: "#F4F4F4",
  greyBg: "#F6F6F6",
  black: "#121212",
  blackHeader: "#1B1B1B",
  blackDeep: "#0B0B0B",
  heroBlack: "#151515",
  cardBlack: "#191919",
  navPill: "#323131",
  tagBlack: "#323131",
  tagContactGrey: "#58585A",
  // Text
  textDark: "#1B1B1B",
  textBody: "#444446",
  textMutedLight: "#AFAFB0",
  textGrey: "#68686A",
  textGreyLight: "#CDCDCE",
  textNumberLabel: "#8B8B8C",
  white: "#F4F4F4",
  pureWhite: "#FFFFFF",
  // Borders
  border: "#C6C6C6",
  borderDark: "#323131",
  borderFooter: "#58595B",
  redStar: "#FF8989",
} as const;

export const fonts = {
  body: '"DM Sans", sans-serif',
} as const;

/** Horizontal page gutter used by .common-space / .top-section. */
export const layout = {
  gutter: "80px",
  gutterTablet: "32px",
  maxWidthDesktopCol: "66.666%", // col-xl-8
} as const;

/** Material UI-aligned breakpoints matching the source's bootstrap usage. */
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
} as const;

export type BreakpointKey = keyof typeof breakpoints;
