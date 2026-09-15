import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getProject, getProjects } from "@/lib/content";
import type { Locale } from "@/lib/content/schema";
import { projectJsonLd, JsonLdScript } from "@/lib/jsonld";
import { Mdx } from "@/components/mdx";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getProjects(locale).map((p) => ({ locale, slug: p.meta.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const project = getProject(slug, locale);
  if (!project) return {};
  const { title, descriptor, summary } = project.doc;
  return pageMetadata(locale, `/projects/${slug}`, {
    title: descriptor ? `${title} — ${descriptor}` : title,
    description: summary,
    image: project.meta.images[0]?.src,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const project = getProject(slug, locale as Locale);
  if (!project) notFound();
  const t = await getTranslations("projects");
  const tc = await getTranslations("categories");
  const { meta, doc } = project;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <nav aria-label="breadcrumb" className="text-sm">
        <Link href="/projects" className="text-[var(--muted)] hover:text-[var(--accent)]">
          ← {t("backToList")}
        </Link>
      </nav>

      <article className="mt-6">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {doc.title}
          </h1>
          <p className="mt-2 text-xs uppercase tracking-wider text-[var(--muted)]">
            {tc(meta.category)} · {meta.date.slice(0, 4)}
          </p>
          {meta.tech.length > 0 && (
            <p className="mt-2 text-sm">
              <span className="text-[var(--muted)]">{t("tech")}:</span>{" "}
              {meta.tech.join(", ")}
            </p>
          )}
          <ul className="mt-2 flex gap-4 text-sm">
            {meta.links.live && (
              <li>
                <a
                  href={meta.links.live}
                  className="text-[var(--accent)] underline underline-offset-2"
                >
                  [{t("live")}]
                </a>
              </li>
            )}
            {meta.links.github && (
              <li>
                <a
                  href={meta.links.github}
                  className="text-[var(--accent)] underline underline-offset-2"
                >
                  [{t("github")}]
                </a>
              </li>
            )}
            {meta.links.video && (
              <li>
                <a
                  href={meta.links.video}
                  className="text-[var(--accent)] underline underline-offset-2"
                >
                  [{t("video")}]
                </a>
              </li>
            )}
          </ul>
        </header>

        <div className="mt-8">
          <Mdx source={project.rawMarkdown} />
        </div>

        {meta.images.length > 0 && (
          <section aria-label="gallery" className="mt-10 space-y-6">
            {meta.images.map((img) => (
              <figure key={img.src}>
                <Image
                  src={img.src}
                  alt={img.alt?.[locale as Locale] ?? doc.title}
                  width={1200}
                  height={800}
                  className="h-auto w-full border border-[var(--hairline)]"
                />
                {img.caption?.[locale as Locale] && (
                  <figcaption className="mt-2 text-sm text-[var(--muted)]">
                    {img.caption[locale as Locale]}
                  </figcaption>
                )}
              </figure>
            ))}
          </section>
        )}
      </article>

      <JsonLdScript data={projectJsonLd(project, locale as Locale)} />
    </main>
  );
}
