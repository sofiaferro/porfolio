"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";

/**
 * Link to the markdown twin of the current page: `/es/projects/mc-txt.md`,
 * rewritten to the `/md/[[...path]]` handler by next.config.ts.
 */
export function MdLink() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("footer");
  const href = `/${locale}${pathname === "/" ? "" : pathname}.md`;

  return (
    <a href={href} className="chip-link" title={t("thisPageMarkdown")}>
      [md]
    </a>
  );
}
