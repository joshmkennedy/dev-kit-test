"use client";

import { useRef, useState, useTransition } from "react";
import type { CopyWithTranslations } from "@/lib/copy/group-copy";
import { updateCopy } from "../handle-save";

function EditModal({
  copy,
  locale,
  content: initialContent,
  onClose,
  onSaved,
}: {
  copy: CopyWithTranslations;
  locale: string;
  content: string;
  onClose: () => void;
  onSaved: (content: string) => void;
}) {
  const [content, setContent] = useState(initialContent);
  const [isPending, startTransition] = useTransition();
  const backdropRef = useRef<HTMLDivElement>(null);

  function handleSave() {
    startTransition(async () => {
      await updateCopy(copy.id, locale, content);
      onSaved(content);
    });
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: I do what I want
<div
      ref={backdropRef}
			onKeyDown={() => {}}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div className="bg-gray-800 border border-white/10 rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Edit Copy</h3>
          <code className="text-xs text-blue-400/80">{copy.id}</code>
          <span className="text-xs text-foreground/40 ml-2">({locale})</span>
          {copy.description && (
            <p className="text-xs text-foreground/40 mt-1">
              {copy.description}
            </p>
          )}
        </div>
        <textarea
          className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-y min-h-25"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          // biome-ignore lint/a11y/noAutofocus: I do what I want
          autoFocus={true}
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-md text-white/70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-md text-white"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function getContent(copy: CopyWithTranslations, locale: string): string {
  const t = copy.translations.find((t) => t.locale === locale);
  if (t) return t.content;
  const en = copy.translations.find((t) => t.locale === "en");
  return en?.content ?? "";
}

export function CopyTable({ entries, locales }: { entries: CopyWithTranslations[]; locales: readonly string[] }) {
  const [selectedLocale, setSelectedLocale] = useState(locales[0]);
  const [editing, setEditing] = useState<CopyWithTranslations | null>(null);
  const [contentMap, setContentMap] = useState<Record<string, string>>(() =>
    Object.fromEntries(entries.map((e) => [e.id, getContent(e, selectedLocale)])),
  );

  function handleLocaleChange(locale: string) {
    setSelectedLocale(locale);
    setContentMap(
      Object.fromEntries(entries.map((e) => [e.id, getContent(e, locale)])),
    );
  }

  return (
    <>
      {locales.length > 1 && (
        <div className="flex gap-2 mb-4">
          {locales.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => handleLocaleChange(locale)}
              className={`px-3 py-1 text-sm rounded-md ${
                selectedLocale === locale
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              {locale.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 font-medium text-foreground/60">ID</th>
            <th className="px-4 py-3 font-medium text-foreground/60">
              Content
            </th>
            <th className="px-4 py-3 font-medium text-foreground/60" />
          </tr>
        </thead>
        <tbody>
          {entries.map((copy) => (
            <tr
              key={copy.id}
              className="border-b border-white/5 hover:bg-white/5"
            >
              <td className="px-4 py-3 align-top">
                <code className="text-xs text-blue-400/80">{copy.id}</code>
                {copy.description && (
                  <p className="text-xs text-foreground/40 mt-0.5">
                    {copy.description}
                  </p>
                )}
              </td>
              <td className="px-4 py-3 align-top text-sm">
                {contentMap[copy.id]}
              </td>
              <td className="px-4 py-3 align-top">
                <button
                  type="button"
                  onClick={() => setEditing(copy)}
                  className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-md text-white/60"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <EditModal
          copy={editing}
          locale={selectedLocale}
          content={contentMap[editing.id] ?? ""}
          onClose={() => setEditing(null)}
          onSaved={(content) => {
            setContentMap((prev) => ({ ...prev, [editing.id]: content }));
            setEditing(null);
          }}
        />
      )}
    </>
  );
}
