"use client";

import React, { type JSX } from "react";
import Link from "next/link";
import styled from "styled-components";
import { colors } from "@/constants/tokens";
import { Section, ContentColumn } from "@/components/common/Section";
import { Eyebrow, TitleDesc } from "@/components/common/SectionLabel";
import { Tag, TagRow } from "@/components/ui/Tag";
import type { CaseStudyDetail } from "@/types";

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;

  @media (max-width: 991px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const Logo = styled.img`
  height: 44px;
  width: auto;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 56px;
  line-height: 60px;
  font-weight: 500;
  color: ${colors.textDark};
  margin: 0 0 12px;
  white-space: pre-line;

  @media (max-width: 767px) {
    font-size: 38px;
    line-height: 44px;
  }
`;

const ShortDesc = styled.p`
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
  color: ${colors.textGrey};
  margin: 0 0 40px;
  white-space: pre-line;

  @media (max-width: 767px) {
    font-size: 19px;
    line-height: 28px;
  }
`;

const LaptopImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const ProjectInfo = styled.div`
  display: flex;
  gap: 80px;
  margin-top: 64px;
  flex-wrap: wrap;

  .item {
    display: flex;
    flex-direction: column;
  }
  .label {
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${colors.textDark};
    font-size: 19px;
  }
  .label img {
    width: 22px;
    height: 22px;
  }
  .value {
    color: ${colors.textBody};
    font-size: 19px;
    margin: 8px 0 0 32px;
  }
`;

const BlockTitle = styled.h2`
  font-size: 38px;
  line-height: 44px;
  font-weight: 500;
  color: ${colors.white};
  margin: 0 0 24px;

  @media (max-width: 767px) {
    font-size: 28px;
    line-height: 34px;
  }
`;

const Body = styled.p`
  color: ${colors.textGreyLight};
  font-size: 24px;
  line-height: 32px;
  font-weight: 400;
  margin: 0 0 24px;

  @media (max-width: 767px) {
    font-size: 19px;
    line-height: 28px;
  }
`;

const BulletList = styled.ul`
  margin: 0 0 24px;
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

const SolutionCard = styled.div`
  border: 1px solid ${colors.borderDark};
  border-radius: 12px;
  padding: 32px 40px;
  margin-bottom: 24px;

  h3 {
    color: ${colors.white};
    font-size: 26px;
    margin: 0 0 4px;
  }
  .sub {
    color: ${colors.orange};
    font-size: 18px;
    margin: 0 0 16px;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 40px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  border: 1px solid ${colors.borderDark};
  border-radius: 12px;
  padding: 28px;
  img {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
  }
  p {
    color: ${colors.white};
    font-size: 20px;
    line-height: 28px;
    margin: 0;
  }
`;

const ImpactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  margin-top: 40px;

  > div img {
    width: 56px;
    height: 56px;
    margin-bottom: 16px;
  }
  h4 {
    color: ${colors.textDark};
    font-size: 24px;
    margin: 0 0 8px;
  }
  p {
    color: ${colors.textBody};
    font-size: 19px;
    line-height: 28px;
    margin: 0;
  }
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

const CaseNav = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  border-top: 1px solid ${colors.borderDark};
  padding-top: 48px;
  margin-top: 64px;

  a {
    color: ${colors.white};
    font-size: 21px;
    font-weight: 500;
    transition: color 0.25s ease;
    &:hover {
      color: ${colors.orange};
    }
  }
  .label {
    color: ${colors.textGrey};
    font-size: 16px;
    display: block;
    margin-bottom: 6px;
  }
  .next {
    text-align: right;
  }
`;

/** Renders a single case study detail view. */
export default function CaseStudyDetailPage({
  study,
}: {
  study: CaseStudyDetail;
}): JSX.Element {
  return (
    <>
      {/* Top section */}
      <Section $bg="grey" $space="none" style={{ paddingTop: 220, paddingBottom: 120 }}>
        <ContentColumn>
          <TopGrid>
            <div className="reveal fadeInLeft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Logo as="img" src={study.logo} alt={study.name} />
              <Title>{study.title}</Title>
              <ShortDesc>{study.shortDesc}</ShortDesc>
              <TagRow>
                {study.tags.map((t) => (
                  <Tag key={t} $variant="white">
                    {t}
                  </Tag>
                ))}
              </TagRow>
            </div>
            <div className="reveal fadeInRight">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <LaptopImg as="img" src={study.img} alt={study.name} />
            </div>
          </TopGrid>
          <ProjectInfo>
            <div className="item">
              <span className="label">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/case-studies/industry-icon.svg" alt="" />
                Industry
              </span>
              <span className="value">{study.projectDetails.industry}</span>
            </div>
            <div className="item">
              <span className="label">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/case-studies/headquarters.svg" alt="" />
                Headquarters
              </span>
              <span className="value">{study.projectDetails.headquarters}</span>
            </div>
          </ProjectInfo>
        </ContentColumn>
      </Section>

      {/* Challenges + solution */}
      <Section $bg="black" $space="s140">
        <ContentColumn>
          <div className="reveal fadeInUp">
            <Eyebrow onDark>the challenge</Eyebrow>
            <TitleDesc $onDark>What we set out to solve</TitleDesc>
          </div>
          <div style={{ marginTop: 40 }}>
            <Body>{study.challenges.shortInfo}</Body>
            <BulletList>
              {study.challenges.lists.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </BulletList>
            <Body>{study.challenges.background}</Body>
          </div>

          <div className="reveal fadeInUp" style={{ marginTop: 96 }}>
            <Eyebrow onDark>the solution</Eyebrow>
            <BlockTitle style={{ marginTop: 12 }}>{study.piSolution.details}</BlockTitle>
          </div>
          {study.piSolution.solutions?.map((sol) => (
            <SolutionCard key={sol.title} className="reveal fadeInUp">
              <h3>{sol.title}</h3>
              <p className="sub">{sol.subTitle}</p>
              <BulletList style={{ margin: 0 }}>
                {sol.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </BulletList>
            </SolutionCard>
          ))}

          {study.keyFeature.length > 0 ? (
            <div style={{ marginTop: 96 }}>
              <Eyebrow onDark>key features</Eyebrow>
              <FeatureGrid>
                {study.keyFeature.map((f, i) => (
                  <FeatureCard key={i} className="reveal fadeInUp">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.img} alt="" />
                    <p>{f.feature}</p>
                  </FeatureCard>
                ))}
              </FeatureGrid>
            </div>
          ) : null}

          <CaseNav>
            <Link href={study.previous.link}>
              <span className="label">{study.previous.label}</span>
              &larr; Previous
            </Link>
            <Link href={study.next.link} className="next">
              <span className="label">{study.next.label}</span>
              Next &rarr;
            </Link>
          </CaseNav>
        </ContentColumn>
      </Section>

      {/* Long term impact */}
      <Section $bg="grey" $space="s140">
        <ContentColumn>
          <div className="reveal fadeInUp">
            <Eyebrow>long-term impact</Eyebrow>
            <TitleDesc>{study.longTermImpact.title}</TitleDesc>
          </div>
          <ImpactGrid>
            {study.longTermImpact.impact.map((item, i) => (
              <div key={i} className="reveal fadeInUp">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.img} alt="" />
                <h4>{item.title}</h4>
                <p>{item.subTitle}</p>
              </div>
            ))}
          </ImpactGrid>
        </ContentColumn>
      </Section>
    </>
  );
}
