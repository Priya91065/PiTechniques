"use client";

import React, { type JSX } from "react";
import styled from "styled-components";
import { clientLogos } from "@/constants/homeData";

const Slider = styled.div`
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  width: 100%;

  &:hover .logos-slide {
    animation-play-state: paused;
  }
`;

const Track = styled.div`
  display: inline-block;
  animation: 45s slide infinite linear;

  img {
    margin-right: 80px;
    vertical-align: middle;
    object-fit: contain;
    filter: none;

    @media (max-width: 767px) {
      margin-right: 48px;
    }
  }
`;

/** Infinite horizontal marquee of client logos (duplicated for seamless loop). */
export default function ClientLogos(): JSX.Element {
  const renderRow = (keyPrefix: string): JSX.Element => (
    <Track className="logos-slide">
      {clientLogos.map((logo, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${keyPrefix}-${i}`}
          src={logo.src}
          alt="Client logo"
          height={Math.min(logo.h, 80)}
          style={{ height: Math.min(logo.h, 80) }}
        />
      ))}
    </Track>
  );

  return (
    <Slider>
      {renderRow("a")}
      {renderRow("b")}
    </Slider>
  );
}
