import type { Metadata } from "next";
import type { Locale } from "@/lib/content/schema";
import { getSite } from "@/lib/content";

/**
 * Canonical + hreflang + markdown-alternate metadata for a localized route.
 * `path` is the locale-less route path ("", "/projects/pit0nisa", ...).
 */
export function pageMetadata(
  locale: Locale,
  path: string,
  meta: { title?: string; description: string; image?: string },
): Metadata {
  const site = getSite();
  const canonical = `${site.domain}/${locale}${path}`;
  return {
    ...(meta.title ? { title: meta.title } : {}),
    description: meta.description,
    alternates: {
      canonical,
      languages: {
        es: `${site.domain}/es${path}`,
        en: `${site.domain}/en${path}`,
        "x-default": `${site.domain}/es${path}`,
      },
      types: {
        "text/markdown": `${canonical}.md`,
      },
    },
    openGraph: {
      title: meta.title ?? site.name,
      description: meta.description,
      url: canonical,
      siteName: site.name,
      locale,
      type: "website",
      ...(meta.image ? { images: [{ url: meta.image }] } : {}),
    },
    twitter: {
      card: meta.image ? "summary_large_image" : "summary",
      title: meta.title ?? site.name,
      description: meta.description,
    },
  };
}
