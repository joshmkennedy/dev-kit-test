import { headers } from "next/headers";
import { defaultLocale } from "./i18n-config";

export async function getLocale(): Promise<string> {
  const hdrs = await headers();
  return hdrs.get("x-next-i18n-router-locale") ?? defaultLocale;
}
