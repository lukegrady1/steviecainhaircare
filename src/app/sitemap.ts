import type { MetadataRoute } from "next";
import { legalNav, nav, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...nav.map((n) => n.href), "/book/", ...legalNav.map((n) => n.href)];
  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path.startsWith("/privacy") || path.startsWith("/terms") ? "yearly" : "monthly",
    priority: path === "/" ? 1 : path === "/book/" ? 0.9 : path.startsWith("/privacy") || path.startsWith("/terms") ? 0.3 : 0.7,
  }));
}
