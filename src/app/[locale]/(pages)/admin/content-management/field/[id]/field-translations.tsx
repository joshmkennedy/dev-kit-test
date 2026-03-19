"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { SupportedLocale, Translation } from "@/generated/prisma/client";
import { updateCopy } from "../../handle-save";

function InlineEdit({
  value,
  locale,
  copyId,
  onSaved,
}: {
  value: string;
  locale: string;
  copyId: string;
  onSaved: (content: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(value);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function handleSave() {
    startTransition(async () => {
      await updateCopy(copyId, locale, content);
      onSaved(content);
      setEditing(false);
    });
  }

  function handleCancel() {
    setContent(value);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && e.metaKey) handleSave();
    if (e.key === "Escape") handleCancel();
  }

  if (!editing) {
    return (
      // biome-ignore lint/a11y/useKeyWithClickEvents: I do what I want
      // biome-ignore lint/a11y/noStaticElementInteractions: I do what I want
      <div
        onClick={() => setEditing(true)}
        className="px-3 py-2 rounded-md cursor-pointer hover:bg-white/5 min-h-10 flex items-center"
      >
        {value ? (
          <span className="text-sm">{value}</span>
        ) : (
          <span className="text-sm text-foreground/30 italic">
            Click to add translation...
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <textarea
        ref={inputRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isPending}
        className="w-full bg-white/10 border border-blue-500 rounded-md px-3 py-2 text-sm text-white focus:outline-none resize-y min-h-20"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-md text-white"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-md text-white/70"
        >
          Cancel
        </button>
        <span className="text-xs text-foreground/30 ml-auto">
          &#8984;&#9166; to save &middot; Esc to cancel
        </span>
      </div>
    </div>
  );
}

export function FieldTranslations({
  copyId,
  translations: initial,
  locales,
}: {
  copyId: string;
  translations: Translation[];
  locales: SupportedLocale[];
}) {
  const [contentMap, setContentMap] = useState<Record<string, string>>(() =>
    Object.fromEntries(initial.map((t) => [t.locale, t.content])),
  );

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-white/10">
          <th className="px-4 py-3 font-medium text-foreground/60 w-32">
            Language
          </th>
          <th className="px-4 py-3 font-medium text-foreground/60">Content</th>
        </tr>
      </thead>
      <tbody>
        {locales.map((locale) => (
          <tr key={locale.code} className="border-b border-white/5">
            <td className="px-4 py-3 align-top">
              <div className="flex flex-col">
                <span className="font-mono text-sm">
                  {locale.code.toUpperCase()}
                </span>
                <span className="text-xs text-foreground/40">
                  {locale.name}
                </span>
              </div>
            </td>
            <td className="px-4 py-1 align-top">
              <InlineEdit
                value={contentMap[locale.code] ?? ""}
                locale={locale.code}
                copyId={copyId}
                onSaved={(content) =>
                  setContentMap((prev) => ({ ...prev, [locale.code]: content }))
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
