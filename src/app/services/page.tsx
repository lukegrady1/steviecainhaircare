import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { Services } from "@/components/Services";

export const metadata: Metadata = {
  title: "Haircut & Hair Service Prices in Oklahoma City",
  alternates: { canonical: "/services/" },
  description:
    "Haircut, fade, beard, styling, color, and facial waxing prices at Stevie Cain Hair Care in Oklahoma City. Short haircuts from $45, long haircuts $60, color $75 per hour after a free consultation.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services & Pricing"
        title="Cuts, color, and a clean finish."
        intro="Tap Book on any service to open the booking menu and pick a time. Prices marked “from” depend on length and detail."
      />
      <Services />
      <CtaBand />
    </>
  );
}
