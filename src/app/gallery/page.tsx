import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { Gallery } from "@/components/Gallery";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Haircut Gallery, Oklahoma City",
  alternates: { canonical: "/gallery/" },
  description:
    "Recent haircuts, fades, color, and styling from Stevie Cain Hair Care in Oklahoma City.",
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
