import calendarMap from "./ghl-calendars.json";

/*
  Single source of truth for business info. Every value here came from the
  client brief and is used verbatim. Nothing on the site should hard-code a
  price, hour, or phone number: change it here and every section follows.
*/

export const site = {
  name: "Stevie Cain Hair Care",
  tagline: "Good Hair for All Y’all!",
  subline: "Personalized haircuts & styling in Oklahoma City",
  owner: "Stevie Cain",
  phone: "(512) 701-4520",
  phoneHref: "tel:+15127014520",
  address: {
    line1: "3000 West Memorial Road, Suite 112",
    inside: "Inside Salons by JC",
    city: "Oklahoma City",
    state: "OK",
    zip: "73120",
  },
  /*
    Public contact email for the Privacy Policy and Terms pages. Null until
    Stevie confirms which inbox she wants published; the pages then show the
    phone number only.
  */
  email: null as string | null,
  /*
    Google Business Profile. The Place ID was derived from the Maps embed Luke
    pasted on 2026-10-16 (hex pair 0x87b21d73cc644537:0x4b1f6ba12b0fcee9) and
    verified to open "Stevie Cain Hair Care" on Google Maps. Directions, the
    map embed, "Find us on Google", and the review link all use it, so they
    land on the verified profile rather than a bare address pin.
  */
  /* Public profiles, confirmed by Luke 2026-10-16; used in schema sameAs. */
  social: {
    facebook: "https://www.facebook.com/stevie.cain.524/",
    instagram: "https://www.instagram.com/decaf_stevie/",
  },
  google: {
    placeId: "ChIJN0VkzHMdsocR6c4PK6FrH0s",
    cid: "5413163617078988521",
    get profileUrl() {
      return `https://www.google.com/maps/place/?q=place_id:${this.placeId}`;
    },
    get reviewUrl() {
      return `https://search.google.com/local/writereview?placeid=${this.placeId}`;
    },
    embedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3243.8100529202393!2d-97.5685496!3d35.607751799999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87b21d73cc644537%3A0x4b1f6ba12b0fcee9!2sStevie%20Cain%20Hair%20Care!5e0!3m2!1sen!2sus!4v1792172057701!5m2!1sen!2sus",
  },
  get mapsHref() {
    return this.google.profileUrl;
  },
  get mapsEmbedSrc() {
    return this.google.embedSrc;
  },
  rating: { value: "5.0", count: 9 },
  /*
    Booking runs on Stevie's existing Vagaro account (decided 2026-10-22; the
    GoHighLevel Services booking page is no longer used). Vagaro requires the
    client to sign in to a Vagaro account, and its login cookies are blocked
    inside a cross-site iframe on Safari/iOS, so the site links out to Vagaro
    in a new tab rather than embedding it. Vagaro has no per-service deep
    links: the services page lists every service with its own Book Now.
  */
  vagaro: {
    profile: "https://www.vagaro.com/steviecainhaircare",
    bookNow: "https://www.vagaro.com/steviecainhaircare/book-now",
    services: "https://www.vagaro.com/steviecainhaircare/services",
  },
} as const;

/* Site navigation. Book lives in the header button, not the link row. */
export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Services", href: "/services/" },
  { label: "Gallery", href: "/gallery/" },
  { label: "Visit", href: "/visit/" },
] as const;

/* Footer-only pages. Carriers check both during A2P 10DLC registration. */
export const legalNav = [
  { label: "Privacy Policy", href: "/privacy/" },
  { label: "Terms & Conditions", href: "/terms/" },
] as const;

/*
  Every Book button opens Vagaro in a new tab. A service's Book button goes
  to Vagaro's services list, where that service has its own Book Now; the
  general buttons go straight to the booking page.
*/
export function bookHref(slug?: string): string {
  return slug ? site.vagaro.services : site.vagaro.bookNow;
}

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://steviecainhaircare.com";

