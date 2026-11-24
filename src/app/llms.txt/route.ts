import {
  about,
  formatDuration,
  formatPrice,
  hours,
  serviceGroups,
  site,
  siteUrl,
  visit,
} from "@/lib/site";

/*
  /llms.txt (llmstxt.org): a plain-markdown summary of the salon for AI
  assistants and AI search. Built from lib/site.ts, like the pages and the
  schema, so the prices and hours can't disagree with them.
*/
export const dynamic = "force-static";

const url = (path: string) => `${siteUrl}${path}`;

export function GET() {
  const { address } = site;
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.owner} is a solo stylist with 10 years of experience, cutting and styling hair in a private suite inside Salons by JC in Oklahoma City, OK. Haircuts for every hair type and length, fades, beard trims, color and facial waxing. "${site.tagline}"`,
    "",
    about.body[0],
    "",
    "## Business details",
    "",
    `- Name: ${site.name}`,
    `- Address: ${address.line1}, ${address.city}, ${address.state} ${address.zip} (${address.inside})`,
    `- Phone: ${site.phone}`,
    `- Book online: ${site.vagaro.booking}`,
    `- Google Business Profile: ${site.google.profileUrl}`,
    `- Walk-ins: ${visit.walkIns}`,
    `- Parking: ${visit.parking}`,
    `- Payment: ${visit.payment.join(", ")}`,
    `- Amenities: ${visit.amenities.join(", ")}`,
    "",
    "## Hours",
    "",
    ...hours.map((h) => `- ${h.day}: ${h.label}`),
    "",
    ...serviceGroups.flatMap((g) => [
      `## ${g.title}`,
      "",
      g.blurb,
      "",
      ...g.services.map(
        (s) =>
          `- ${s.name}: ${formatPrice(s)}, ${formatDuration(s.minutes)}${s.description ? `. ${s.description}` : ""}`,
      ),
      "",
    ]),
    "## Pages",
    "",
    `- [Home](${url("/")})`,
    `- [About Stevie](${url("/about/")})`,
    `- [Services and prices](${url("/services/")})`,
    `- [Gallery](${url("/gallery/")})`,
    `- [Visit: location, hours and parking](${url("/visit/")})`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
