import type { JSX } from "react";
import { getSiteSettings } from "@/server/content/siteSettings";

const LINKEDIN_PATH =
  "M20.4504 20.4505H16.8939V14.8811C16.8939 13.5529 16.8703 11.8439 15.0442 11.8439C13.192 11.8439 12.9082 13.2904 12.9082 14.7853V20.4505H9.35293V8.99709H12.7674V10.5618H12.8147C13.5114 9.37202 14.8053 8.6612 16.1831 8.71206C19.7881 8.71206 20.4516 11.0834 20.4516 14.1668L20.4504 20.4505ZM5.33997 7.43118C4.19983 7.43118 3.27613 6.50747 3.27613 5.36733C3.27613 4.22719 4.19983 3.30349 5.33997 3.30349C6.48011 3.30349 7.40381 4.22719 7.40381 5.36733C7.40381 6.50747 6.48011 7.43118 5.33997 7.43118ZM7.1176 20.4505H3.55762V8.99709H7.1176V20.4505ZM22.2233 0.00134427H1.77053C0.804248 -0.00930019 0.0118272 0.76538 0 1.73166V22.2684C0.0118272 23.2358 0.804248 24.0105 1.77053 23.9999H22.2233C23.1919 24.0117 23.9879 23.237 24.0009 22.2684V1.73048C23.9867 0.761831 23.1907 -0.0128484 22.2233 0.000161495";

/** Renders address lines with <br/> between them (faithful to the markup). */
function addressMarkup(lines: string[]): JSX.Element {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}

/** Faithful port of includes/footer.php (markup, classes, copy text preserved). */
export default async function Footer(): Promise<JSX.Element> {
  const year = new Date().getFullYear();
  const { companyEmail, companyPhone, addressLines, linkedinUrl, footerNote } = await getSiteSettings();
  const address = addressMarkup(addressLines);
  return (
    <>
      <div className="footerTopSpacing"></div>
      <style>{`
.scrolltotop-new {
-webkit-tap-highlight-color: transparent;
touch-action: manipulation;
cursor: pointer;
-webkit-user-select: none;
user-select: none;
}`}</style>
      <footer className="footer-newUI desktopView">
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-12 col-xl-8 offset-xl-2 footerColumn">
              <div className="footer-menu">
                <div className="leftSideUI">
                  <ul>
                    <li>
                      <h1 className="mb-0">Company</h1>
                    </li>
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/services">Services</a></li>
                    <li><a href="/case-studies">Case Studies</a></li>
                    <li><a href="/careers">Careers</a></li>
                  </ul>
                  <ul>
                    <li className="blankli">&nbsp;</li>
                    <li><a href="/privacy-policy">Privacy Policy</a></li>
                    <li><a href="/terms-of-use">Terms of Use</a></li>
                    <li><a href="/csr-policy">CSR Statement</a></li>
                    <li>
                      <a href="/data-protection">
                        Data Protection &amp; <br className="d-block d-md-none" /> Cookie Statement
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="rightSideUI">
                  <ul className="getintouch">
                    <li>
                      <h1 className="mb-0">Contact</h1>
                    </li>
                    <li><a href={`mailto:${companyEmail}`}>{companyEmail}</a></li>
                    <li><a href={`tel:${companyPhone}`}>{companyPhone}</a></li>
                    <li className="largeScreenFooterLogo">
                      <a className="navbar-brand logo" href="/" title="Pi Techniques">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/footer-logo.svg" alt="" />
                      </a>
                    </li>
                  </ul>
                  <div className="address desktopViewAdress d-none d-lg-block">
                    <h1 className="mb-0">Address</h1>
                    <p>{address}</p>
                    <a href={linkedinUrl ?? "#"} target="_blank" rel="noreferrer" title="linkedin" className="linkedInIcon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d={LINKEDIN_PATH} fill="#68686A" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="rightSideUI iPadViewAdress d-block d-lg-none">
                <div className="address">
                  <h1 className="mb-0">Address</h1>
                  <p>61/63C Mittal Tower,<br /> Nariman Point, Mumbai - 400021</p>
                  <a className="navbar-brand logo" href="/" title="Pi Techniques">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/footer-logo.svg" alt="" />
                  </a>
                  <a href={linkedinUrl ?? "#"} target="_blank" rel="noreferrer" title="linkedin" className="linkedInIcon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d={LINKEDIN_PATH} fill="#68686A" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="copyright">
                <p className="m-0 position-relative"><span>©</span> {year} {footerNote ?? ""}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-logo">
          <a href="#top" className="scrolltotop scrolltotop-new" aria-label="scrollToTop">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/arrow_up.svg" alt="" />
          </a>
        </div>
      </footer>
    </>
  );
}
