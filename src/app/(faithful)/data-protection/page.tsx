/* eslint-disable react/no-unescaped-entities */
import type { JSX } from "react";
import type { Metadata } from "next";
import StaticPage from "@/components/home/StaticPage";

export const metadata: Metadata = { title: "Data Protection & Cookie Statement" };

export default function DataProtectionPage(): JSX.Element {
  return (
    <StaticPage
      pageClass="data-protection"
      heading={
        <>
          Data Protection &amp;<br />Cookie Statement
        </>
      }
    >
      <div className="content-divide">
        <p>Pi Techniques uses cookies and similar technologies to:</p>
        <ul>
          <li>Recognize your device and browser</li>
          <li>Monitor website performance and analytics</li>
          <li>Personalize your browsing experience</li>
        </ul>
      </div>
      <div className="content-divide">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" style={{ width: "270px" }}>
                Type of Cookie
              </th>
              <th scope="col" style={{ width: "365px" }}>
                Purpose
              </th>
              <th scope="col">Examples</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td scope="row">Strictly Necessary</td>
              <td>
                <h6 className="d-block d-md-none">Purpose</h6>Enable basic site functionality
              </td>
              <td>
                <h6 className="d-block d-md-none">Examples</h6>Session management, security
              </td>
            </tr>
            <tr>
              <td scope="row">Performance / Analytics</td>
              <td>
                <h6 className="d-block d-md-none">Purpose</h6>Improve features, track interactions
              </td>
              <td>
                <h6 className="d-block d-md-none">Examples</h6>Google Analytics
              </td>
            </tr>
            <tr>
              <td scope="row">Functional</td>
              <td>
                <h6 className="d-block d-md-none">Purpose</h6>Remember preferences
              </td>
              <td>
                <h6 className="d-block d-md-none">Examples</h6>Language, form inputs
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="content-divide">
        <h2>Cookie Controls</h2>
        <p>
          You can modify cookie settings through your browser or consent manager. Disabling cookies may affect
          functionality.
        </p>
      </div>
      <div className="content-divide">
        <h2>Data Protection Practices</h2>
        <p>We align data protection controls with recognized standards, including but not limited to:</p>
        <ul>
          <li>Secure hosting</li>
          <li>Encryption and access control</li>
          <li>Regular audits and monitoring</li>
        </ul>
      </div>
      <div className="content-divide">
        <h2>Analytics &amp; Third-Party Tracking</h2>
        <p>
          We may use tools like Google Analytics for anonymized traffic insights. These providers follow their own
          privacy policies.
        </p>
      </div>
    </StaticPage>
  );
}
