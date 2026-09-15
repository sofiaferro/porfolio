import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getPosts } from "@/lib/content";
import type { Locale } from "@/lib/content/schema";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "blog" });
  return pageMetadata(locale, "/blog", {
    title: t("title"),
    description:
      locale === "es"
        ? "Notas sobre código, lenguaje y máquinas — lo que pienso mientras debuggeo."
        : "Notes on code, language and machines — what I think about while debugging.",
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const posts = getPosts(locale as Locale);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold tracking-tight">
        <span className="text-[var(--accent)]">$</span> ls {t("title")}/
      </h1>
      <ul className="mt-8 space-y-8">
        {posts.map((p) => (
          <li key={p.meta.slug} className="border-b border-[var(--hairline)] pb-8">
            <article>
              <h2 className="text-lg font-semibold">
                <Link
                  href={`/blog/${p.meta.slug}`}
                  className="hover:text-[var(--accent)]"
                >
                  {p.doc.title}
                </Link>
              </h2>
              <time
                dateTime={p.meta.date}
                className="mt-1 block text-xs opacity-60"
              >
                {p.meta.date}
              </time>
              <p className="mt-3 leading-relaxed">{p.doc.summary}</p>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}
