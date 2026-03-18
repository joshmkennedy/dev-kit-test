import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { defaultLocale } from "@/lib/i18n/i18n-config";

export async function GET(req: Request) {
  const locale = new URL(req.url).searchParams.get("locale") ?? defaultLocale;

  const translations = await prisma.translation.findMany({
    where: { locale: { in: locale === "en" ? ["en"] : [locale, "en"] } },
  });

  const map: Record<string, string> = {};
  for (const t of translations) {
    if (t.locale === "en") map[t.copyId] = t.content;
  }
  if (locale !== "en") {
    for (const t of translations) {
      if (t.locale === locale) map[t.copyId] = t.content;
    }
  }

  return NextResponse.json(map);
}
