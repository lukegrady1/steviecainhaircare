import type { Metadata } from "next";
import { About } from "@/components/About";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { Reviews } from "@/components/Reviews";

export const metadata: Metadata = {
  title: "About Stevie",
  description:
    "Meet Stevie Cain, a cosmetologist with 10 years of experience specializing in haircutting, inside Salons by JC in Oklahoma City. Personalized cuts in a laid-back, friendly chair.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Stevie"
        title="Good Hair for All Y’all!"
        intro="Ten years behind the chair, a laid-back suite inside Salons by JC, and a haircut built around you."
      />
      <About />
      <Reviews />
      <CtaBand />
    </>
  );
}
