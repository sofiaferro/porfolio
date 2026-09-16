import { useTranslations } from "next-intl";
import { getSite } from "@/lib/content";

function profileLabel(url: string): string {
  if (url.includes("github.com")) return "github";
  if (url.includes("linkedin.com")) return "linkedin";
  if (url.includes("x.com") || url.includes("twitter.com")) return "x";
  return new URL(url).hostname.replace(/^www\./, "");
}

export function SiteFooter() {
  const t = useTranslations("footer");
  const site = getSite();

  return (
    <footer className="mt-20 border-t border-[var(--hairline)]">
      <div className="mx-auto max-w-3xl space-y-3 px-4 py-10 text-sm sm:px-6">
        <p className="flex flex-wrap gap-x-5 gap-y-1">
          <a
            href={`mailto:${site.email}`}
            className="text-[var(--muted)] hover:text-[var(--accent)]"
          >
            {site.email}
          </a>
          {site.sameAs.map((url) => (
            <a
              key={url}
              href={url}
              className="text-[var(--muted)] hover:text-[var(--accent)]"
            >
              {profileLabel(url)}
            </a>
          ))}
        </p>
        <p className="text-[13px] text-[var(--muted)]">
          {t("agents")}{" "}
          <a href="/llms.txt" className="hover:text-[var(--accent)]">
            /llms.txt
          </a>
          {" · "}
          <a href="/sitemap.md" className="hover:text-[var(--accent)]">
            /sitemap.md
          </a>
          {" · "}
          <code>/api/mcp</code>
        </p>
      </div>
    </footer>
  );
}
