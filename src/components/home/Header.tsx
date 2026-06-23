import type { JSX } from "react";
import { getNavItems } from "@/server/content/navigation";

/**
 * Faithful port of includes/header.php (markup + class names preserved).
 * .php hrefs are mapped onto the Next routes; BASE_URL becomes "/".
 * The hamburger is the original CSS checkbox toggle; jQuery (common/footer
 * scripts) adds the `.maxHeight` / `.h-100` behaviour on top.
 *
 * Nav links are DB-driven (admin → Navigation, HEADER location). The original
 * four links are preserved as a fallback when no rows exist. The last link
 * keeps the original `m-0` utility class.
 */
export default async function Header(): Promise<JSX.Element> {
  const navItems = await getNavItems("HEADER");

  return (
    <header className="header headerNewUI">
      <div className="container-fluid p-0">
        <div className="row g-0">
          <div className="col-12 col-xl-8 offset-xl-2 headerColumn">
            <div className="collapse-menu">
              <a className="navbar-brand logo" href="/" title="Pi Techniques">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/footer-logo.svg" className="desk-logo" alt="Pi Techniques Logo" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo-mobile.svg" className="mob-logo" alt="Pi Techniques Logo" />
              </a>
              <nav>
                <input className="menu-btn" type="checkbox" id="menu-btn" aria-label="Toggle Navigaton Menu" />
                <label className="menu-icon" htmlFor="menu-btn">
                  <span className="navicon"></span>
                </label>
              </nav>
            </div>
            <div className="menu">
              <ul className="navbar-nav m-auto">
                {navItems.map((item, i) => (
                  <li className="nav-item" key={`${item.href}-${i}`}>
                    <a className={i === navItems.length - 1 ? "nav-link m-0" : "nav-link"} href={item.href}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a href="/contact-us#getintouch" className="btn-get btnWithRightArrow onlyforMobile">
                Get in touch
                <span className="arrowbg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/newRightArrow.svg" className="rightArrow" alt="Right Arrow" />
                </span>
              </a>
            </div>
            <a href="/contact-us#getintouch" className="btn-get btnWithRightArrow onlyforDesktop">
              Get in touch
              <span className="arrowbg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/newRightArrow.svg" className="rightArrow" alt="Right Arrow" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
