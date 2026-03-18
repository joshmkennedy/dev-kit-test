"use client";

import { useState, useTransition } from "react";
import type { SupportedLocale } from "@/generated/prisma/client";
import { addLocale, removeLocale } from "./handle-save";

export function LocaleManager({ locales: initial }: { locales: SupportedLocale[] }) {
  const [locales, setLocales] = useState(initial);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    const trimmedCode = code.trim().toLowerCase();
    const trimmedName = name.trim();
    if (!trimmedCode || !trimmedName) return;
    if (locales.some((l) => l.code === trimmedCode)) return;

    startTransition(async () => {
      const result = await addLocale(trimmedCode, trimmedName);
      setLocales((prev) => [...prev, result]);
      setCode("");
      setName("");
    });
  }

  function handleRemove(localeCode: string) {
    if (localeCode === "en") return;
    startTransition(async () => {
      await removeLocale(localeCode);
      setLocales((prev) => prev.filter((l) => l.code !== localeCode));
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {locales.map((locale) => (
          <div
            key={locale.code}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-sm"
          >
            <span className="font-mono">{locale.code}</span>
            <span className="text-foreground/50">{locale.name}</span>
            {locale.code !== "en" && (
              <button
                type="button"
                onClick={() => handleRemove(locale.code)}
                disabled={isPending}
                className="text-red-400/60 hover:text-red-400 ml-1"
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-end">
        <div>
          <label className="block text-xs text-foreground/50 mb-1">Code</label>
          <input
            type="text"
            placeholder="es"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-20 bg-white/10 border border-white/20 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-foreground/50 mb-1">Name</label>
          <input
            type="text"
            placeholder="Spanish"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-40 bg-white/10 border border-white/20 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={isPending || !code.trim() || !name.trim()}
          className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-md text-white"
        >
          Add Language
        </button>
      </div>
    </div>
  );
}
