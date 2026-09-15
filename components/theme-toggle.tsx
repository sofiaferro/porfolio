"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("nav");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Placeholder with the same footprint until mounted, to avoid a
  // hydration mismatch (the server doesn't know the resolved theme).
  if (!mounted) {
    return (
      <span aria-hidden="true" className="text-sm text-[var(--muted)]">
        [·]
      </span>
    );
  }

  const next = resolvedTheme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={next === "dark" ? t("themeDark") : t("themeLight")}
      className="cursor-pointer text-sm text-[var(--muted)] transition-transform duration-150 hover:text-[var(--accent)] active:scale-[0.97]"
    >
      [{next}]
    </button>
  );
}
