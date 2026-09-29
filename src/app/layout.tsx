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

const title = "Stevie Cain Haircare | Haircuts & Styling in Oklahoma City, OK";
const description =
  "Personalized haircuts, styling, color, and facial waxing in OKC. Stevie Cain is a solo stylist inside Salons by JC on West Memorial Road. Book online in seconds.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Stevie Cain Haircare" },
  description,
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
};

export const viewport: Viewport = {
  themeColor: "#55634a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="min-h-dvh">
        <JsonLd />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
