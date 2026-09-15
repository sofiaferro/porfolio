import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getPosts, getProjects, getSite } from "@/lib/content";
import { personJsonLd, JsonLdScript } from "@/lib/jsonld";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Terminal } from "@/components/terminal/terminal";
import "../globals.css";

// Restore the theme chosen via the `theme` terminal command before paint.
const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.classList.add(t)}catch(e){}`;

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
});

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    metadataBase: new URL(site.domain),
    title: {
      default: site.name,
      template: `%s — ${site.name}`,
    },
    description: site.tagline.es,
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const site = getSite();
  const terminalData = {
    locale: locale as Locale,
    projects: getProjects(locale as Locale).map((p) => ({
      slug: p.meta.slug,
      title: p.doc.title,
    })),
    posts: getPosts(locale as Locale).map((p) => ({
      slug: p.meta.slug,
      title: p.doc.title,
    })),
    email: site.email,
  };

  return (
    <html lang={locale} className={jetbrainsMono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen font-mono antialiased">
        <JsonLdScript data={personJsonLd()} />
        <NextIntlClientProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <Terminal data={terminalData} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
