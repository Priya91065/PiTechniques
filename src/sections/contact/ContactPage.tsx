"use client";

import React, { type JSX } from "react";
import styled from "styled-components";
import { colors } from "@/constants/tokens";
import { Section, ContentColumn } from "@/components/common/Section";
import { Eyebrow, TitleDesc } from "@/components/common/SectionLabel";
import ContactForm from "@/components/ui/ContactForm";
import { contactInfo } from "@/constants/navigation";

const MapGrid = styled.div`
  display: grid;
  grid-template-columns: 5fr 4fr;
  gap: 40px;
  align-items: start;
  margin-top: 48px;

  @media (max-width: 991px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const OfficeBox = styled.div`
  border-radius: 12px;
  overflow: hidden;
  background: ${colors.black};

  iframe {
    height: 380px;
    width: 100%;
    border: 0;
    display: block;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;

    @media (max-width: 767px) {
      height: 240px;
    }
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;

  .name {
    color: ${colors.white};
    font-size: 32px;
    line-height: 36px;
    margin: 0;
  }
  .loc {
    color: ${colors.border};
    font-size: 19px;
    line-height: 28px;
    margin: 4px 0 0;
  }
  a {
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${colors.greyBg};
    font-size: 21px;
    font-weight: 500;
  }
  .arrowbg {
    background: ${colors.orange};
    border-radius: 4px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .arrowbg img {
    width: 12px;
    height: 12px;
  }
  a:hover .arrowbg img {
    animation: arrowFly 0.35s ease-in-out forwards;
  }

  @media (max-width: 767px) {
    .name {
      font-size: 22px;
      line-height: 28px;
    }
  }
`;

const Addr = styled.p`
  color: ${colors.textDark};
  font-size: 32px;
  line-height: 36px;
  font-weight: 400;
  margin: 0;

  @media (max-width: 767px) {
    font-size: 22px;
    line-height: 30px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 9fr;
  gap: 64px;
  align-items: start;

  @media (max-width: 1199px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const FormIntro = styled.p`
  color: ${colors.white};
  font-size: 32px;
  line-height: 40px;
  font-weight: 500;
  margin: 0 0 56px;

  @media (max-width: 767px) {
    font-size: 22px;
    line-height: 30px;
    margin-bottom: 40px;
  }
`;

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.140669523596!2d72.824424!3d18.9251667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1e97e031c0b%3A0x8a44b9ad6132d028!2sPi%20Techniques%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1762169535718!5m2!1sen!2sin";

const MAP_DIRECTIONS =
  "https://www.google.com/maps/place/Pi+Techniques+Pvt.+Ltd./@18.9251667,72.824424,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7d1e97e031c0b:0x8a44b9ad6132d028!8m2!3d18.9251667!4d72.824424!16s%2Fg%2F1th5y83b?entry=ttu";

/** The Contact Us page: headquarters map + the get-in-touch form. */
export default function ContactPage(): JSX.Element {
  return (
    <>
      {/* Headquarters */}
      <Section $bg="grey" $space="none" style={{ paddingTop: 200, paddingBottom: 140 }}>
        <ContentColumn>
          <div className="reveal fadeInUp">
            <Eyebrow>LOCATION</Eyebrow>
            <TitleDesc>Our headquarters</TitleDesc>
          </div>
          <MapGrid>
            <OfficeBox className="reveal fadeInLeft">
              <iframe
                src={MAP_SRC}
                title="Pi Techniques headquarters map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <CardFooter>
                <div>
                  <p className="name">Nariman Point</p>
                  <p className="loc">Mumbai</p>
                </div>
                <a href={MAP_DIRECTIONS} target="_blank" rel="noopener noreferrer">
                  <span>Get directions</span>
                  <span className="arrowbg" aria-hidden>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/newRightArrow.svg" alt="" />
                  </span>
                </a>
              </CardFooter>
            </OfficeBox>
            <div className="reveal fadeInRight">
              <Addr>
                {contactInfo.addressLine1}
                <br />
                Nariman Point,
                <br />
                Mumbai &ndash; 400021
              </Addr>
            </div>
          </MapGrid>
        </ContentColumn>
      </Section>

      {/* Get in touch */}
      <Section $bg="black" $space="s140" id="getintouch">
        <ContentColumn>
          <FormGrid>
            <div className="reveal fadeInLeft">
              <Eyebrow onDark>Contact US</Eyebrow>
              <TitleDesc $onDark>
                Get in
                <br />
                touch
              </TitleDesc>
            </div>
            <div className="reveal fadeInRight">
              <FormIntro>
                We&rsquo;re here to help and answer any questions you might have. We
                look forward to hearing from you.
              </FormIntro>
              <ContactForm />
            </div>
          </FormGrid>
        </ContentColumn>
      </Section>
    </>
  );
}
