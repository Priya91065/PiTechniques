import type { JSX } from "react";
import type { Metadata } from "next";
import PolicyPageView, { policyMetadata } from "@/components/home/PolicyPageView";

export function generateMetadata(): Promise<Metadata> {
  return policyMetadata("data-protection");
}

export default function DataProtectionPage(): JSX.Element {
  return <PolicyPageView slug="data-protection" />;
}
