import { getPage, getProjects, getSite } from "@/lib/content";
import { absoluteUrl } from "@/lib/markdown";

export const dynamic = "force-static";

export function GET(): Response {
  const site = getSite();
  const about = getPage("about", "en");
  // The about summary can mirror the tagline verbatim — avoid repeating it.
  const intro = [site.tagline.en, about.doc.summary]
    .filter((part, i, arr): part is string => Boolean(part) && arr.indexOf(part) === i)
    .join(" ");
  const github = site.sameAs.find((u) => u.includes("github.com"));
  const linkedin = site.sameAs.find((u) => u.includes("linkedin.com"));
  const x = site.sameAs.find((u) => u.includes("x.com"));

  const projects = getProjects("es").map(
    (p) =>
      `- [${p.doc.title}](${absoluteUrl(`/es/projects/${p.meta.slug}.md`)}): ${p.doc.summary}`,
  );
  const manifiesto = getPage("manifiesto", "en");

  const body = [
    `# ${site.name}`,
    "",
    `> ${intro}`,
    "",
    `Every page on this site is also served as plain markdown: request any URL with \`Accept: text/markdown\` or append \`.md\` to its path (e.g. ${absoluteUrl("/es/projects.md")}). Content is available in Spanish (\`/es/…\`, canonical) and English (\`/en/…\`).`,
    "",
    "## Projects",
    "",
    ...projects,
    "",
    "## Manifesto",
    "",
    `- [${manifiesto.doc.title}](${absoluteUrl("/en/manifiesto.md")}): ${manifiesto.doc.summary}`,
    "",
    "## Meta",
    "",
    `- [resume.json](${absoluteUrl("/api/resume.json")}): résumé in JSON Resume v1.0.0 format`,
    `- [resume.txt](${absoluteUrl("/api/resume.txt")}): plain-text résumé (also what \`curl ${site.domain.replace(/^https?:\/\//, "")}\` returns)`,
    `- MCP server (streamable HTTP, no auth): ${absoluteUrl("/api/mcp")}`,
    `- [markdown sitemap](${absoluteUrl("/sitemap.md")}): every page with its canonical and .md URL`,
    "",
    "## Optional",
    "",
    `- [RSS feed](${absoluteUrl("/feed.xml")})`,
    ...(github ? [`- [GitHub](${github})`] : []),
    ...(linkedin ? [`- [LinkedIn](${linkedin})`] : []),
    ...(x ? [`- [X](${x})`] : []),
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
