import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import geoip from "geoip-lite";

const COOKIE_NAME = "atrina_admin_session";
const LOCALE_COOKIE = "atrina_locale";
const LOCALES = ["fa", "en"] as const;
type AppLocale = (typeof LOCALES)[number];

function getSecret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET || "dev-secret-change-in-production",
  );
}

function isLocale(value: string | undefined | null): value is AppLocale {
  return value === "fa" || value === "en";
}

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-client-ip") ||
    null
  );
}

function getCountryFromHeaders(request: NextRequest): string | null {
  const candidates = [
    "cf-ipcountry",
    "x-vercel-ip-country",
    "cloudfront-viewer-country",
    "x-country-code",
    "x-geo-country",
  ];

  for (const header of candidates) {
    const value = request.headers.get(header)?.trim().toUpperCase();
    if (value && value !== "XX" && value !== "T1") {
      return value;
    }
  }

  return null;
}

function isPrivateIp(ip: string): boolean {
  return (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

function getCountryFromIp(ip: string | null): string | null {
  if (!ip || isPrivateIp(ip)) return null;

  try {
    const result = geoip.lookup(ip);
    return result?.country?.toUpperCase() ?? null;
  } catch {
    return null;
  }
}

function getLocaleFromAcceptLanguage(request: NextRequest): AppLocale | null {
  const accept = request.headers.get("accept-language")?.toLowerCase() ?? "";
  if (!accept) return null;

  const parts = accept.split(",").map((part) => part.trim().split(";")[0]);
  for (const part of parts) {
    if (part === "fa" || part.startsWith("fa-")) return "fa";
    if (part === "en" || part.startsWith("en-")) return "en";
  }

  return null;
}

function resolveLocale(request: NextRequest): AppLocale {
  const preferred = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(preferred)) return preferred;

  const country =
    getCountryFromHeaders(request) || getCountryFromIp(getClientIp(request));

  if (country === "IR") return "fa";
  if (country) return "en";

  return getLocaleFromAcceptLanguage(request) ?? "en";
}

function setLocaleCookie(response: NextResponse, locale: AppLocale) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}

function getLocaleFromPath(pathname: string): AppLocale | null {
  if (pathname === "/fa" || pathname.startsWith("/fa/")) return "fa";
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const locale = resolveLocale(request);
    const response = NextResponse.redirect(new URL(`/${locale}`, request.url));
    setLocaleCookie(response, locale);
    return response;
  }

  const pathLocale = getLocaleFromPath(pathname);
  if (pathLocale) {
    const response = NextResponse.next();
    const current = request.cookies.get(LOCALE_COOKIE)?.value;
    if (current !== pathLocale) {
      setLocaleCookie(response, pathLocale);
    }
    return response;
  }

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token, getSecret());
    } catch {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url),
      );
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  if (pathname === "/admin/login") {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      try {
        await jwtVerify(token, getSecret());
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch {
        // invalid token — allow login page
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/fa", "/en", "/fa/:path*", "/en/:path*", "/admin/:path*"],
};
