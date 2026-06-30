/**
 * HTML source of truth for the faithful policy pages — used to seed the CMS and
 * as a fallback when a DB row is missing/unpublished. `contentHtml` is the exact
 * inner HTML of the `.static-content` container, so the rendered page is
 * pixel-identical to the original markup.
 */
export interface PolicyPageHtml {
  slug: string;
  pageClass: string;
  heading: string; // H1 — may contain inline HTML (e.g. <br/>)
  bannerDescription: string | null;
  contentClassName: string;
  contentHtml: string;
  seoTitle: string;
  seoDescription: string;
}

export const POLICY_SLUGS = ["privacy-policy", "terms-of-use", "csr-policy", "data-protection"] as const;
export type PolicySlug = (typeof POLICY_SLUGS)[number];

const privacyPolicy: PolicyPageHtml = {
  slug: "privacy-policy",
  pageClass: "privacy-policy",
  heading: "Privacy Policy",
  bannerDescription: null,
  contentClassName: "static-content",
  contentHtml: `<div class="content-divide"><p>Pi Techniques Pvt. Ltd. (“we”, “our”, “us”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you interact with our website, products, and services.</p></div>
<div class="content-divide"><h2>Personal Data We Collect</h2><p>We may collect</p><ul><li><b>Identity Data:</b> Full name, organization, role/designation</li><li><b>Contact Data:</b> Email address, phone number</li><li><b>Technical Data:</b> IP address, browser type, operating system, device data</li><li><b>Usage Data:</b> Website pages visited, interactions, preferences</li><li><b>Project / Inquiry Data:</b> Information shared for proposals or service delivery</li></ul></div>
<div class="content-divide"><h2>How We Collect Data</h2><ul><li>Directly from you through contact forms, subscriptions, email, or contracts</li><li>Automatically via cookies, analytics tools, and log files</li><li>From business partners or publicly available sources</li></ul></div>
<div class="content-divide"><h2>How We Use Your Data</h2><p>We process personal information for:</p><ul><li>Responding to inquiries &amp; support requests</li><li>Contractual obligations (service delivery, project engagements)</li><li>Improving website performance and user experience</li><li>Marketing communication (with consent)</li><li>Legal compliance and security monitoring</li></ul></div>
<div class="content-divide"><h2>Legal Basis for Processing (GDPR)</h2><p>Where applicable, we process data on the following bases:</p><ul><li>Performance of a contract</li><li>Consent, where explicitly provided</li><li>Legitimate business interests</li><li>Compliance with legal obligations</li></ul></div>
<div class="content-divide"><h2>Data Sharing &amp; Disclosure</h2><p>We may share data with:</p><ul><li>Trusted third-party service providers (hosting, analytics, communication)</li><li>Legal authorities, where required by law we <b>do not</b> sell personal information.</li></ul></div>
<div class="content-divide"><h2>Data Retention</h2><p>We retain personal data only as long as necessary to fulfill the purpose it was collected for, or as required by law.</p></div>
<div class="content-divide"><h2>International Transfers</h2><p>If data is transferred outside India / EEA, we ensure adequate safeguards such as Standard Contractual Clauses.</p></div>
<div class="content-divide"><h2>Data Security</h2><p>We maintain technical and organizational measures to secure data from unauthorized access, alteration, loss, or misuse.</p></div>
<div class="content-divide"><h2>Links to Third-Party Sites</h2><p>Our website may contain external links. We are not responsible for their content or privacy practices.</p></div>
<div class="content-divide"><h2>Updates to This Policy</h2><p>We may update this policy occasionally. Changes will be posted on this page with updated dates.</p></div>
<div class="content-divide"><h2>Contact</h2><p>Email: <a href="mailto:privacy@pitechniques.com">privacy@pitechniques.com</a></p></div>`,
  seoTitle: "Privacy Policy - Pi Techniques",
  seoDescription: "How Pi Techniques Pvt. Ltd. collects, uses, discloses, and protects your personal information.",
};

const termsOfUse: PolicyPageHtml = {
  slug: "terms-of-use",
  pageClass: "terms-of-use",
  heading: "Terms of Use",
  bannerDescription: null,
  contentClassName: "static-content",
  contentHtml: `<div class="content-divide"><p>By accessing this website, you agree to comply with these Terms of Use. If you do not agree, please discontinue use of the website.</p></div>
<div class="content-divide"><h2>Website Use</h2><ul><li>Website content is for general information and business use</li><li>You agree not to misuse the site, conduct unlawful activity, or attempt unauthorized access</li><li>Content may change without prior notice</li></ul></div>
<div class="content-divide"><h2>Intellectual Property</h2><p>All content, trademarks, branding, graphics, code, and design belong to Pi Techniques Pvt. Ltd. unless otherwise indicated.</p><p>You may not reproduce, copy, distribute, or modify any content without written<br/> permission.</p></div>
<div class="content-divide"><h2>User Submissions</h2><p>When you provide information via forms or email, you grant us permission to use it for service and communication purposes.</p></div>
<div class="content-divide"><h2>Third-Party Services</h2><p>We are not responsible for third-party site functionality, links, content, or terms.<br/> Disclaimers</p><ul><li>We provide the site on an “as is” and “as available” basis</li><li>We do not guarantee uninterrupted access, accuracy, or completeness</li><li>Use of the site is at your own risk</li></ul></div>
<div class="content-divide"><h2>Limitation of Liability</h2><p>We are not liable for any direct, indirect, incidental, or consequential damages arising from the use of our website.</p></div>
<div class="content-divide"><h2>Indemnification</h2><p>You agree to indemnify and hold Pi Techniques harmless from any claims arising from:</p><ul><li>Your use of the site</li><li>Violation of these terms</li><li>Violation of rights of others</li></ul></div>
<div class="content-divide"><h2>Governing Law &amp; Jurisdiction</h2><p>These Terms are governed by the laws of Mumbai, Maharashtra, India, and disputes shall be resolved under the exclusive jurisdiction of its courts.</p></div>
<div class="content-divide"><h2>Termination</h2><p>We may restrict or terminate access to the site without notice if we believe the Terms have been violated.</p></div>`,
  seoTitle: "Terms of Use - Pi Techniques",
  seoDescription: "The terms governing use of the Pi Techniques website.",
};

