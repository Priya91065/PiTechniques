"use client";

import React, { type JSX } from "react";
import styled from "styled-components";
import { colors } from "@/constants/tokens";

const SquareDotSmall = styled.span`
  height: 8px;
  width: 8px;
  display: inline-block;
  margin-left: 8px;
  background-color: ${colors.orange};
`;

const SmallTitle = styled.h4<{ $onDark?: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${({ $onDark }) => ($onDark ? colors.textGreyLight : colors.textGrey)};
  line-height: 20px;
  letter-spacing: 2.4px;
  margin: 0 0 8px;
  text-transform: uppercase;
`;

/** The eyebrow label, e.g. "OUR SERVICES •". */
export function Eyebrow({
  children,
  onDark,
}: {
  children: React.ReactNode;
  onDark?: boolean;
}): JSX.Element {
  return (
    <SmallTitle $onDark={onDark}>
      {children}
      <SquareDotSmall aria-hidden />
    </SmallTitle>
  );
}

export const TitleDesc = styled.h3<{ $onDark?: boolean }>`
  font-size: 56px;
  color: ${({ $onDark }) => ($onDark ? colors.white : colors.textDark)};
  font-weight: 500;
  line-height: 60px;
  letter-spacing: -0.16px;
  margin: 0;

  @media (max-width: 1199px) {
    font-size: 48px;
    line-height: 54px;
  }
  @media (max-width: 767px) {
    font-size: 40px;
    line-height: 46px;
  }
`;
