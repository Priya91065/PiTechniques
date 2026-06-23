"use client";

import React, { type JSX } from "react";
import styled from "styled-components";
import { colors } from "@/constants/tokens";
import Hero from "@/components/common/Hero";
import { Section, ContentColumn } from "@/components/common/Section";
import { Eyebrow, TitleDesc } from "@/components/common/SectionLabel";
import TeamCard from "@/components/ui/TeamCard";
import { agileSteps, executiveTeam, industries, leadershipTeam } from "@/constants/aboutData";

const RootedGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;

  @media (max-width: 991px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const SectionName = styled.div`
  margin-bottom: 40px;
`;

const Para = styled.p`
  color: ${colors.textDark};
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
  margin: 0 0 28px;
  &:last-child {
    margin-bottom: 0;
  }
  @media (max-width: 767px) {
    font-size: 19px;
    line-height: 28px;
  }
`;

const RootedImage = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 16px;
  background-image: url(/images/about/about-newoffice.jpg);
  background-size: cover;
  background-position: center;

  @media (max-width: 991px) {
    aspect-ratio: 4 / 3;
  }
`;

const IndustriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 120px;

  @media (max-width: 991px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 575px) {
    grid-template-columns: 1fr;
  }
`;

const IndustryCard = styled.div`
  padding: 28px 32px;
  background: ${colors.black};
  border-radius: 12px;
  border: 1px solid ${colors.borderDark};
  transition: border-color 0.3s ease;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    border-color: ${colors.orange};
  }

  img {
    height: 90px;
    width: auto;
    object-fit: contain;
    object-position: left;
  }
  h3 {
    color: ${colors.white};
    font-size: 24px;
    line-height: 32px;
    font-weight: 600;
    margin: 12px 0 0;
    white-space: pre-line;
  }
`;

const AgileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 80px;
  align-items: start;

  @media (max-width: 991px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const AgileIntro = styled.p`
  color: ${colors.textDark};
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
  margin: 32px 0 0;
  .orange {
    color: ${colors.orange};
  }
  @media (max-width: 767px) {
    font-size: 19px;
    line-height: 28px;
  }
`;

const ProcessList = styled.div`
  > div {
    margin-bottom: 40px;
  }
  h4 {
    color: ${colors.textDark};
    font-size: 24px;
    font-weight: 500;
    line-height: 32px;
    margin: 0 0 4px;
  }
  p {
    color: ${colors.textBody};
    font-size: 19px;
    line-height: 28px;
    margin: 0;
  }
  h6 {
    color: ${colors.textDark};
    font-style: italic;
    font-size: 22px;
    line-height: 32px;
    font-weight: 500;
    margin: 32px 0 0;
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 72px;

  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
`;

const ExecGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 24px;
  margin-top: 72px;

  .third {
    grid-column: span 2;
  }
  .half {
    grid-column: span 3;
  }
  .full {
    grid-column: span 6;
  }
  .half .photo,
  .full .photo {
    aspect-ratio: 16 / 7;
  }

  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    .third {
      grid-column: span 1;
    }
    .half {
      grid-column: span 2;
    }
    .full {
      grid-column: span 2;
    }
  }
`;

const ExecHeading = styled(TitleDesc)`
  margin-top: 96px;
`;

/** The About Us page. */
export default function AboutPage(): JSX.Element {
  return (
    <>
      <Hero
        title={
          <>
            We keep it precise and <br /> simple
          </>
        }
        subtitle="Three decades of building with care and clarity."
        variant="about"
        bottomPlacement
      />

      {/* Rooted in experience */}
      <Section $bg="grey" $space="s160">
        <ContentColumn>
          <RootedGrid>
            <div className="reveal fadeInLeft">
              <SectionName>
                <Eyebrow>ABOUT US</Eyebrow>
                <TitleDesc>
                  Rooted in experience.
                  <br />
                  Driven by innovation.
                </TitleDesc>
              </SectionName>
              <Para>
                At Pi Techniques, we&apos;ve been solving problems with tech since
                1992. Beginning as a small support firm for individuals and home
                offices, and growing into a trusted, full-spectrum technology
                partner for modern businesses.
              </Para>
              <Para>
                Over the years, we&rsquo;ve expanded into software development, web
                technologies, and IT infrastructure services. We have been
                delivering solutions that are tailored, reliable, and
                future-ready. Many of our clients have been with us for decades, a
                testament to our clear, simple, and client-first approach. No
                jargon, just measurable results.
              </Para>
              <Para>
                Backed by decades of experience, we create technology shaped
                around your business needs — reliable, scalable, and future-ready.
                Solutions that help grow with your business and keep pace with a
                fast-moving tech world.
              </Para>
            </div>
            <div className="reveal fadeInRight">
              <RootedImage role="img" aria-label="Pi Techniques team at work" />
            </div>
          </RootedGrid>
        </ContentColumn>
      </Section>

      {/* Key industries */}
      <Section $bg="black" $space="s160">
        <ContentColumn>
          <div className="reveal fadeInUp">
            <Eyebrow onDark>key industries</Eyebrow>
            <TitleDesc $onDark>Technology crafted for every sector</TitleDesc>
          </div>
          <IndustriesGrid>
            {industries.map((ind) => (
              <IndustryCard key={ind.title} className="reveal fadeInUp">
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ind.icon} alt="" />
                </div>
                <h3>{ind.title}</h3>
              </IndustryCard>
            ))}
          </IndustriesGrid>
        </ContentColumn>
      </Section>

      {/* Agile process */}
      <Section $bg="grey" $space="s160">
        <ContentColumn>
          <AgileGrid>
            <div className="reveal fadeInLeft">
              <Eyebrow>our agile process</Eyebrow>
              <TitleDesc>Adapting agility for smarter outcomes</TitleDesc>
              <AgileIntro>
                At Pi Techniques, we&rsquo;ve learned that agility isn&rsquo;t just a
                methodology, it&rsquo;s a mindset. As client needs evolve, we adapt.
                That&rsquo;s why we&rsquo;ve embraced{" "}
                <span className="orange">Agile Project Management.</span> A proven,
                flexible framework that helps us stay aligned, responsive, and
                focused on what matters most: delivering results, fast.
              </AgileIntro>
            </div>
            <ProcessList>
              {agileSteps.map((step) => (
                <div key={step.title} className="reveal fadeInUp">
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              ))}
              <h6>
                Agile isn&rsquo;t about moving fast blindly. It&rsquo;s about moving fast
                in the right direction — with you at the center of the journey.
              </h6>
            </ProcessList>
          </AgileGrid>
        </ContentColumn>
      </Section>

      {/* Team */}
      <Section $bg="black" $space="s160">
        <ContentColumn>
          <div className="reveal fadeInUp">
            <Eyebrow onDark>OUR TEAM</Eyebrow>
            <TitleDesc $onDark>Leaders fuelled by passion</TitleDesc>
          </div>
          <TeamGrid>
            {leadershipTeam.map((m) => (
              <TeamCard key={m.name} member={m} />
            ))}
          </TeamGrid>

          <ExecHeading $onDark className="reveal fadeInUp">
            Executive Team
          </ExecHeading>
          <ExecGrid>
            {executiveTeam.map((m) => (
              <div key={m.name} className={m.span ?? "third"}>
                <TeamCard member={m} />
              </div>
            ))}
          </ExecGrid>
        </ContentColumn>
      </Section>
    </>
  );
}
