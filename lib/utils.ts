import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, locale: string) {
  const localeMap: Record<string, string> = {
    en: "en-US",
    es: "es-ES",
  };
  const normalizedLocale = localeMap[locale] || "en-US";
  return new Date(date).toLocaleDateString(normalizedLocale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}