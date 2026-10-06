import { allServices, hours, reviews, site, siteUrl, visit } from "@/lib/site";

/*
  LocalBusiness > HairSalon structured data. Everything here mirrors lib/site.ts
  so the markup can never disagree with what is on the page.
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
    image: `${siteUrl}/og-image.png`,
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
      bestRating: "5",
    },
    review: reviews.map((r) => ({
      "@type": "Review",
      reviewBody: r.quote,
      author: { "@type": "Person", name: r.name },
    })),
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
      target: `${siteUrl}/book/`,
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
