import type { Locale } from "@/lib/content/schema";
import { getResume, getSite, type Post, type Project } from "@/lib/content";

type JsonLd = Record<string, unknown>;

export function personJsonLd(): JsonLd {
  const site = getSite();
  const resume = getResume() as {
    basics?: { label?: string };
    skills?: { name: string; keywords?: string[] }[];
  };
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": site.personId,
    name: site.name,
    url: site.domain,
    email: `mailto:${site.email}`,
    jobTitle: resume.basics?.label,
    sameAs: site.sameAs,
    knowsAbout: (resume.skills ?? []).flatMap((s) => [
      s.name,
      ...(s.keywords ?? []),
    ]),
  };
}

export function projectJsonLd(project: Project, locale: Locale): JsonLd {
  const site = getSite();
  const url = `${site.domain}/${locale}/projects/${project.meta.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": project.meta.links.github ? "SoftwareSourceCode" : "CreativeWork",
    "@id": `${url}#work`,
    name: project.doc.title,
    description: project.doc.summary,
    url,
    dateCreated: project.meta.date,
    inLanguage: locale,
    keywords: [project.meta.category, ...project.meta.tech].join(", "),
    ...(project.meta.links.github
      ? { codeRepository: project.meta.links.github }
      : {}),
    ...(project.meta.images[0]
      ? { image: `${site.domain}${project.meta.images[0].src}` }
      : {}),
    author: { "@id": site.personId },
  };
}

export function postJsonLd(post: Post, locale: Locale): JsonLd {
  const site = getSite();
  const url = `${site.domain}/${locale}/blog/${post.meta.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    headline: post.doc.title,
    description: post.doc.summary,
    url,
    datePublished: post.meta.date,
    inLanguage: locale,
    ...(post.meta.image ? { image: `${site.domain}${post.meta.image}` } : {}),
    author: { "@id": site.personId },
  };
}

export function JsonLdScript({ data }: { data: JsonLd | JsonLd[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
