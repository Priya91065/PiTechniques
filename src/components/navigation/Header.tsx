"use client";

import React, { useState, type JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { colors, layout } from "@/constants/tokens";
import { navItems } from "@/constants/navigation";

const HeaderRoot = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 30;
  padding: 32px ${layout.gutter};
  background: transparent;

  @media (max-width: 1550px) {
    padding: 32px 0;
  }
  @media (max-width: 1101px) {
    background: ${colors.blackHeader};
    border-bottom: 1px solid ${colors.blackHeader};
    padding: 20px 84px;
  }
  @media (max-width: 767px) {
    padding: 16px ${layout.gutterTablet};
  }
`;

const Column = styled.div`
  max-width: 1066px;
  margin: 0 auto;
  background: ${colors.navPill};
  padding: 11px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 1101px) {
    background: transparent;
    padding: 0;
  }
`;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  img {
    height: 42px;
    width: auto;
  }
`;

const Nav = styled.nav<{ $open: boolean }>`
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: 1101px) {
    position: fixed;
    inset: 0;
    top: 0;
    flex-direction: column;
    justify-content: center;
    gap: 32px;
    background: ${colors.blackHeader};
    transform: translateX(${({ $open }) => ($open ? "0" : "100%")});
    transition: transform 0.35s ease;
    z-index: 40;
  }
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  position: relative;
  color: ${({ $active }) => ($active ? colors.orange : colors.textGreyLight)};
  font-size: 18px;
  font-weight: 500;
  line-height: 20px;
  transition: color 0.15s ease-in-out;

  &:hover {
    color: ${colors.orange};
  }

  &::before {
    content: "";
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ $active }) => ($active ? "6px" : "0")};
    height: ${({ $active }) => ($active ? "6px" : "0")};
    background: ${colors.orange};
    transition: all 0.15s ease-in-out;
  }
  &:hover::before {
    width: 6px;
    height: 6px;
  }

  @media (max-width: 1101px) {
    font-size: 22px;
  }
`;

const GetInTouch = styled(Link)`
  border: 1px solid ${colors.orange};
  color: ${colors.orange};
  border-radius: 100px;
  padding: 11px 20px;
  font-size: 18px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.25s ease;

  .box {
    background: ${colors.orange};
    border-radius: 4px;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .box img {
    width: 10px;
    height: 10px;
  }

  &:hover {
    background: ${colors.orange};
    color: ${colors.blackHeader};
  }
`;

const Burger = styled.button<{ $open: boolean }>`
  display: none;
  background: transparent;
  border: 0;
  cursor: pointer;
  width: 32px;
  height: 32px;
  position: relative;
  z-index: 50;

  @media (max-width: 1101px) {
    display: inline-block;
  }

  span,
  span::before,
  span::after {
    content: "";
    position: absolute;
    left: 4px;
    width: 24px;
    height: 2px;
    background: ${colors.orange};
    transition: all 0.2s ease;
  }
  span {
    top: 15px;
    background: ${({ $open }) => ($open ? "transparent" : colors.orange)};
  }
  span::before {
    top: ${({ $open }) => ($open ? "0" : "-6px")};
    transform: rotate(${({ $open }) => ($open ? "-45deg" : "0")});
  }
  span::after {
    top: ${({ $open }) => ($open ? "0" : "6px")};
    transform: rotate(${({ $open }) => ($open ? "45deg" : "0")});
  }
`;

const MobileOnly = styled.div`
  display: none;
  @media (max-width: 1101px) {
    display: block;
    margin-top: 12px;
  }
`;

const DesktopOnly = styled.div`
  display: inline-flex;
  margin-left: 24px;
  @media (max-width: 1101px) {
    display: none;
  }
`;

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Sticky top navigation: dark pill on desktop, full-screen drawer on mobile. */
export default function Header(): JSX.Element {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = (): void => setOpen(false);

  return (
    <HeaderRoot>
      <Column>
        <Logo href="/" title="Pi Techniques" onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/footer-logo.svg" alt="Pi Techniques" />
        </Logo>

        <Burger
          $open={open}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
        </Burger>

        <Nav $open={open}>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              $active={isActive(pathname, item.href)}
              onClick={close}
            >
              {item.label}
            </NavLink>
          ))}
          <MobileOnly>
            <GetInTouch href="/contact-us#getintouch" onClick={close}>
              Get in touch
              <span className="box" aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/newRightArrow.svg" alt="" />
              </span>
            </GetInTouch>
          </MobileOnly>
        </Nav>

        <DesktopOnly>
          <GetInTouch href="/contact-us#getintouch">
            Get in touch
            <span className="box" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/newRightArrow.svg" alt="" />
            </span>
          </GetInTouch>
        </DesktopOnly>
      </Column>
    </HeaderRoot>
  );
}
