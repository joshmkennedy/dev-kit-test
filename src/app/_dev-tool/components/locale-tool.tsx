"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

type SupportedLocale = { code: string; name: string };

async function fetchLocales(): Promise<SupportedLocale[]> {
  const res = await fetch("/api/locales");
  return res.json();
}

export function LocaleTool() {
  const params = useParams<{ locale: string }>();
  const currentLocale = params.locale ?? "en";
  const pathname = usePathname();
  const router = useRouter();
  const [locales, setLocales] = useState<SupportedLocale[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchLocales().then(setLocales);
  }, []);

  function handleChange(newLocale: string) {
    if (newLocale === currentLocale) return;

    // Strip current locale prefix from pathname if present
    let cleanPath = pathname;
    if (currentLocale !== "en") {
      cleanPath = pathname.replace(new RegExp(`^/${currentLocale}(/|$)`), "$1") || "/";
    }

    // Add new locale prefix (English has no prefix with prefixDefault: false)
    const newPath = newLocale === "en" ? cleanPath : `/${newLocale}${cleanPath}`;

    // Set the cookie so next-i18n-router doesn't redirect back
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;

    startTransition(() => {
      router.push(newPath);
    });
  }

  return (
    <div className="space-y-3">
      <h1>Locale</h1>
      <div className="flex items-center gap-3">
        <label className="text-sm text-foreground/60">Language</label>
        <select
          value={currentLocale}
          onChange={(e) => handleChange(e.target.value)}
          disabled={isPending || locales.length === 0}
          className="bg-white/10 border border-white/20 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {locales.length === 0 ? (
            <option>Loading...</option>
          ) : (
            locales.map((l) => (
              <option key={l.code} value={l.code} className="bg-gray-800">
                {l.name} ({l.code})
              </option>
            ))
          )}
        </select>
        {isPending && <span className="text-xs text-foreground/40">Switching...</span>}
      </div>
      <p className="text-xs text-foreground/40">
        Current: <code className="text-blue-400/60">{currentLocale}</code>
      </p>
    </div>
  );
}
