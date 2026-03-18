"use server";

import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n/get-locale";

export async function getAllCopyMap(): Promise<Record<string, string>> {
  const locale = await getLocale();
  const translations = await prisma.translation.findMany({
    where: { locale: { in: locale === "en" ? ["en"] : [locale, "en"] } },
  });

  const map: Record<string, string> = {};
  // English first as fallback
  for (const t of translations) {
    if (t.locale === "en") map[t.copyId] = t.content;
  }
  // Override with locale-specific
  if (locale !== "en") {
    for (const t of translations) {
      if (t.locale === locale) map[t.copyId] = t.content;
    }
  }
  return map;
}