export const about = {
  quote: "Good Hair for All Y’all!",
  /*
    Stevie's own "About me" copy, verbatim (including her em dashes). The
    home page teaser shows the first paragraph; the About page shows all of
    it. Edit only if Stevie sends a new version.
  */
  body: [
    "I’m a passionate cosmetologist specializing in haircutting, with 10 years of experience helping clients look and feel their best. I believe a great haircut should not only look beautiful but also fit your personal style, lifestyle, and everyday routine.",
    "My goal is to create a laid-back, friendly environment where you can feel comfortable being yourself. I take the time to listen to what you’re looking for, offer personalized recommendations, and create a haircut that makes you feel confident and refreshed.",
    "I’m dedicated to staying current with the latest trends, techniques, and industry education so I can continue growing as a stylist and bring fresh ideas to every appointment. Continued education is important to me because I believe there’s always something new to learn and ways to elevate my craft.",
    "When I’m not behind the chair, you’ll usually find me enjoying the outdoors and appreciating the beauty of nature. I’m also a proud dog parent and love spending time with my four-legged babies. I believe those simple things—nature, dogs, and good company—are a big part of what keeps me inspired and grounded.",
    "Whether you’re looking for a fresh new style, a classic cut, or simply want to maintain the look you love, I’m here to make your experience easy, enjoyable, and tailored specifically to you.",
    "I truly love what I do and feel incredibly lucky to have spent the past 10 years doing what I’m passionate about—helping people feel great about their hair.",
    "Ready for a fresh cut and some good vibes? Book your appointment and come hang out in my chair—I’d love to meet you!",
  ],
  values: [
    {
      title: "Listens first",
      text: "Every appointment starts with a real conversation about what you want and how you live with your hair.",
    },
    {
      title: "Cuts for every hair type & length",
      text: "Long layers, chin-length bobs, bald fades, beards, and everything in between.",
    },
    {
      title: "Relaxed, welcoming chair",
      text: "A private suite inside Salons by JC. Everyone is welcome here.",
    },
  ],
} as const;

/* Sunday first. Hours match the Google Business Profile (checked 2026-10-16). `open`/`close` are 24h for schema + GHL. */
export const hours = [
  { day: "Sunday", short: "Sun", open: "11:00", close: "16:00", label: "11:00 AM – 4:00 PM" },
  { day: "Monday", short: "Mon", open: null, close: null, label: "Closed" },
  { day: "Tuesday", short: "Tue", open: null, close: null, label: "Closed" },
  { day: "Wednesday", short: "Wed", open: "10:00", close: "18:00", label: "10:00 AM – 6:00 PM" },
  { day: "Thursday", short: "Thu", open: "10:00", close: "18:00", label: "10:00 AM – 6:00 PM" },
  { day: "Friday", short: "Fri", open: "10:00", close: "16:00", label: "10:00 AM – 4:00 PM" },
  { day: "Saturday", short: "Sat", open: "10:00", close: "16:00", label: "10:00 AM – 4:00 PM" },
] as const;

export const hoursSummary = "Wed–Thu 10–6 · Fri–Sat 10–4 · Sun 11–4 · Closed Mon & Tue";

export const visit = {
  walkIns: "Walk-ins welcome. Appointments recommended.",
  parking: "Free parking",
  payment: ["Visa", "MasterCard", "Discover", "American Express", "Debit", "Cash"],
  amenities: [
    "WiFi",
    "Beer & wine",
    "Wheelchair accessible",
    "LGBTQIA+ friendly",
    "Kid friendly",
  ],
  language: "English",
} as const;

/* ------------------------------------------------------------------------
   SERVICES
   ------------------------------------------------------------------------
   Names, prices, and descriptions are verbatim from the brief, with Stevie's
   2026-10-05 revisions to waxing, beard trim, and color. `minutes` drive both
   the GHL calendar setup and the "45 min" chip on each card.
   `from: true` renders "from $45" rather than "$45"; `per: "hour"` renders
   "$75/hr".
   ------------------------------------------------------------------------ */

export type Service = {
  slug: string;
  name: string;
  price: number;
  from?: boolean;
  /* Hourly services: the price is a rate, not a flat fee. */
  per?: "hour";
  minutes: number;
  description?: string;
};

export type ServiceGroup = {
  id: "hair" | "color" | "waxing";
  title: string;
  blurb: string;
  services: Service[];
};

