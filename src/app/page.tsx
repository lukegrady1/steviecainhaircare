import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Reviews } from "@/components/Reviews";
import { Gallery } from "@/components/Gallery";
import { VisitUs } from "@/components/VisitUs";

export default function Home() {
  return (
    <>
      <Hero />
      <About compact />
      <Services compact />
      <Reviews />
      <Gallery limit={4} />
      <VisitUs compact />
    </>
  );
}
