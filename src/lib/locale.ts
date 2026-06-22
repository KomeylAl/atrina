export type Locale = "fa" | "en";

export function pickLocalized<T>(
  locale: Locale,
  fa: T,
  en: T,
): T {
  return locale === "fa" ? fa : en;
}

export function localizedField(
  obj: Record<string, unknown>,
  locale: Locale,
  field: string,
): string {
  const key = locale === "fa" ? `fa${field}` : `en${field}`;
  const value = obj[key];
  return typeof value === "string" ? value : "";
}
