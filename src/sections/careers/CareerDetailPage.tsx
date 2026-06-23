"use client";

import React, { type JSX } from "react";
import styled from "styled-components";
import { colors } from "@/constants/tokens";
import { Section, ContentColumn } from "@/components/common/Section";
import { Eyebrow } from "@/components/common/SectionLabel";
import ArrowButton from "@/components/ui/ArrowButton";
import type { JobDetail } from "@/types";

const Title = styled.h1`
  font-size: 56px;
  line-height: 60px;
  font-weight: 500;
  color: ${colors.white};
  margin: 12px 0 16px;

  @media (max-width: 767px) {
    font-size: 38px;
    line-height: 44px;
  }
`;

const Meta = styled.p`
  color: ${colors.textMutedLight};
  font-size: 19px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  margin: 0 0 48px;
`;

const GroupTitle = styled.h2`
  color: ${colors.white};
  font-size: 28px;
  line-height: 36px;
  font-weight: 500;
  margin: 48px 0 16px;
`;

const List = styled.ul`
  margin: 0 0 16px;
  padding: 0;
  li {
    color: ${colors.textGreyLight};
    font-size: 20px;
    line-height: 30px;
    position: relative;
    padding-left: 24px;
    margin-bottom: 12px;
  }
  li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 12px;
    width: 8px;
    height: 8px;
    background: ${colors.orange};
  }
`;

const Apply = styled.div`
  margin-top: 56px;
`;

function isGrouped(
  r: JobDetail["responsibilities"]
): r is Record<string, string[]> {
  return !Array.isArray(r);
}

/** A single job description page. */
export default function CareerDetailPage({ job }: { job: JobDetail }): JSX.Element {
  return (
    <Section $bg="black" $space="none" style={{ paddingTop: 200, paddingBottom: 140 }}>
      <ContentColumn>
        <div className="reveal fadeInUp">
          <Eyebrow onDark>open role</Eyebrow>
          <Title>{job.title}</Title>
          <Meta>{job.experience}</Meta>
        </div>

        {job.qualifications.length > 0 ? (
          <div className="reveal fadeInUp">
            <GroupTitle>Qualifications</GroupTitle>
            <List>
              {job.qualifications.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </List>
          </div>
        ) : null}

        {isGrouped(job.responsibilities) ? (
          <div className="reveal fadeInUp">
            <GroupTitle>Responsibilities</GroupTitle>
            {Object.entries(job.responsibilities).map(([heading, items]) => (
              <div key={heading}>
                <GroupTitle as="h3" style={{ fontSize: 22, marginTop: 24 }}>
                  {heading}
                </GroupTitle>
                <List>
                  {items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </List>
              </div>
            ))}
          </div>
        ) : job.responsibilities.length > 0 ? (
          <div className="reveal fadeInUp">
            <GroupTitle>Responsibilities</GroupTitle>
            <List>
              {job.responsibilities.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </List>
          </div>
        ) : null}

        {job.skills.length > 0 ? (
          <div className="reveal fadeInUp">
            <GroupTitle>Skills</GroupTitle>
            <List>
              {job.skills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </List>
          </div>
        ) : null}

        <Apply>
          <ArrowButton href="/contact-us#getintouch" tone="white">
            Apply now
          </ArrowButton>
        </Apply>
      </ContentColumn>
    </Section>
  );
}
