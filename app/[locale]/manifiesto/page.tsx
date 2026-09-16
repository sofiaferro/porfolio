import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getPage } from "@/lib/content";
import type { Locale } from "@/lib/content/schema";
import { Mdx } from "@/components/mdx";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const page = getPage("manifiesto", locale);
  return pageMetadata(locale, "/manifiesto", {
    title: page.doc.title,
    description: page.doc.summary,
  });
}

export default async function ManifiestoPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const page = getPage("manifiesto", locale as Locale);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight">
        <span className="text-[var(--accent)]">$</span> cat{" "}
        {page.doc.title.toLowerCase()}
      </h1>
      <article className="mt-8">
        <Mdx source={page.rawMarkdown} />
      </article>
    </main>
  );
}
