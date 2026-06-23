"use client";

import React, { type JSX } from "react";
import styled from "styled-components";
import { colors } from "@/constants/tokens";
import ArrowButton from "@/components/ui/ArrowButton";

const Wrap = styled.div`
  min-height: 80vh;
  background: ${colors.blackDeep};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 200px 32px 120px;

  h1 {
    color: ${colors.white};
    font-size: 86px;
    line-height: 96px;
    font-weight: 500;
    margin: 0 0 16px;
  }
  p {
    color: ${colors.textGreyLight};
    font-size: 24px;
    margin: 0 0 32px;
  }

  @media (max-width: 767px) {
    h1 {
      font-size: 56px;
      line-height: 64px;
    }
  }
`;

export default function NotFound(): JSX.Element {
  return (
    <Wrap>
      <h1>
        404<span style={{ color: colors.orange }}>.</span>
      </h1>
      <p>The page you&rsquo;re looking for can&rsquo;t be found.</p>
      <ArrowButton href="/" tone="white">
        Back to home
      </ArrowButton>
    </Wrap>
  );
}
