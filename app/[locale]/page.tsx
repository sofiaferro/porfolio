import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getPage, getProjects, getSite } from "@/lib/content";
import type { Locale } from "@/lib/content/schema";
import { Mdx } from "@/components/mdx";
import { PromptLine } from "@/components/prompt-line";
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
  const role =
    locale === "en"
      ? "software engineer · creative technologist"
      : "ingeniera de software · creative technologist";

  return (
    <main className="mx-auto max-w-3xl space-y-12 px-4 py-10 sm:space-y-14 sm:px-6 sm:py-14">
      <section aria-labelledby="whoami" className="session-block">
        <PromptLine cmd="whoami" label={site.name} as="p" />
        <h1
          id="whoami"
          className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl"
        >
          {site.name}
        </h1>
        <p className="mt-1.5 text-sm text-[var(--muted)]">{role}</p>
        <div className="mt-6 max-w-[62ch]">
          <Mdx source={about.rawMarkdown} />
        </div>
      </section>

      <section aria-labelledby="ls-projects" className="session-block">
        <h2 id="ls-projects" className="text-sm font-normal">
          <span aria-hidden="true">
            <span className="text-[var(--muted)]">svf@porfolio:~$</span> ls -la projects/
          </span>
          <span className="sr-only">{t("projectsTitle")}</span>
        </h2>
        <ul className="mt-4">
          {projects.map((p) => (
            <li key={p.meta.slug}>
              <Link
                href={`/projects/${p.meta.slug}`}
                className="row-link grid grid-cols-[4ch_1fr] items-baseline gap-x-5 py-2.5 sm:grid-cols-[4ch_22ch_1fr]"
              >
                <span className="row-meta text-[13px] tabular-nums">
                  {p.meta.date.slice(0, 4)}
                </span>
                <span className="row-meta hidden truncate text-[13px] sm:block">
                  {tc(p.meta.category)}
                </span>
                <span className="truncate font-medium">
                  {p.doc.title}
                  {p.meta.featured && (
                    <span aria-hidden="true" className="chip-square" />
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="head-manifiesto" className="session-block">
        <h2 id="head-manifiesto" className="text-sm font-normal">
          <span aria-hidden="true">
            <span className="text-[var(--muted)]">svf@porfolio:~$</span> head manifiesto
          </span>
          <span className="sr-only">{t("manifestoTitle")}</span>
        </h2>
        <p className="mt-4 max-w-[62ch] leading-relaxed">
          {manifiesto.doc.summary}{" "}
          <Link
            href="/manifiesto"
            className="link-mark whitespace-nowrap"
          >
            {t("manifestoRead")}
          </Link>
        </p>
      </section>

      <p aria-hidden="true" className="session-block text-sm">
        <span className="text-[var(--muted)]">svf@porfolio:~$</span>{" "}
        <span className="cursor-block" />
      </p>
    </main>
  );
}
