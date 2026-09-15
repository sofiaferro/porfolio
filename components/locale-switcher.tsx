"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "es" ? "en" : "es";

  return (
    <Link
      href={pathname}
      locale={other}
      className="uppercase tracking-widest text-sm hover:text-[var(--accent)]"
      aria-label={other === "en" ? "Switch to English" : "Cambiar a español"}
    >
      [{other}]
    </Link>
  );
}
