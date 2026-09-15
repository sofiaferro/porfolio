import { useTranslations } from "next-intl";
import { getSite } from "@/lib/content";

export function SiteFooter() {
  const t = useTranslations("footer");
  const site = getSite();

  return (
    <footer className="mt-16 border-t border-[var(--hairline)]">
      <div className="mx-auto max-w-3xl space-y-2 px-6 py-8 text-sm opacity-80">
        <p>
          <a href={`mailto:${site.email}`} className="underline underline-offset-2 hover:text-[var(--accent)]">
            {site.email}
          </a>
          {" · "}
          <a href={site.sameAs[0]} className="underline underline-offset-2 hover:text-[var(--accent)]">
            github
          </a>
          {" · "}
          <a href={site.sameAs[1]} className="underline underline-offset-2 hover:text-[var(--accent)]">
            linkedin
          </a>
        </p>
        <p className="opacity-60">
          {t("agents")}{" "}
          <a href="/llms.txt" className="underline underline-offset-2">
            /llms.txt
          </a>
          {" · "}
          <a href="/sitemap.md" className="underline underline-offset-2">
            /sitemap.md
          </a>
          {" · "}
          <code>/api/mcp</code>
        </p>
      </div>
    </footer>
  );
}
