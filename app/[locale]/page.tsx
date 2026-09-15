import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getPage, getPosts, getProjects, getSite } from "@/lib/content";
import type { Locale } from "@/lib/content/schema";
import { Mdx } from "@/components/mdx";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const site = getSite();
  return pageMetadata(locale, "", {
    description: site.tagline[locale] ?? site.tagline.es ?? "",
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("categories");

  const site = getSite();
  const about = getPage("about", locale as Locale);
  const projects = getProjects(locale as Locale);
  const posts = getPosts(locale as Locale);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight">{site.name}</h1>
      <p className="mt-2 text-sm uppercase tracking-widest opacity-70">
        {site.tagline[locale as Locale]}
      </p>

      <section aria-labelledby="about-heading" className="mt-10">
        <h2 id="about-heading" className="sr-only">
          {about.doc.title}
        </h2>
        <Mdx source={about.rawMarkdown} />
      </section>

      <section aria-labelledby="projects-heading" className="mt-12">
        <h2
          id="projects-heading"
          className="text-sm font-bold uppercase tracking-widest"
        >
          <span className="text-[var(--accent)]">##</span> {t("projectsTitle")}
        </h2>
        <ul className="mt-4 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
          {projects.map((p) => (
            <li key={p.meta.slug}>
              <Link
                href={`/projects/${p.meta.slug}`}
                className="group flex items-baseline justify-between gap-4 py-3"
              >
                <span className="font-semibold group-hover:text-[var(--accent)]">
                  {p.doc.title}
                </span>
                <span className="shrink-0 text-xs uppercase tracking-wider opacity-60">
                  {tc(p.meta.category)} · {p.meta.date.slice(0, 4)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ideas-heading" className="mt-12">
        <h2
          id="ideas-heading"
          className="text-sm font-bold uppercase tracking-widest"
        >
          <span className="text-[var(--accent)]">##</span> {t("blogTitle")}
        </h2>
        <ul className="mt-4 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
          {posts.map((p) => (
            <li key={p.meta.slug}>
              <Link
                href={`/blog/${p.meta.slug}`}
                className="group flex items-baseline justify-between gap-4 py-3"
              >
                <span className="font-semibold group-hover:text-[var(--accent)]">
                  {p.doc.title}
                </span>
                <time
                  dateTime={p.meta.date}
                  className="shrink-0 text-xs opacity-60"
                >
                  {p.meta.date}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
