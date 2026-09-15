import { Feed } from "feed";
import { getProjects, getSite } from "@/lib/content";
import { absoluteUrl } from "@/lib/markdown";

export const dynamic = "force-static";

export function GET(): Response {
  const site = getSite();
  const projects = getProjects("es");

  const newest = projects
    .map((e) => new Date(e.meta.date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const feed = new Feed({
    title: site.name,
    description: site.tagline.es ?? "",
    id: absoluteUrl("/"),
    link: absoluteUrl("/es"),
    language: "es",
    copyright: `© ${new Date().getFullYear()} ${site.name}`,
    updated: newest,
    feedLinks: { rss: absoluteUrl("/feed.xml") },
    author: { name: site.name, email: site.email, link: absoluteUrl("/") },
  });

  for (const project of projects) {
    const link = absoluteUrl(`/es/projects/${project.meta.slug}`);
    feed.addItem({
      title: project.doc.title,
      id: link,
      link,
      description: `${project.doc.summary}\n\nEnglish version: ${absoluteUrl(`/en/projects/${project.meta.slug}`)}`,
      date: new Date(project.meta.date),
    });
  }

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
