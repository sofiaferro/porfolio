import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-4 opacity-80">{t("body")}</p>
      <ul className="mt-4 list-inside list-disc space-y-1 text-sm">
        <li>
          <Link href="/projects" className="text-[var(--accent)] underline underline-offset-2">
            /projects
          </Link>
        </li>
        <li>
          <Link href="/blog" className="text-[var(--accent)] underline underline-offset-2">
            /blog
          </Link>
        </li>
        <li>
          <Link href="/about" className="text-[var(--accent)] underline underline-offset-2">
            /about
          </Link>
        </li>
      </ul>
      <p className="mt-6">
        <Link href="/" className="text-[var(--accent)] underline underline-offset-2">
          {t("home")}
        </Link>
      </p>
    </main>
  );
}
