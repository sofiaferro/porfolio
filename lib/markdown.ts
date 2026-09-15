import {
  getPage,
  getPosts,
  getProjects,
  getSite,
  type Post,
  type Project,
} from "@/lib/content";
import { LOCALES, type Locale } from "@/lib/content/schema";

/** Absolute URL on the canonical domain. `path` may omit the leading slash. */
export function absoluteUrl(path: string): string {
  const domain = getSite().domain.replace(/\/+$/, "");
  if (path === "" || path === "/") return domain;
  return `${domain}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

const LABELS = {
  es: {
    home: "Inicio",
    projects: "Proyectos",
    blog: "Blog",
    about: "Sobre mí",
    canonical: "Canónica",
    alternate: "English version",
    live: "Sitio",
    github: "GitHub",
    video: "Video",
    markdown: "markdown",
  },
  en: {
    home: "Home",
    projects: "Projects",
    blog: "Blog",
    about: "About",
    canonical: "Canonical",
    alternate: "Versión en español",
    live: "Live",
    github: "GitHub",
    video: "Video",
    markdown: "markdown",
  },
} satisfies Record<Locale, Record<string, string>>;

function htmlUrl(locale: Locale, ...segments: string[]): string {
  return absoluteUrl(["", locale, ...segments].join("/"));
}

function mdUrl(locale: Locale, ...segments: string[]): string {
  return `${htmlUrl(locale, ...segments)}.md`;
}

/** `- [title](html) ([markdown](md)) — summary` */
function entryListItem(
  entry: Project | Post,
  section: "projects" | "blog",
  locale: Locale,
): string {
  const html = htmlUrl(locale, section, entry.meta.slug);
  const md = mdUrl(locale, section, entry.meta.slug);
  return `- [${entry.doc.title}](${html}) ([${LABELS[locale].markdown}](${md})) — ${entry.doc.summary}`;
}

function externalLinksLine(project: Project, locale: Locale): string {
  const t = LABELS[locale];
  const { live, github, video } = project.meta.links;
  const parts = [
    live && `[${t.live}](${live})`,
    github && `[${t.github}](${github})`,
    video && `[${t.video}](${video})`,
  ].filter((p): p is string => Boolean(p));
  return parts.join(" · ");
}

function imageMarkdown(
  images: { src: string; alt?: { es?: string; en?: string } }[],
  fallbackAlt: string,
  locale: Locale,
): string {
  return images
    .map((img) => {
      const alt = img.alt?.[locale] ?? img.alt?.[otherLocale(locale)] ?? fallbackAlt;
      return `![${alt}](${absoluteUrl(img.src)})`;
    })
    .join("\n\n");
}

function joinBlocks(blocks: (string | undefined | false)[]): string {
  return `${blocks.filter(Boolean).join("\n\n").trim()}\n`;
}

// ---------------------------------------------------------------------------
// Page renderers
// ---------------------------------------------------------------------------

export function renderHome(locale: Locale): string {
  const site = getSite();
  const t = LABELS[locale];
  const about = getPage("about", locale);
  return joinBlocks([
    `# ${site.name}`,
    `> ${site.tagline[locale]}`,
    about.rawMarkdown,
    `## ${t.projects}`,
    getProjects(locale)
      .map((p) => entryListItem(p, "projects", locale))
      .join("\n"),
    `## ${t.blog}`,
    getPosts(locale)
      .map((p) => entryListItem(p, "blog", locale))
      .join("\n"),
  ]);
}

export function renderProjectsIndex(locale: Locale): string {
  const t = LABELS[locale];
  const sections = getProjects(locale).map((p) => {
    const links = [
      `[HTML](${htmlUrl(locale, "projects", p.meta.slug)})`,
      `[${t.markdown}](${mdUrl(locale, "projects", p.meta.slug)})`,
      externalLinksLine(p, locale),
    ]
      .filter(Boolean)
      .join(" · ");
    return joinBlocks([
      `## ${p.doc.title}`,
      `${p.meta.date} · ${p.meta.category}`,
      p.doc.summary,
      links,
    ]).trim();
  });
  return joinBlocks([`# ${t.projects}`, ...sections]);
}

