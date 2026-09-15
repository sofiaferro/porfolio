import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/content";
import { LOCALES, type Locale } from "@/lib/content/schema";
import { absoluteUrl } from "@/lib/markdown";

type SitemapEntry = MetadataRoute.Sitemap[number];

function localePath(locale: Locale, ...segments: string[]): string {
  return absoluteUrl(["", locale, ...segments].join("/"));
}

/** One sitemap entry per locale URL, each carrying es/en/x-default alternates. */
function entriesFor(
  segments: string[],
  lastModified?: string,
): SitemapEntry[] {
  const languages = {
    es: localePath("es", ...segments),
    en: localePath("en", ...segments),
    "x-default": localePath("es", ...segments),
  };
  return LOCALES.map((locale) => ({
    url: localePath(locale, ...segments),
    ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entriesFor([]),
    ...entriesFor(["about"]),
    ...entriesFor(["projects"]),
    ...getProjects("es").flatMap((p) =>
      entriesFor(["projects", p.meta.slug], p.meta.date),
    ),
    ...entriesFor(["blog"]),
    ...getPosts("es").flatMap((p) =>
      entriesFor(["blog", p.meta.slug], p.meta.date),
    ),
  ];
}
