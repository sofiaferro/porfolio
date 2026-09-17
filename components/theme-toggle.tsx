"use client";

import { useLayoutEffect, useState } from "react";
import { useTranslations } from "next-intl";

type Theme = "dark" | "light";

function storedTheme(): Theme | null {
  try {
    const t = localStorage.getItem("theme");
    if (t === "dark" || t === "light") return t;
  } catch {}
  return null;
}

function applyTheme(t: Theme) {
  const c = document.documentElement.classList;
  c.remove("dark", "light");
  c.add(t);
}

export function ThemeToggle() {
  const t = useTranslations("nav");
  // null until mounted: the server can't know the resolved theme, so both
  // sides render the same placeholder and hydration matches.
  const [theme, setTheme] = useState<Theme | null>(null);

  useLayoutEffect(() => {
    const stored = storedTheme();
    // Re-apply after React's dev strict-mode remount clears the class the
    // inline script set. No-op in production.
    if (stored) applyTheme(stored);
    setTheme(
      stored ??
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"),
    );
  }, []);

  if (!theme) {
    return (
      <span aria-hidden="true" className="text-sm text-[var(--muted)]">
        [·]
      </span>
    );
  }

  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next);
        try {
          localStorage.setItem("theme", next);
        } catch {}
        setTheme(next);
      }}
      aria-label={next === "dark" ? t("themeDark") : t("themeLight")}
      className="cursor-pointer text-sm text-[var(--muted)] transition-transform duration-150 hover:text-[var(--accent-2)] active:scale-[0.97]"
    >
      [{next}]
    </button>
  );
}
