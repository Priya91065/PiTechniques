import type { JSX } from "react";
import type { Metadata } from "next";
import PolicyPageView, { policyMetadata } from "@/components/home/PolicyPageView";

export function generateMetadata(): Promise<Metadata> {
  return policyMetadata("terms-of-use");
}

export default function TermsOfUsePage(): JSX.Element {
  return <PolicyPageView slug="terms-of-use" />;
}
