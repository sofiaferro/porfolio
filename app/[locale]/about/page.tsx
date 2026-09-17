import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getPage, getSite } from "@/lib/content";
import type { Locale } from "@/lib/content/schema";
import { Mdx } from "@/components/mdx";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const about = getPage("about", locale);
  return pageMetadata(locale, "/about", {
    title: about.doc.title,
    description: about.doc.summary,
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const about = getPage("about", locale as Locale);
  const site = getSite();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight">
        <span className="text-[var(--accent-ink)]">$</span> cat {about.doc.title.toLowerCase()}
      </h1>
      <div className="mt-8">
        <Mdx source={about.rawMarkdown} />
      </div>
      <p className="mt-8 text-sm">
        <a
          href={`mailto:${site.email}`}
          className="link-mark"
        >
          {site.email}
        </a>
      </p>
    </main>
  );
}
