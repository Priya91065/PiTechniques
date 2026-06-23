"use client";

import styled from "styled-components";
import { colors, layout } from "@/constants/tokens";

/**
 * Outer section padding wrapper. `variant` controls the vertical rhythm used
 * by the source's .common-space* utility classes.
 */
export const Section = styled.section<{
  $bg?: "grey" | "black" | "deep" | "page";
  $space?: "s160" | "s140" | "s120" | "top140" | "none";
  $noRightPad?: boolean;
}>`
  position: relative;
  background-color: ${({ $bg }) =>
    $bg === "black"
      ? colors.black
      : $bg === "deep"
        ? colors.blackDeep
        : $bg === "page"
          ? colors.pageBg
          : colors.greyBg};
  padding-left: ${layout.gutter};
  padding-right: ${({ $noRightPad }) => ($noRightPad ? "0" : layout.gutter)};
  ${({ $space }) => {
    switch ($space) {
      case "s160":
        return "padding-top: 280px; padding-bottom: 160px;";
      case "s140":
        return "padding-top: 140px; padding-bottom: 140px;";
      case "s120":
        return "padding-top: 120px; padding-bottom: 120px;";
      case "top140":
        return "padding-top: 140px;";
      case "none":
        return "";
      default:
        return "padding-top: 160px; padding-bottom: 160px;";
    }
  }}

  @media (max-width: 1280px) {
    padding-left: ${layout.gutter};
    padding-right: ${({ $noRightPad }) => ($noRightPad ? "0" : layout.gutter)};
  }
  @media (max-width: 1199px) {
    padding-left: 84px;
    padding-right: ${({ $noRightPad }) => ($noRightPad ? "0" : "84px")};
    ${({ $space }) =>
      $space === "s160" ? "padding-top: 200px; padding-bottom: 120px;" : ""}
  }
  @media (max-width: 767px) {
    padding-left: ${layout.gutterTablet};
    padding-right: ${({ $noRightPad }) => ($noRightPad ? "0" : layout.gutterTablet)};
    ${({ $space }) => {
      switch ($space) {
        case "s160":
          return "padding-top: 140px; padding-bottom: 80px;";
        case "s140":
        case "s120":
          return "padding-top: 90px; padding-bottom: 90px;";
        default:
          return "";
      }
    }}
  }
`;

/** Centered content column matching `col-xl-8 offset-xl-2`. */
export const ContentColumn = styled.div`
  max-width: 1066px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: 1922px) {
    max-width: 1100px;
  }
`;
