import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getProjects, getSite } from "@/lib/content";
import { personJsonLd, JsonLdScript } from "@/lib/jsonld";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Terminal } from "@/components/terminal/terminal";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const site = getSite();
  const role =
    locale === "en"
      ? "Software Engineer & Creative Technologist"
      : "Ingeniera de Software y Creative Technologist";
  const tagline =
    site.tagline[hasLocale(routing.locales, locale) ? locale : "es"] ?? "";
  const geo =
    locale === "en"
      ? "Based in Buenos Aires, Argentina."
      : "Desde Buenos Aires, Argentina.";
  return {
    metadataBase: new URL(site.domain),
    title: {
      default: `${site.name} — ${role}`,
      template: `%s — ${site.name}`,
    },
    description: `${tagline} ${geo}`,
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
    email: site.email,
  };

  return (
    <html lang={locale} className={jetbrainsMono.variable} suppressHydrationWarning>
      <body className="min-h-screen font-mono antialiased">
        <JsonLdScript data={personJsonLd()} />
        <ThemeProvider>
          <NextIntlClientProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
            <Terminal data={terminalData} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
