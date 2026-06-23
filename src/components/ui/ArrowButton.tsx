"use client";

import React, { type JSX } from "react";
import Link from "next/link";
import styled, { css } from "styled-components";
import { colors } from "@/constants/tokens";

type Direction = "diagonal" | "right" | "down";

interface ArrowButtonProps {
  href: string;
  children: React.ReactNode;
  /** Text color treatment. */
  tone?: "white" | "black";
  /** Arrow glyph + hover fly direction. */
  direction?: Direction;
  external?: boolean;
  ariaLabel?: string;
  className?: string;
}

const arrowSrc: Record<Direction, string> = {
  diagonal: "/images/newRightArrow.svg",
  right: "/images/rightNewArrow1.svg",
  down: "/images/downNewArrow.svg",
};

const flyKeyframe: Record<Direction, string> = {
  diagonal: "arrowFly",
  right: "arrowFlyRight",
  down: "arrowFlyDown",
};

const Root = styled(Link)<{ $tone: "white" | "black"; $dir: Direction }>`
  gap: 12px;
  display: inline-flex;
  height: 48px;
  align-items: center;
  width: fit-content;
  padding: 0;
  border: 0;
  background: transparent;
  font-weight: 500;
  font-size: 21px;
  line-height: 100%;
  cursor: pointer;
  color: ${({ $tone }) => ($tone === "black" ? colors.black : colors.white)};
  transition: color 0.2s ease;

  .arrowbg {
    background-color: ${colors.orange};
    border-radius: 4px;
    padding: 9px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
  }

  .arrowbg img {
    display: block;
    width: 12px;
    height: 12px;
  }

  &:hover .arrowbg img {
    ${({ $dir }) => css`
      animation: ${flyKeyframe[$dir]} 0.35s ease-in-out forwards;
    `}
  }

  @media (max-width: 767px) {
    font-size: 18px;
  }
`;

/**
 * The recurring CTA: a label followed by an orange rounded square holding a
 * white arrow that "flies" on hover.
 */
export default function ArrowButton({
  href,
  children,
  tone = "white",
  direction = "diagonal",
  external,
  ariaLabel,
  className,
}: ArrowButtonProps): JSX.Element {
  return (
    <Root
      href={href}
      $tone={tone}
      $dir={direction}
      className={className}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{children}</span>
      <span className="arrowbg" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={arrowSrc[direction]} alt="" />
      </span>
    </Root>
  );
}
