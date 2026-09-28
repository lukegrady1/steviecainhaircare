import type { MetadataRoute } from "next";
import { nav, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...nav.map((n) => n.href), "/book/"];
  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path === "/book/" ? 0.9 : 0.7,
  }));
}
