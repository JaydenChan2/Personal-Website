import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/work", "/experience", "/about", "/activity", "/contact", ...projects.map((p) => `/work/${p.slug}`)];
  return pages.map((path) => ({ url: `${site.url}${path}`, changeFrequency: "monthly", priority: path ? 0.8 : 1 }));
}
