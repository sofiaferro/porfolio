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
      <p className="text-sm">
        <span className="text-[var(--accent)]">svf@porfolio:~$</span>{" "}
        <span className="opacity-70">whoami</span>
      </p>
      <h1 className="mt-3 text-5xl font-bold tracking-tighter sm:text-6xl">
        {site.name}
      </h1>
      <p className="mt-4 max-w-[52ch] text-[13px] uppercase leading-relaxed tracking-[0.18em] opacity-60">
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
          className="text-[11px] font-semibold uppercase tracking-[0.25em] opacity-90"
        >
          <span className="text-[var(--accent)]">##</span> {t("projectsTitle")}
        </h2>
        <ul className="mt-4 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
          {projects.map((p) => (
            <li key={p.meta.slug}>
              <Link
                href={`/projects/${p.meta.slug}`}
                className="group flex items-baseline justify-between gap-4 py-3.5"
              >
                <span className="font-semibold group-hover:text-[var(--accent)]">
                  {p.doc.title}
                </span>
                <span className="shrink-0 text-[11px] uppercase tracking-[0.14em] opacity-55 tabular-nums">
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
          className="text-[11px] font-semibold uppercase tracking-[0.25em] opacity-90"
        >
          <span className="text-[var(--accent)]">##</span> {t("blogTitle")}
        </h2>
        <ul className="mt-4 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
          {posts.map((p) => (
            <li key={p.meta.slug}>
              <Link
                href={`/blog/${p.meta.slug}`}
                className="group flex items-baseline justify-between gap-4 py-3.5"
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
