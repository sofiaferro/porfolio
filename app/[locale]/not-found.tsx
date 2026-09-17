import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-4 text-[var(--muted)]">{t("body")}</p>
      <ul className="mt-4 list-inside list-disc space-y-1 text-sm">
        <li>
          <Link href="/projects" className="link-mark">
            /projects
          </Link>
        </li>
        <li>
          <Link href="/manifiesto" className="link-mark">
            /manifiesto
          </Link>
        </li>
        <li>
          <Link href="/about" className="link-mark">
            /about
          </Link>
        </li>
      </ul>
      <p className="mt-6">
        <Link href="/" className="link-mark">
          {t("home")}
        </Link>
      </p>
    </main>
  );
}
