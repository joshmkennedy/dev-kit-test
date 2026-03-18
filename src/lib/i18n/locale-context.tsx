"use client";

import { createContext, useContext } from "react";
import { i18nConfig } from "./i18n-config";

const LocaleContext = createContext<string>(i18nConfig.defaultLocale);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
