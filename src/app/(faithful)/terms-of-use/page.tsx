/* eslint-disable react/no-unescaped-entities */
import type { JSX } from "react";
import type { Metadata } from "next";
import StaticPage from "@/components/home/StaticPage";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsOfUsePage(): JSX.Element {
  return (
    <StaticPage pageClass="terms-of-use" heading="Terms of Use">
      <div className="content-divide">
        <p>
          By accessing this website, you agree to comply with these Terms of Use. If you do not agree, please
          discontinue use of the website.
        </p>
      </div>
      <div className="content-divide">
        <h2>Website Use</h2>
        <ul>
          <li>Website content is for general information and business use</li>
          <li>You agree not to misuse the site, conduct unlawful activity, or attempt unauthorized access</li>
          <li>Content may change without prior notice</li>
        </ul>
      </div>
      <div className="content-divide">
        <h2>Intellectual Property</h2>
        <p>
          All content, trademarks, branding, graphics, code, and design belong to Pi Techniques Pvt. Ltd. unless
          otherwise indicated.
        </p>
        <p>
          You may not reproduce, copy, distribute, or modify any content without written<br />
          permission.
        </p>
      </div>
      <div className="content-divide">
        <h2>User Submissions</h2>
        <p>
          When you provide information via forms or email, you grant us permission to use it for service and
          communication purposes.
        </p>
      </div>
      <div className="content-divide">
        <h2>Third-Party Services</h2>
        <p>
          We are not responsible for third-party site functionality, links, content, or terms.<br />
          Disclaimers
        </p>
        <ul>
          <li>We provide the site on an “as is” and “as available” basis</li>
          <li>We do not guarantee uninterrupted access, accuracy, or completeness</li>
          <li>Use of the site is at your own risk</li>
        </ul>
      </div>
      <div className="content-divide">
        <h2>Limitation of Liability</h2>
        <p>
          We are not liable for any direct, indirect, incidental, or consequential damages arising from the use of our
          website.
        </p>
      </div>
      <div className="content-divide">
        <h2>Indemnification</h2>
        <p>You agree to indemnify and hold Pi Techniques harmless from any claims arising from:</p>
        <ul>
          <li>Your use of the site</li>
          <li>Violation of these terms</li>
          <li>Violation of rights of others</li>
        </ul>
      </div>
      <div className="content-divide">
        <h2>Governing Law &amp; Jurisdiction</h2>
        <p>
          These Terms are governed by the laws of Mumbai, Maharashtra, India, and disputes shall be resolved under the
          exclusive jurisdiction of its courts.
        </p>
      </div>
      <div className="content-divide">
        <h2>Termination</h2>
        <p>
          We may restrict or terminate access to the site without notice if we believe the Terms have been violated.
        </p>
      </div>
    </StaticPage>
  );
}
