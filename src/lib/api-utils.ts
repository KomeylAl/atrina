import type { Locale } from "@/lib/locale";

export function parseLocale(value: string | null): Locale {
  return value === "fa" ? "fa" : "en";
}
