"use client";

import React, { type JSX } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { colors, layout } from "@/constants/tokens";

const HeroParticles = dynamic(() => import("@/components/ui/HeroParticles"), {
  ssr: false,
});

interface HeroProps {
  title: React.ReactNode;
  subtitle: string;
  variant?: "home" | "about" | "services" | "case" | "careers";
  /** Optional CTA rendered under the subtitle (home + services). */
  cta?: React.ReactNode;
  /** Pull the heading block toward the bottom (about / case studies). */
  bottomPlacement?: boolean;
  children?: React.ReactNode;
}

const HeroRoot = styled.section`
  position: relative;
  background: ${colors.blackDeep};
  padding-left: ${layout.gutter};
  padding-right: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;

  @media (max-width: 1199px) {
    padding-left: 84px;
    min-height: 90vh;
  }
  @media (max-width: 767px) {
    padding-left: ${layout.gutterTablet};
    min-height: 80vh;
  }
`;

const Inner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const LeftDiv = styled.div<{ $bottom?: boolean }>`
  position: relative;
  z-index: 2;
  margin: 0 0 200px 0;
  margin-top: ${({ $bottom }) => ($bottom ? "calc(40vh)" : "calc(310px + 90px)")};
  max-width: 640px;

  @media (max-width: 1199px) {
    margin-bottom: 140px;
    margin-top: ${({ $bottom }) => ($bottom ? "30vh" : "300px")};
  }
  @media (max-width: 767px) {
    margin: 0 auto;
    margin-top: 28vh;
    width: 100%;
  }
`;

const Heading = styled.h1`
  font-size: 86px;
  line-height: 96px;
  color: ${colors.white};
  font-weight: 500;
  margin: 0 0 24px;
  letter-spacing: -0.32px;

  @media (max-width: 1199px) {
    font-size: 60px;
    line-height: 64px;
    margin-bottom: 20px;
  }
  @media (max-width: 767px) {
    font-size: 44px;
    line-height: 50px;
  }
`;

const SquareDot = styled.span`
  height: 14px;
  width: 14px;
  display: inline-block;
  margin-left: 8px;
  background-color: ${colors.orange};

  @media (max-width: 767px) {
    height: 10px;
    width: 10px;
  }
`;

const Subtitle = styled.p`
  color: ${colors.textGreyLight};
  font-size: 31px;
  font-weight: 400;
  line-height: 40px;
  margin: 0 0 32px;

  @media (max-width: 1199px) {
    font-size: 24px;
    line-height: 32px;
  }
  @media (max-width: 767px) {
    font-size: 20px;
    line-height: 28px;
  }
`;

/** The shared dark hero used at the top of every page. */
export default function Hero({
  title,
  subtitle,
  variant = "home",
  cta,
  bottomPlacement,
  children,
}: HeroProps): JSX.Element {
  return (
    <HeroRoot>
      <HeroParticles variant={variant} />
      <Inner>
        <LeftDiv $bottom={bottomPlacement} className="reveal fadeIn">
          <Heading>
            {title}
            <SquareDot aria-hidden />
          </Heading>
          <Subtitle>{subtitle}</Subtitle>
          {cta}
        </LeftDiv>
      </Inner>
      {children}
    </HeroRoot>
  );
}
