import { i18nConfig } from "./i18n-config";

export function localePath(path: string, locale: string): string {
  if (locale === i18nConfig.defaultLocale) return path;
  return `/${locale}${path}`;
}
