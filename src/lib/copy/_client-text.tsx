"use client";
import { memo, use } from "react";
import type { CopyId } from "@/generated/copy-ids";
import { useLocale } from "@/lib/i18n/locale-context";
import { getAllCopyMap } from "./get-all-copy";

const copyPromises = new Map<string, Promise<Record<string, string>>>();

export const Text = memo(function Text({cid, fallback}:{cid:CopyId, fallback:string, description:string}) {
  const locale = useLocale();

  if (!copyPromises.has(locale)) {
    copyPromises.set(locale, getAllCopyMap());
  }
  const map = use(copyPromises.get(locale)!);

  return <>{map[cid] ?? fallback}</>;
})
