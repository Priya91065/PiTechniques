"use client";

import React, { type JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { colors, layout } from "@/constants/tokens";
import {
  contactInfo,
  footerCompanyLinks,
  footerPolicyLinks,
} from "@/constants/navigation";

const FooterRoot = styled.footer`
  background: ${colors.black};
  padding: 120px ${layout.gutter} 0;

  @media (max-width: 1199px) {
    padding: 100px 84px 0;
  }
  @media (max-width: 767px) {
    padding: 80px ${layout.gutterTablet} 0;
  }
`;

const Column = styled.div`
  max-width: 1066px;
  margin: 0 auto;
`;

const Menu = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 44px;
  flex-wrap: wrap;

  h1 {
    color: ${colors.white};
    font-size: 22px;
    font-weight: 700;
    line-height: 34px;
    margin: 0 0 24px;
  }
`;

const LeftSide = styled.div`
  display: flex;
  gap: 64px;
  flex-wrap: wrap;
`;

const LinkList = styled.ul`
  margin: 0;
  padding: 0;
  li {
    margin-bottom: 24px;
  }
  a {
    color: ${colors.textGrey};
    font-size: 22px;
    line-height: 34px;
    transition: color 0.4s ease;
  }
  a.active,
  a:hover {
    color: ${colors.white};
  }
`;

const RightSide = styled.div`
  display: flex;
  gap: 64px;
  flex-wrap: wrap;
`;

const ContactList = styled.ul`
  margin: 0;
  padding: 0;
  p {
    color: ${colors.white};
    font-weight: 700;
    font-size: 22px;
    line-height: 34px;
    margin: 0 0 24px;
  }
  li {
    margin-bottom: 16px;
  }
  a {
    color: ${colors.textGrey};
    font-size: 22px;
    line-height: 34px;
    transition: color 0.4s ease;
    &:hover {
      color: ${colors.white};
    }
  }
  .email {
    border-bottom: 1px solid ${colors.textMutedLight};
    display: inline-block;
  }
  .brand img {
    margin-top: 8px;
    height: 28px;
    width: auto;
  }
`;

const Address = styled.div`
  h1 {
    color: ${colors.white};
    font-size: 22px;
    font-weight: 700;
    line-height: 34px;
    margin: 0 0 24px;
  }
  p {
    color: ${colors.textGrey};
    font-size: 22px;
    line-height: 34px;
    margin: 0 0 16px;
  }
  a svg path {
    fill: ${colors.textGrey};
    transition: fill 0.3s ease;
  }
  a:hover svg path {
    fill: ${colors.white};
  }
`;

const Copyright = styled.div`
  border-top: 1px solid ${colors.borderFooter};
  padding: 32px 0;
  p {
    margin: 0;
    color: ${colors.textGrey};
    font-size: 16px;
    line-height: 28px;
  }
`;

const ScrollTopRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 24px;
`;

const ScrollTop = styled.button`
  background: transparent;
  border: 1px solid ${colors.borderFooter};
  border-radius: 100px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  &:hover {
    border-color: ${colors.orange};
    background: ${colors.orange};
  }
  img {
    width: 16px;
    height: 16px;
  }
`;

const LinkedInIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.4504 20.4505H16.8939V14.8811C16.8939 13.5529 16.8703 11.8439 15.0442 11.8439C13.192 11.8439 12.9082 13.2904 12.9082 14.7853V20.4505H9.35293V8.99709H12.7674V10.5618H12.8147C13.5114 9.37202 14.8053 8.6612 16.1831 8.71206C19.7881 8.71206 20.4516 11.0834 20.4516 14.1668L20.4504 20.4505ZM5.33997 7.43118C4.19983 7.43118 3.27613 6.50747 3.27613 5.36733C3.27613 4.22719 4.19983 3.30349 5.33997 3.30349C6.48011 3.30349 7.40381 4.22719 7.40381 5.36733C7.40381 6.50747 6.48011 7.43118 5.33997 7.43118ZM7.1176 20.4505H3.55762V8.99709H7.1176V20.4505ZM22.2233 0.00134427H1.77053C0.804248 -0.00930019 0.0118272 0.76538 0 1.73166V22.2684C0.0118272 23.2358 0.804248 24.0105 1.77053 23.9999H22.2233C23.1919 24.0117 23.9879 23.237 24.0009 22.2684V1.73048C23.9867 0.761831 23.1907 -0.0128484 22.2233 0.000161495Z" fill="#68686A" />
  </svg>
);

function activeClass(pathname: string | null, activeFor?: string[]): string {
  if (!pathname) return "";
  const map: Record<string, string[]> = {
    "/about": ["aboutpage"],
    "/services": ["service-page"],
    "/case-studies": ["case-studies-page", "case-studies-details"],
    "/careers": ["career-page", "career-details-page"],
  };
  const matches = Object.entries(map).some(
    ([href, classes]) =>
      (pathname === href || pathname.startsWith(`${href}/`)) &&
      (activeFor ?? []).some((c) => classes.includes(c))
  );
  return matches ? "active" : "";
}

/** Site footer present on every page. */
export default function Footer(): JSX.Element {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  const scrollTop = (): void =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <FooterRoot>
      <Column>
        <Menu>
          <LeftSide>
            <div>
              <h1>Company</h1>
              <LinkList>
                {footerCompanyLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={activeClass(pathname, l.activeFor)}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </LinkList>
            </div>
            <div>
              <h1 style={{ visibility: "hidden" }}>.</h1>
              <LinkList>
                {footerPolicyLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </LinkList>
            </div>
          </LeftSide>

          <RightSide>
            <ContactList>
              <p>Contact</p>
              <li>
                <a href={`mailto:${contactInfo.email}`} className="email">
                  {contactInfo.email}
                </a>
              </li>
              <li>
                <a href={contactInfo.phoneHref}>{contactInfo.phone}</a>
              </li>
              <li className="brand">
                <Link href="/" title="Pi Techniques">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/footer-logo.svg" alt="Pi Techniques" />
                </Link>
              </li>
            </ContactList>

            <Address>
              <h1>Address</h1>
              <p>
                {contactInfo.addressLine1}
                <br />
                {contactInfo.addressLine2}
              </p>
              <a
                href={contactInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </Address>
          </RightSide>
        </Menu>

        <Copyright>
          <p>
            <span>©</span> {year} Pi Techniques Pvt. Ltd. All rights reserved.
          </p>
        </Copyright>
      </Column>

      <ScrollTopRow>
        <ScrollTop aria-label="Scroll to top" onClick={scrollTop}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/arrow_up.svg" alt="" />
        </ScrollTop>
      </ScrollTopRow>
    </FooterRoot>
  );
}
