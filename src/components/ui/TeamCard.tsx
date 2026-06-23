"use client";

import React, { type JSX } from "react";
import styled from "styled-components";
import { colors } from "@/constants/tokens";
import type { TeamMember } from "@/types";

const Card = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
  background: ${colors.cardBlack};

  img.photo {
    width: 100%;
    display: block;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img.photo {
    transform: scale(1.04);
  }
`;

const Details = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px 24px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.78) 70%);

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .name {
    color: ${colors.white};
    font-size: 22px;
    font-weight: 600;
    margin: 0;
  }
  .role {
    color: ${colors.textMutedLight};
    font-size: 18px;
    line-height: 26px;
    margin: 4px 0 0;
    font-weight: 500;
  }
  a img {
    width: 22px;
    height: 22px;
  }
`;

/** Photo tile for a team member with name, role and optional LinkedIn link. */
export default function TeamCard({ member }: { member: TeamMember }): JSX.Element {
  return (
    <Card className="reveal fadeInUp">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="photo" src={member.image} alt={member.name} />
      <Details>
        <div className="row">
          <p className="name">{member.name}</p>
          {member.linkedin ? (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              aria-label={`${member.name} on LinkedIn`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/about/linkedin.svg" alt="" />
            </a>
          ) : null}
        </div>
        <p className="role">{member.role}</p>
      </Details>
    </Card>
  );
}
