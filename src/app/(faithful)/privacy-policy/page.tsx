import type { JSX } from "react";
import type { Metadata } from "next";
import PolicyPageView, { policyMetadata } from "@/components/home/PolicyPageView";

export function generateMetadata(): Promise<Metadata> {
  return policyMetadata("privacy-policy");
}

export default function PrivacyPolicyPage(): JSX.Element {
  return <PolicyPageView slug="privacy-policy" />;
}