export const serviceGroups: ServiceGroup[] = [
  /* Order within each group and the group order follow Stevie's own menu. */
  {
    id: "hair",
    title: "Hair Services",
    blurb: "Cuts, fades, and styling tailored to you.",
    services: [
      { slug: "short-haircut", name: "Short Haircut", price: 45, from: true, minutes: 45, description: "Tailored cut for chin-length and shorter styles; includes wash and styling." },
      { slug: "long-haircut", name: "Long Haircut", price: 60, minutes: 60, description: "Tailored cut for chin-length or longer hair; includes wash and dry." },
      { slug: "beard-trim", name: "Beard Trim", price: 20, minutes: 30, description: "Tailored beard grooming with precision lining." },
      { slug: "bang-trim", name: "Bang Trim", price: 15, from: true, minutes: 15 },
      { slug: "bald-fade", name: "Bald Fade", price: 55, from: true, minutes: 45, description: "Smooth transition from longer on top to skin at the sides/back." },
      { slug: "blow-out", name: "Blow Out / Diffuse", price: 40, from: true, minutes: 45 },
      { slug: "neck-clean-up", name: "Neck Clean Up", price: 15, minutes: 10 },
      { slug: "hot-tool-styling", name: "Hot Tool Styling", price: 40, minutes: 45, description: "Flat iron / curling iron finish." },
      { slug: "kids-haircut", name: "Kid’s Haircut (10 & under)", price: 30, minutes: 30 },
      { slug: "designs", name: "Designs", price: 15, minutes: 15, description: "Clipper/trimmer designs on short cuts." },
      { slug: "up-dos", name: "Special Occasions / Up-Dos", price: 60, from: true, minutes: 75 },
      { slug: "buzz-cut", name: "Buzz Cut", price: 25, minutes: 20, description: "Short, uniform clipper cut; clean and low-maintenance." },
      { slug: "gray-blending", name: "Camouflage Gray Blending", price: 35, minutes: 30, description: "For short hair." },
    ],
  },
  {
    id: "waxing",
    title: "Facial Waxing",
    blurb: "Quick, tidy, and easy to add on to any cut.",
    services: [
      { slug: "wax-eyebrow", name: "Eyebrows", price: 12, minutes: 15 },
      { slug: "wax-nose", name: "Nose", price: 12, minutes: 15 },
      { slug: "wax-ears", name: "Ears", price: 12, minutes: 15 },
      { slug: "wax-double", name: "Double", price: 20, minutes: 20, description: "Any two areas." },
      { slug: "wax-triple", name: "Triple", price: 30, minutes: 30, description: "Brows + nose + ears." },
    ],
  },
  {
    id: "color",
    title: "Color",
    blurb: "Every color service starts with a free, required consultation.",
    services: [
      { slug: "color-consultation", name: "Color Consultation", price: 0, minutes: 15, description: "Required before any color appointment. We’ll plan the look and the time it needs." },
      { slug: "color-application", name: "Hair Color Application", price: 75, per: "hour", minutes: 120, description: "Root touch-ups, balayage, and more. Billed by the hour; your consultation sets the time." },
    ],
  },
];

export const allServices: Service[] = serviceGroups.flatMap((g) => g.services);

export function findService(slug: string | null | undefined): Service | undefined {
  if (!slug) return undefined;
  return allServices.find((s) => s.slug === slug);
}

export function groupOf(service: Service): ServiceGroup {
  return serviceGroups.find((g) => g.services.includes(service))!;
}

