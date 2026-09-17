import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getProjects } from "@/lib/content";
import type { Locale } from "@/lib/content/schema";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "projects" });
  return pageMetadata(locale, "/projects", {
    title: t("title"),
    description:
      locale === "es"
        ? "Bots que escriben, poesía generativa, instalaciones y hardware DIY — máquinas con algo para decir."
        : "Bots that write, generative poetry, installations and DIY hardware — machines with something to say.",
  });
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const tc = await getTranslations("categories");
  const projects = getProjects(locale as Locale);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight">
        <span className="text-[var(--accent-ink)]">$</span> ls {t("title")}/
      </h1>
      <ul className="mt-8 space-y-8">
        {projects.map((p) => (
          <li key={p.meta.slug} className="border-b border-[var(--hairline)] pb-8">
            <article>
              <h2 className="text-lg font-semibold">
                <Link
                  href={`/projects/${p.meta.slug}`}
                  className="hover:text-[var(--accent-2)]"
                >
                  {p.doc.title}
                </Link>
              </h2>
              <p className="mt-1 text-xs uppercase tracking-wider text-[var(--muted)]">
                {tc(p.meta.category)} · {p.meta.date.slice(0, 4)}
                {p.meta.tech.length > 0 && ` · ${p.meta.tech.join(", ")}`}
              </p>
              <p className="mt-3 leading-relaxed">{p.doc.summary}</p>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}
