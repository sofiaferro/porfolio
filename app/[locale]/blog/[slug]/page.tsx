import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getPost, getPosts } from "@/lib/content";
import type { Locale } from "@/lib/content/schema";
import { postJsonLd, JsonLdScript } from "@/lib/jsonld";
import { Mdx } from "@/components/mdx";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getPosts(locale).map((p) => ({ locale, slug: p.meta.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const post = getPost(slug, locale);
  if (!post) return {};
  return pageMetadata(locale, `/blog/${slug}`, {
    title: post.doc.title,
    description: post.doc.summary,
    image: post.meta.image,
  });
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const post = getPost(slug, locale as Locale);
  if (!post) notFound();
  const t = await getTranslations("blog");

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <nav aria-label="breadcrumb" className="text-sm">
        <Link href="/blog" className="opacity-70 hover:text-[var(--accent)]">
          ← {t("backToList")}
        </Link>
      </nav>

      <article className="mt-6">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {post.doc.title}
          </h1>
          <time
            dateTime={post.meta.date}
            className="mt-2 block text-xs opacity-60"
          >
            {post.meta.date}
          </time>
        </header>
        <div className="mt-8">
          <Mdx source={post.rawMarkdown} />
        </div>
      </article>

      <JsonLdScript data={postJsonLd(post, locale as Locale)} />
    </main>
  );
}
