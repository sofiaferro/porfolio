import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header className="border-b border-[var(--hairline)]">
      <div className="mx-auto flex max-w-3xl items-baseline justify-between gap-4 px-6 py-4">
        <Link href="/" className="font-bold tracking-tight">
          <span className="text-[var(--accent)]">svf@porfolio</span>
          <span className="opacity-60">:~$</span>
        </Link>
        <nav aria-label="main" className="flex items-baseline gap-4 text-sm">
          <Link href="/projects" className="hover:text-[var(--accent)]">
            ./{t("projects")}
          </Link>
          <Link href="/manifiesto" className="hover:text-[var(--accent)]">
            ./{t("manifiesto")}
          </Link>
          <Link href="/about" className="hover:text-[var(--accent)]">
            ./{t("about")}
          </Link>
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}
