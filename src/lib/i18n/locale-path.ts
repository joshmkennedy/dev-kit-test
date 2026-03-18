import { defaultLocale } from "./i18n-config";

export function localePath(path: string, locale: string): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path}`;
}
