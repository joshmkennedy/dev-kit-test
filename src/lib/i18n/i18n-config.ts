import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const defaultLocale = "en";

export const getSupportedLocales = cache(async () => {
  const rows = await prisma.supportedLocale.findMany();
  if (rows.length === 0) return [{ code: "en", name: "English" }];
  return rows;
});

export const getSupportedLocaleCodes = cache(async () => {
  const locales = await getSupportedLocales();
  return locales.map((l) => l.code);
});
