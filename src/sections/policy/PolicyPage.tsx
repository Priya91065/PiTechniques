"use client";

import React, { type JSX } from "react";
import styled from "styled-components";
import { colors } from "@/constants/tokens";
import { Section, ContentColumn } from "@/components/common/Section";
import { Eyebrow } from "@/components/common/SectionLabel";
import type { PolicyContent } from "@/types";

const Heading = styled.h1`
  font-size: 56px;
  line-height: 60px;
  font-weight: 500;
  color: ${colors.textDark};
  margin: 12px 0 48px;

  @media (max-width: 767px) {
    font-size: 40px;
    line-height: 46px;
  }
`;

const Sub = styled.h2`
  font-size: 28px;
  line-height: 36px;
  font-weight: 600;
  color: ${colors.textDark};
  margin: 40px 0 12px;
`;

const Body = styled.p`
  font-size: 19px;
  line-height: 30px;
  color: ${colors.textBody};
  margin: 0 0 18px;
`;

const Bullet = styled.li`
  font-size: 19px;
  line-height: 30px;
  color: ${colors.textBody};
  position: relative;
  padding-left: 24px;
  margin-bottom: 12px;
  list-style: none;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 12px;
    width: 8px;
    height: 8px;
    background: ${colors.orange};
  }
`;

const Eyebrows: Record<string, string> = {
  "Privacy Policy": "legal",
  "Terms of Use": "legal",
  "CSR Statement": "responsibility",
  "Data Protection & Cookie Statement": "legal",
};

/** Renders a long-form policy/legal page from structured blocks. */
export default function PolicyPage({ content }: { content: PolicyContent }): JSX.Element {
  return (
    <Section $bg="grey" $space="none" style={{ paddingTop: 200, paddingBottom: 140 }}>
      <ContentColumn>
        <div className="reveal fadeInUp">
          <Eyebrow>{Eyebrows[content.title] ?? "legal"}</Eyebrow>
          <Heading>{content.title}</Heading>
        </div>
        <div className="reveal fadeInUp">
          {content.blocks.map((b, i) => {
            if (b.tag === "h1") return null; // title already shown
            if (b.tag === "li") return <Bullet key={i}>{b.text}</Bullet>;
            if (b.tag === "h2" || b.tag === "h3" || b.tag === "h4")
              return <Sub key={i}>{b.text}</Sub>;
            return <Body key={i}>{b.text}</Body>;
          })}
        </div>
      </ContentColumn>
    </Section>
  );
}
