"use client";

import styled from "styled-components";
import { colors } from "@/constants/tokens";

/** Technology chip. `$variant` toggles the dark-section vs light-card style. */
export const Tag = styled.span<{ $variant?: "dark" | "white" }>`
  background-color: ${({ $variant }) =>
    $variant === "white" ? "#E7E7E8" : colors.tagBlack};
  padding: 4px 20px;
  display: inline-flex;
  align-items: center;
  border-radius: 100px;
  color: ${({ $variant }) =>
    $variant === "white" ? colors.textGrey : colors.textGreyLight};
  font-size: 19px;
  line-height: 28px;
  font-weight: 500;

  @media (max-width: 767px) {
    font-size: 16px;
    line-height: 24px;
    padding: 4px 16px;
  }
`;

export const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
