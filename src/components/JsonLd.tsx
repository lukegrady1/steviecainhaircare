import { allServices, hours, site, siteUrl, visit } from "@/lib/site";

/*
  LocalBusiness > HairSalon structured data. Everything here mirrors lib/site.ts
  so the markup can never disagree with what is on the page.

  No aggregateRating or review here on purpose. Google's review-snippet
  guidelines exclude "self-serving" ratings (a business marking up reviews of
  itself on its own site), and the on-page 5.0 / 9 figure is not sourced
  from the Google Business Profile. The testimonials stay visible on the page;
  they just are not declared as schema.
*/
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": `${siteUrl}/#salon`,
    name: site.name,
    slogan: site.tagline,
    url: siteUrl,
    telephone: "+1-512-701-4520",
    /* /opengraph-image is the 1200x630 card Next renders at build time. */
    image: `${siteUrl}/opengraph-image`,
    logo: `${siteUrl}/images/logo.webp`,
    priceRange: "$12 - $75",
    currenciesAccepted: "USD",
    paymentAccepted: visit.payment.join(", "),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "US",
    },
    geo: { "@type": "GeoCoordinates", latitude: 35.6077518, longitude: -97.5685496 },
    hasMap: site.google.profileUrl,
    sameAs: [site.google.profileUrl, site.social.facebook, site.social.instagram],
    containedInPlace: { "@type": "Place", name: "Salons by JC" },
    founder: { "@type": "Person", name: site.owner, jobTitle: "Hair Stylist" },
    employee: { "@type": "Person", name: site.owner },
    openingHoursSpecification: hours
      .filter((h) => h.open)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.day,
        opens: h.open,
        closes: h.close,
      })),
    amenityFeature: visit.amenities.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    isAccessibleForFree: false,
    knowsLanguage: "en",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: allServices.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name },
        ...(s.per === "hour"
          ? {
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: s.price,
                priceCurrency: "USD",
                unitCode: "HUR",
                unitText: "per hour",
              },
            }
          : { price: s.price, priceCurrency: "USD" }),
      })),
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: site.vagaro.booking,
      name: "Book an appointment",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