const csrPolicy: PolicyPageHtml = {
  slug: "csr-policy",
  pageClass: "csr-policy",
  heading: "CSR Policy",
  bannerDescription: null,
  contentClassName: "static-content csr-div",
  contentHtml: `<style>
.csr-div .csr-logo img.logofilter{ mix-blend-mode: luminosity; }
.csr-div .csr-logo img.logofilter2{ height: auto; filter: grayscale(1); }</style>
<div class="content-divide"><p>At Pi Techniques, we see CSR as a natural extension of who we are, not just a box that has to be checked. </p><p>Whenever we support a cause, whether it’s helping children access better education, contributing to community initiatives, promoting health and well-being, or caring for animals it comes from a genuine place. </p><p>We believe that small, consistent efforts can create real impact, and we prefer to stay hands-on and involved rather than doing things for visibility. Our approach is straightforward: support causes we truly care about, contribute where we can make a difference, and stay connected to the people and communities around us.</p></div>
<div class="content-divide"><div class="csr-logo align-items-center"><img src="/images/csr/teach-india-new.svg" class="logofilter" alt="Teach India"/><img src="/images/csr/manali.svg" alt="Manali Strays"/><img src="/images/csr/koshish.svg" alt="Koshish"/><img src="/images/csr/shraddha-new.jpg" class="logofilter2" alt="Shraddha"/></div><div class="pdf-content"><a href="/pdf/CSR-policy.pdf" class="" target="_blank" rel="noreferrer"><img src="/pdf/pdf-thumbnail.png" class="pdf-image" alt="pdf-thumbnail"/><span>View document<span class="arrowbg"><img src="/images/newRightArrow.svg" class="rightArrow" alt="Right Arrow"/></span></span></a></div></div>`,
  seoTitle: "CSR Policy - Pi Techniques",
  seoDescription: "Pi Techniques' approach to corporate social responsibility.",
};

const dataProtection: PolicyPageHtml = {
  slug: "data-protection",
  pageClass: "data-protection",
  heading: "Data Protection &amp;<br/>Cookie Statement",
  bannerDescription: null,
  contentClassName: "static-content",
  contentHtml: `<div class="content-divide"><p>Pi Techniques uses cookies and similar technologies to:</p><ul><li>Recognize your device and browser</li><li>Monitor website performance and analytics</li><li>Personalize your browsing experience</li></ul></div>
<div class="content-divide"><table class="table"><thead><tr><th scope="col" style="width:270px">Type of Cookie</th><th scope="col" style="width:365px">Purpose</th><th scope="col">Examples</th></tr></thead><tbody><tr><td scope="row">Strictly Necessary</td><td><h6 class="d-block d-md-none">Purpose</h6>Enable basic site functionality</td><td><h6 class="d-block d-md-none">Examples</h6>Session management, security</td></tr><tr><td scope="row">Performance / Analytics</td><td><h6 class="d-block d-md-none">Purpose</h6>Improve features, track interactions</td><td><h6 class="d-block d-md-none">Examples</h6>Google Analytics</td></tr><tr><td scope="row">Functional</td><td><h6 class="d-block d-md-none">Purpose</h6>Remember preferences</td><td><h6 class="d-block d-md-none">Examples</h6>Language, form inputs</td></tr></tbody></table></div>
<div class="content-divide"><h2>Cookie Controls</h2><p>You can modify cookie settings through your browser or consent manager. Disabling cookies may affect functionality.</p></div>
<div class="content-divide"><h2>Data Protection Practices</h2><p>We align data protection controls with recognized standards, including but not limited to:</p><ul><li>Secure hosting</li><li>Encryption and access control</li><li>Regular audits and monitoring</li></ul></div>
<div class="content-divide"><h2>Analytics &amp; Third-Party Tracking</h2><p>We may use tools like Google Analytics for anonymized traffic insights. These providers follow their own privacy policies.</p></div>`,
  seoTitle: "Data Protection & Cookie Statement - Pi Techniques",
  seoDescription: "How Pi Techniques uses cookies and applies data-protection practices.",
};

export const POLICY_PAGES_HTML: Record<PolicySlug, PolicyPageHtml> = {
  "privacy-policy": privacyPolicy,
  "terms-of-use": termsOfUse,
  "csr-policy": csrPolicy,
  "data-protection": dataProtection,
};
