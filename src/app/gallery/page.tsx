import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { Gallery } from "@/components/Gallery";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Recent haircuts, fades, color, and styling from Stevie Cain Haircare in Oklahoma City.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader eyebrow="Gallery" title="Recent work from the chair." />
      <Gallery />
      <CtaBand />
    </>
  );
}
