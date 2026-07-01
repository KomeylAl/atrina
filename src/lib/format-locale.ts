export type AppLocale = "fa" | "en";

function toDate(value: Date | string): Date {
  return typeof value === "string" ? new Date(value) : value;
}

export function formatDate(
  value: Date | string,
  locale: AppLocale,
  style: "full" | "short" = "full",
): string {
  const date = toDate(value);

  if (locale === "fa") {
    return new Intl.DateTimeFormat("fa-IR", {
      calendar: "persian",
      year: "numeric",
      month: style === "short" ? "short" : "long",
      day: "numeric",
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: style === "short" ? "short" : "long",
    day: "numeric",
  }).format(date);
}

export function formatMonthYear(value: Date | string, locale: AppLocale): string {
  const date = toDate(value);

  if (locale === "fa") {
    return new Intl.DateTimeFormat("fa-IR", {
      calendar: "persian",
      year: "numeric",
      month: "long",
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(date);
}

export function formatReadTime(minutes: number, locale: AppLocale): string {
  if (locale === "fa") {
    return `${minutes.toLocaleString("fa-IR")} دقیقه مطالعه`;
  }
  return `${minutes} min read`;
}

export function formatReadTimeShort(minutes: number, locale: AppLocale): string {
  if (locale === "fa") {
    return `${minutes.toLocaleString("fa-IR")} دقیقه`;
  }
  return `${minutes} min`;
}
