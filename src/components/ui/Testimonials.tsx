"use client";

import React, { useState, type JSX } from "react";
import styled from "styled-components";
import { colors } from "@/constants/tokens";
import { testimonials } from "@/constants/homeData";

const Wrap = styled.div`
  position: relative;
  margin-top: 60px;
`;

const Controls = styled.div`
  position: absolute;
  top: -88px;
  right: 0;
  display: flex;
  gap: 16px;

  @media (max-width: 767px) {
    position: static;
    margin-bottom: 24px;
    justify-content: flex-end;
  }
`;

const ArrowBtn = styled.button<{ $dir: "prev" | "next"; $disabled: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 100px;
  border: 1px solid ${colors.white};
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.3 : 1)};
  transition: all 0.25s ease;

  svg {
    transform: rotate(${({ $dir }) => ($dir === "prev" ? "180deg" : "0")});
  }
  svg path {
    stroke: ${colors.white};
  }

  &:hover {
    background: ${({ $disabled }) => ($disabled ? "transparent" : colors.orange)};
    border-color: ${({ $disabled }) => ($disabled ? colors.white : colors.orange)};
  }
`;

const Viewport = styled.div`
  overflow: hidden;
`;

const Slide = styled.div`
  p {
    color: ${colors.white};
    font-size: 24px;
    line-height: 36px;
    font-weight: 400;
    margin: 0 0 32px;
    max-width: 900px;

    @media (max-width: 767px) {
      font-size: 18px;
      line-height: 28px;
    }
  }
  h6 {
    color: ${colors.white};
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 4px;
  }
  small {
    color: ${colors.textMutedLight};
    font-size: 18px;
    i {
      font-style: italic;
    }
  }
`;

/** Quote slider mirroring the source Glide testimonials carousel. */
export default function Testimonials(): JSX.Element {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  return (
    <Wrap>
      <Controls>
        <ArrowBtn
          $dir="prev"
          $disabled={index === 0}
          aria-label="Previous testimonial"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
            <path d="M11.2857 1L19 9M19 9L11.2857 17M19 9H1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ArrowBtn>
        <ArrowBtn
          $dir="next"
          $disabled={index === testimonials.length - 1}
          aria-label="Next testimonial"
          onClick={() => setIndex((i) => Math.min(testimonials.length - 1, i + 1))}
        >
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
            <path d="M11.2857 1L19 9M19 9L11.2857 17M19 9H1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ArrowBtn>
      </Controls>
      <Viewport>
        <Slide>
          <p>&ldquo;{current.quote}&rdquo;</p>
          <div>
            <h6>{current.company}</h6>
            <small>
              {current.attribution} <i>{current.role}</i>
            </small>
          </div>
        </Slide>
      </Viewport>
    </Wrap>
  );
}
