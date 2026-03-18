import { auth } from "@/lib/auth";
import { i18nRouter } from "next-i18n-router";
import { defaultLocale } from "@/lib/i18n/i18n-config";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

let cachedLocales: string[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minute

async function getLocales() {
  const now = Date.now();
  if (cachedLocales && now - cacheTime < CACHE_TTL) return cachedLocales;
  const rows = await prisma.supportedLocale.findMany();
  cachedLocales = rows.length > 0 ? rows.map((r) => r.code) : [defaultLocale];
  cacheTime = now;
  return cachedLocales;
}

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (!session?.user) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  // Skip locale detection for API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const locales = await getLocales();
  return i18nRouter(req, { locales, defaultLocale, prefixDefault: false });
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
