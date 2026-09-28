import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { VisitUs } from "@/components/VisitUs";

export const metadata: Metadata = {
  title: "Visit Us",
  description:
    "Stevie Cain Haircare is inside Salons by JC, Suite 112, at 3000 West Memorial Road, Oklahoma City, OK 73120. Hours, parking, payment, and directions.",
};

export default function VisitPage() {
  return (
    <>
      <PageHeader
        eyebrow="Visit Us"
        title="Inside Salons by JC, Suite 112."
        intro="Free parking, walk-ins welcome, and a private suite that’s easy to find."
      />
      <VisitUs />
      <CtaBand />
    </>
  );
}
