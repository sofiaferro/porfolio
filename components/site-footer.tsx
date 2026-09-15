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
    <footer className="mt-16 border-t border-[var(--hairline)]">
      <div className="mx-auto max-w-3xl space-y-2 px-6 py-8 text-sm opacity-80">
        <p>
          <a
            href={`mailto:${site.email}`}
            className="underline underline-offset-2 hover:text-[var(--accent)]"
          >
            {site.email}
          </a>
          {site.sameAs.map((url) => (
            <span key={url}>
              {" · "}
              <a
                href={url}
                className="underline underline-offset-2 hover:text-[var(--accent)]"
              >
                {profileLabel(url)}
              </a>
            </span>
          ))}
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
