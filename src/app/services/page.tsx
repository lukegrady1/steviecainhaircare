import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { Services } from "@/components/Services";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "Haircut, fade, beard, styling, color, and facial waxing prices at Stevie Cain Haircare in Oklahoma City. Short haircuts from $45, long haircuts $60, color $75.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services & Pricing"
        title="Cuts, color, and a clean finish."
        intro="Tap Book on any service and the calendar opens with it selected. Prices marked “from” depend on length and detail."
      />
      <Services />
      <CtaBand />
    </>
  );
}
