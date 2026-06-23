/* eslint-disable react/no-unescaped-entities */
import type { JSX } from "react";
import type { Metadata } from "next";
import StaticPage from "@/components/home/StaticPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage(): JSX.Element {
  return (
    <StaticPage pageClass="privacy-policy" heading="Privacy Policy">
      <div className="content-divide">
        <p>
          Pi Techniques Pvt. Ltd. (“we”, “our”, “us”) is committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, disclose, and protect your personal information when you interact with our
          website, products, and services.
        </p>
      </div>
      <div className="content-divide">
        <h2>Personal Data We Collect</h2>
        <p>We may collect</p>
        <ul>
          <li>
            <b>Identity Data:</b> Full name, organization, role/designation
          </li>
          <li>
            <b>Contact Data:</b> Email address, phone number
          </li>
          <li>
            <b>Technical Data:</b> IP address, browser type, operating system, device data
          </li>
          <li>
            <b>Usage Data:</b> Website pages visited, interactions, preferences
          </li>
          <li>
            <b>Project / Inquiry Data:</b> Information shared for proposals or service delivery
          </li>
        </ul>
      </div>
      <div className="content-divide">
        <h2>How We Collect Data</h2>
        <ul>
          <li>Directly from you through contact forms, subscriptions, email, or contracts</li>
          <li>Automatically via cookies, analytics tools, and log files</li>
          <li>From business partners or publicly available sources</li>
        </ul>
      </div>
      <div className="content-divide">
        <h2>How We Use Your Data</h2>
        <p>We process personal information for:</p>
        <ul>
          <li>Responding to inquiries &amp; support requests</li>
          <li>Contractual obligations (service delivery, project engagements)</li>
          <li>Improving website performance and user experience</li>
          <li>Marketing communication (with consent)</li>
          <li>Legal compliance and security monitoring</li>
        </ul>
      </div>
      <div className="content-divide">
        <h2>Legal Basis for Processing (GDPR)</h2>
        <p>Where applicable, we process data on the following bases:</p>
        <ul>
          <li>Performance of a contract</li>
          <li>Consent, where explicitly provided</li>
          <li>Legitimate business interests</li>
          <li>Compliance with legal obligations</li>
        </ul>
      </div>
      <div className="content-divide">
        <h2>Data Sharing &amp; Disclosure</h2>
        <p>We may share data with:</p>
        <ul>
          <li>Trusted third-party service providers (hosting, analytics, communication)</li>
          <li>
            Legal authorities, where required by law we <b>do not</b> sell personal information.
          </li>
        </ul>
      </div>
      <div className="content-divide">
        <h2>Data Retention</h2>
        <p>
          We retain personal data only as long as necessary to fulfill the purpose it was collected for, or as required
          by law.
        </p>
      </div>
      <div className="content-divide">
        <h2>International Transfers</h2>
        <p>
          If data is transferred outside India / EEA, we ensure adequate safeguards such as Standard Contractual
          Clauses.
        </p>
      </div>
      <div className="content-divide">
        <h2>Data Security</h2>
        <p>
          We maintain technical and organizational measures to secure data from unauthorized access, alteration, loss,
          or misuse.
        </p>
      </div>
      <div className="content-divide">
        <h2>Links to Third-Party Sites</h2>
        <p>Our website may contain external links. We are not responsible for their content or privacy practices.</p>
      </div>
      <div className="content-divide">
        <h2>Updates to This Policy</h2>
        <p>We may update this policy occasionally. Changes will be posted on this page with updated dates.</p>
      </div>
      <div className="content-divide">
        <h2>Contact</h2>
        <p>
          Email: <a href="mailto:privacy@pitechniques.com">privacy@pitechniques.com</a>
        </p>
      </div>
    </StaticPage>
  );
}
