"use client";

import { use } from "react";
import type { CopyId } from "@/generated/copy-ids";
import { useLocale } from "@/lib/i18n/locale-context";
import { fetchCopyMap } from "./fetch-copy";

const copyPromises = new Map<string, Promise<Record<string, string>>>();

/**
 * Hook that returns a `t` function for translating copy IDs in client components.
 *
 * Usage:
 *   const t = useCopy();
 *   t("some.copy.id", "Fallback text");
 */
export function useCopy() {
  const locale = useLocale();

  if (!copyPromises.has(locale)) {
    copyPromises.set(locale, fetchCopyMap(locale));
  }
  const map = use(copyPromises.get(locale)!);

  return function t(cid: CopyId, fallback: string, _description?: string) {
    return map[cid] ?? fallback;
  };
}