export function renderProject(project: Project, locale: Locale): string {
  const t = LABELS[locale];
  const alt = otherLocale(locale);
  return joinBlocks([
    `# ${project.doc.title}`,
    [project.meta.date, project.meta.category, project.meta.tech.join(", ")]
      .filter(Boolean)
      .join(" · "),
    `${t.canonical}: ${htmlUrl(locale, "projects", project.meta.slug)} · [${t.alternate}](${mdUrl(alt, "projects", project.meta.slug)})`,
    externalLinksLine(project, locale),
    project.rawMarkdown,
    imageMarkdown(project.meta.images, project.doc.title, locale),
  ]);
}

export function renderBlogIndex(locale: Locale): string {
  const t = LABELS[locale];
  const sections = getPosts(locale).map((p) => {
    const links = [
      `[HTML](${htmlUrl(locale, "blog", p.meta.slug)})`,
      `[${t.markdown}](${mdUrl(locale, "blog", p.meta.slug)})`,
    ].join(" · ");
    return joinBlocks([
      `## ${p.doc.title}`,
      p.meta.date,
      p.doc.summary,
      links,
    ]).trim();
  });
  return joinBlocks([`# ${t.blog}`, ...sections]);
}

export function renderPost(post: Post, locale: Locale): string {
  const t = LABELS[locale];
  const alt = otherLocale(locale);
  return joinBlocks([
    `# ${post.doc.title}`,
    post.meta.date,
    `${t.canonical}: ${htmlUrl(locale, "blog", post.meta.slug)} · [${t.alternate}](${mdUrl(alt, "blog", post.meta.slug)})`,
    post.rawMarkdown,
    post.meta.image &&
      imageMarkdown([{ src: post.meta.image }], post.doc.title, locale),
  ]);
}

export function renderAbout(locale: Locale): string {
  const page = getPage("about", locale);
  return joinBlocks([`# ${page.doc.title}`, page.rawMarkdown]);
}

// ---------------------------------------------------------------------------
// Sitemap + 404
// ---------------------------------------------------------------------------

function sitemapItem(depth: number, label: string, html: string, md: string): string {
  return `${"  ".repeat(depth)}- [${label}](${html}) ([md](${md}))`;
}

export function renderMarkdownSitemap(): string {
  const localeSections = LOCALES.map((locale) => {
    const t = LABELS[locale];
    const lines = [
      sitemapItem(0, t.home, htmlUrl(locale), mdUrl(locale)),
      sitemapItem(1, t.about, htmlUrl(locale, "about"), mdUrl(locale, "about")),
      sitemapItem(1, t.projects, htmlUrl(locale, "projects"), mdUrl(locale, "projects")),
      ...getProjects(locale).map((p) =>
        sitemapItem(
          2,
          p.doc.title,
          htmlUrl(locale, "projects", p.meta.slug),
          mdUrl(locale, "projects", p.meta.slug),
        ),
      ),
      sitemapItem(1, t.blog, htmlUrl(locale, "blog"), mdUrl(locale, "blog")),
      ...getPosts(locale).map((p) =>
        sitemapItem(
          2,
          p.doc.title,
          htmlUrl(locale, "blog", p.meta.slug),
          mdUrl(locale, "blog", p.meta.slug),
        ),
      ),
    ];
    return joinBlocks([
      `## ${locale === "es" ? "Español" : "English"} (${locale})`,
      lines.join("\n"),
    ]).trim();
  });
  return joinBlocks([`# Sitemap — ${getSite().name}`, ...localeSections]);
}

export function renderNotFound(): string {
  const paths = [
    "/{es|en}.md — home",
    "/{es|en}/about.md",
    "/{es|en}/projects.md",
    "/{es|en}/projects/{slug}.md",
    "/{es|en}/blog.md",
    "/{es|en}/blog/{slug}.md",
    "/sitemap.md — full list of pages",
  ];
  return joinBlocks([
    "# 404 — not found",
    "Valid markdown paths on this site (also served for any HTML URL requested with `Accept: text/markdown`):",
    paths.map((p) => `- \`${p}\``).join("\n"),
  ]);
}
