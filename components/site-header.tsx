import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header className="border-b border-[var(--hairline)]">
      <div className="mx-auto flex max-w-3xl flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-4 sm:px-6">
        <Link href="/" className="whitespace-nowrap font-bold tracking-tight">
          <span className="chip-accent">svf@porfolio</span>
          <span className="text-[var(--muted)]">:~$</span>
        </Link>
        <nav
          aria-label="main"
          className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm sm:gap-x-4"
        >
          <Link href="/projects" className="-my-1 py-1 text-[var(--muted)] hover:text-[var(--accent-2)]">
            ./{t("projects")}
          </Link>
          <Link href="/manifiesto" className="-my-1 py-1 text-[var(--muted)] hover:text-[var(--accent-2)]">
            ./{t("manifiesto")}
          </Link>
          <Link href="/about" className="-my-1 py-1 text-[var(--muted)] hover:text-[var(--accent-2)]">
            ./{t("about")}
          </Link>
          <LocaleSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
