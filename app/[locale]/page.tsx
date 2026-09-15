import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getPage, getProjects, getSite } from "@/lib/content";
import type { Locale } from "@/lib/content/schema";
import { Mdx } from "@/components/mdx";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const site = getSite();
  const role =
    locale === "en"
      ? "Software Engineer & Creative Technologist"
      : "Ingeniera de Software y Creative Technologist";
  const geo =
    locale === "en"
      ? "Based in Buenos Aires, Argentina."
      : "Desde Buenos Aires, Argentina.";
  const base = pageMetadata(locale, "", {
    description: `${site.tagline[locale] ?? site.tagline.es ?? ""} ${geo}`,
  });
  return { ...base, title: { absolute: `${site.name} — ${role}` } };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("categories");

  const site = getSite();
  const about = getPage("about", locale as Locale);
  const manifiesto = getPage("manifiesto", locale as Locale);
  const projects = getProjects(locale as Locale);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm">
        <span className="text-[var(--accent)]">svf@porfolio:~$</span>{" "}
        <span className="text-[var(--muted)]">whoami</span>
      </p>
      <h1 className="mt-3 text-5xl font-bold tracking-tighter sm:text-6xl">
        {site.name}
      </h1>
      <p className="mt-4 max-w-[52ch] text-[13px] uppercase leading-relaxed tracking-[0.18em] text-[var(--muted)]">
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
                className="row-link group flex items-baseline justify-between gap-4 py-3.5"
              >
                <span className="font-semibold group-hover:text-[var(--accent)]">
                  {p.doc.title}
                </span>
                <span className="shrink-0 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)] tabular-nums">
                  {tc(p.meta.category)} · {p.meta.date.slice(0, 4)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="manifiesto-heading" className="mt-12">
        <h2
          id="manifiesto-heading"
          className="text-[11px] font-semibold uppercase tracking-[0.25em] opacity-90"
        >
          <span className="text-[var(--accent)]">##</span> {t("manifestoTitle")}
        </h2>
        <p className="mt-4 max-w-[60ch] leading-relaxed">
          {manifiesto.doc.summary}{" "}
          <Link
            href="/manifiesto"
            className="text-[var(--accent)] underline underline-offset-2"
          >
            {t("manifestoRead")}
          </Link>
        </p>
      </section>
    </main>
  );
}