export function formatPrice(s: Service): string {
  if (s.price === 0) return "Free";
  return `${s.from ? "from " : ""}$${s.price}${s.per === "hour" ? "/hr" : ""}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

/*
  GoHighLevel service ID per site service slug (Services module), written by
  scripts/ghl-services.mjs. The booking embed does not need these; they are
  kept for scripts and for checking that the menu matches site.ts.
*/
export function ghlServiceIdFor(slug: string): string {
  const map = (calendarMap as { services?: Record<string, string> }).services ?? {};
  return map[slug] ?? "";
}

export const defaultServiceSlug = "short-haircut";

/* ------------------------------------------------------------------------
   REVIEWS
   ------------------------------------------------------------------------
   Real, published reviews quoted verbatim from the brief. Do not invent
   entries, tidy the wording, or attach a star rating the reviewer did not
   give (FTC endorsement rules, 16 CFR 255). The 5.0 / 9 summary is the
   client's verified aggregate, not derived from the four shown here.
   ------------------------------------------------------------------------ */

export const reviews = [
  {
    quote:
      "Stevie cut my hair and she did such a wonderful job! She listens and guides you to make sure you're happy with the final result!",
    name: "Jay P.",
  },
  {
    quote: "Stevie is the best! Fantastic stylist who really listens and is great with beards!",
    name: "Keith V.",
  },
  {
    quote: "Stevie always provides an amazing haircut with comfort and care.",
    name: "Daniel H.",
  },
  { quote: "Stevie cut my hair. It was great. 10/10", name: "Matthew W." },
] as const;

/*
  Named photo slots. Files live in public/images/. Null renders a designed
  placeholder tile.
*/
export const photos: {
  studio: { src: string; alt: string } | null;
  portrait: { src: string; alt: string } | null;
  suite: { src: string; alt: string }[];
} = {
  /* Hero: the client chair in Stevie's suite. */
  studio: { src: "/images/studio/chair.webp", alt: "The client chair in Stevie’s suite at Salons by JC" },
  /* About page slot: Stevie's headshot (sent 2026-10-05), cropped 4:5. */
  portrait: { src: "/images/stevie.webp", alt: "Stevie Cain smiling in front of a brick wall" },
  /* Visit page strip. */
  suite: [
    { src: "/images/studio/barber-chair.webp", alt: "Vintage barber chair and shampoo bowl" },
    { src: "/images/studio/products.webp", alt: "Product shelf with Verb and American Crew" },
    { src: "/images/studio/mirror.webp", alt: "Lit mirror and styling station" },
  ],
};

/*
  Gallery. Real client photos from Stevie's Drive folder (Old Photos), sized
  to 1200px in public/images/gallery. Alt text describes the cut, never the
  client. The home page slides through all of them; the gallery page grids them.
*/
export const gallery: { src: string | null; alt: string }[] = [
  { src: "/images/gallery/01-balayage-curls.webp", alt: "Brunette balayage with soft curls" },
  { src: "/images/gallery/02-skin-fade.webp", alt: "Skin fade with a textured top" },
  { src: "/images/gallery/03-color-bob.webp", alt: "Copper bob with pink money piece" },
  { src: "/images/gallery/04-clipper-design.webp", alt: "Clipper design on a short cut" },
  { src: "/images/gallery/05-long-blonde-balayage.webp", alt: "Long blonde balayage with layers" },
  { src: "/images/gallery/06-platinum-undercut.webp", alt: "Platinum blonde undercut" },
  { src: "/images/gallery/07-beard-fade.webp", alt: "Beard trim with a tapered fade" },
  { src: "/images/gallery/08-silver-curls.webp", alt: "Silver blonde curls" },
  { src: "/images/gallery/09-braided-half-up.webp", alt: "Braided half-up special occasion style" },
  { src: "/images/gallery/10-updo.webp", alt: "Twisted up-do" },
  { src: "/images/gallery/11-shag-bob.webp", alt: "Dark shag bob with bangs" },
  { src: "/images/gallery/12-layered-blowout.webp", alt: "Layered blowout with volume" },
  { src: "/images/gallery/13-mid-skin-fade.webp", alt: "Mid skin fade with a textured crop" },
  { src: "/images/gallery/14-mullet-fade.webp", alt: "Long mullet with a skin fade" },
  { src: "/images/gallery/15-curly-mullet.webp", alt: "Curly mullet with a soft taper" },
  { src: "/images/gallery/16-beard-shape-up.webp", alt: "Beard shape-up with a tight taper" },
  { src: "/images/gallery/17-undercut-nape-design.webp", alt: "Undercut with a V-shaped nape design" },
  { src: "/images/gallery/18-blonde-textured-crop.webp", alt: "Blonde textured crop" },
  { src: "/images/gallery/19-highlighted-bob.webp", alt: "Highlighted chin-length bob" },
  { src: "/images/gallery/20-curtain-bangs-shag.webp", alt: "Shag with curtain bangs" },
  { src: "/images/gallery/21-natural-curls.webp", alt: "Layered cut on natural curls" },
  { src: "/images/gallery/22-blonde-layered-lob.webp", alt: "Blonde layered lob" },
  { src: "/images/gallery/23-classic-taper.webp", alt: "Classic taper with a side part" },
  { src: "/images/gallery/24-teen-taper.webp", alt: "Short taper with a textured top" },
];
