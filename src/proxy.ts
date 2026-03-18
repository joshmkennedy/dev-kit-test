import { auth } from "@/lib/auth";
import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "@/lib/i18n/i18n-config";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (!session?.user) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  // Skip locale detection for API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  return i18nRouter(req, { ...i18nConfig, prefixDefault: false });
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
