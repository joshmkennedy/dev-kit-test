import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n/get-locale";
import type { CopyId } from "@/generated/copy-ids";

const getAllCopy = cache(async (locale: string) => {
  const translations = await prisma.translation.findMany({
    where: { locale: { in: locale === "en" ? ["en"] : [locale, "en"] } },
  });

  const map = new Map<string, string>();
  // Add English first as fallback
  for (const t of translations) {
    if (t.locale === "en") map.set(t.copyId, t.content);
  }
  // Override with locale-specific
  if (locale !== "en") {
    for (const t of translations) {
      if (t.locale === locale) map.set(t.copyId, t.content);
    }
  }
  return map;
});

export async function t(id: CopyId, fallback: string, _description?: string) {
  const locale = await getLocale();
  const map = await getAllCopy(locale);
  return map.get(id) ?? fallback;
}
