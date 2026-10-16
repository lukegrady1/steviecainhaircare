import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { site, siteUrl } from "@/lib/site";

/*
  Manrope everywhere: one geometric sans for headings, body, prices, and
  hours. The variable font covers weights 200–800 in a single file, so the
  display and body tokens in globals.css both point at it.
*/
const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const title = "Stevie Cain Hair Care | Haircuts & Styling in Oklahoma City, OK";
const description =
  "Personalized haircuts, styling, color, and facial waxing in OKC. Stevie Cain is a solo stylist inside Salons by JC on West Memorial Road. Book online in seconds.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Stevie Cain Hair Care" },
  description,
  /* Each page sets its own canonical; this covers the home page. */
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: site.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
  /*
    Google Search Console HTML-tag verification. Set the env var in Netlify
    and redeploy; with it unset no meta tag is rendered.
  */
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#55634a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /*
    data-scroll-behavior lets the Next router switch off the CSS smooth
    scrolling while it jumps to the top on navigation; without it the
    animated scroll races the new page's layout and lands partway down.
  */
  return (
    <html lang="en" className={sans.variable} data-scroll-behavior="smooth">
      <body className="min-h-dvh">
        <JsonLd />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
