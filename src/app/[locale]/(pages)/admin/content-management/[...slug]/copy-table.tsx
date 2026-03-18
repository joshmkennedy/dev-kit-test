"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
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

  const enContent = copy.translations.find((t) => t.locale === "en")?.content;
  const isNonEnglish = locale !== "en";

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
          <h3 className="text-lg font-semibold">
            Edit Copy <span className="text-foreground/40 font-normal">({locale.toUpperCase()})</span>
          </h3>
          <code className="text-xs text-blue-400/80">{copy.id}</code>
          {copy.description && (
            <p className="text-xs text-foreground/40 mt-1">
              {copy.description}
            </p>
          )}
        </div>

        {isNonEnglish && enContent && (
          <div>
            <p className="text-xs text-foreground/40 mb-1">English (reference)</p>
            <div className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-foreground/60">
              {enContent}
            </div>
          </div>
        )}

        <div>
          {isNonEnglish && (
            <p className="text-xs text-foreground/40 mb-1">{locale.toUpperCase()} translation</p>
          )}
          <textarea
            className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-y min-h-25"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={isNonEnglish ? "No translation yet..." : ""}
            // biome-ignore lint/a11y/noAutofocus: I do what I want
            autoFocus={true}
          />
        </div>

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

function getTranslationContent(copy: CopyWithTranslations, locale: string): string {
  return copy.translations.find((t) => t.locale === locale)?.content ?? "";
}

export function CopyTable({ entries, locales }: { entries: CopyWithTranslations[]; locales: string[] }) {
  const [editing, setEditing] = useState<{ copy: CopyWithTranslations; locale: string } | null>(null);
  const [contentOverrides, setContentOverrides] = useState<Record<string, Record<string, string>>>({});

  function getDisplayContent(copy: CopyWithTranslations, locale: string): string {
    return contentOverrides[copy.id]?.[locale] ?? getContent(copy, locale);
  }

  function openEditModal(copy: CopyWithTranslations, locale: string) {
    setEditing({ copy, locale });
  }

  return (
    <>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 font-medium text-foreground/60">ID</th>
            <th className="px-4 py-3 font-medium text-foreground/60">
              Content (EN)
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
                <Link
                  href={`/admin/content-management/field/${encodeURIComponent(copy.id)}`}
                  className="text-xs text-blue-400/80 hover:underline"
                >
                  <code>{copy.id}</code>
                </Link>
                {copy.description && (
                  <p className="text-xs text-foreground/40 mt-0.5">
                    {copy.description}
                  </p>
                )}
              </td>
              <td className="px-4 py-3 align-top text-sm">
                {getDisplayContent(copy, "en")}
              </td>
              <td className="px-4 py-3 align-top">
                {locales.length === 1 ? (
                  <button
                    type="button"
                    onClick={() => openEditModal(copy, "en")}
                    className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-md text-white/60"
                  >
                    Edit
                  </button>
                ) : (
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) openEditModal(copy, e.target.value);
                    }}
                    className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-xs text-white/60 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="" disabled>
                      Edit...
                    </option>
                    {locales.map((locale) => {
                      const hasTranslation = copy.translations.some((t) => t.locale === locale);
                      return (
                        <option key={locale} value={locale} className="bg-gray-800">
                          {locale.toUpperCase()}{hasTranslation ? "" : " (missing)"}
                        </option>
                      );
                    })}
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <EditModal
          copy={editing.copy}
          locale={editing.locale}
          content={getTranslationContent(editing.copy, editing.locale)}
          onClose={() => setEditing(null)}
          onSaved={(content) => {
            setContentOverrides((prev) => ({
              ...prev,
              [editing.copy.id]: {
                ...prev[editing.copy.id],
                [editing.locale]: content,
              },
            }));
            // Update the copy's translations in memory for future edits
            const existing = editing.copy.translations.find((t) => t.locale === editing.locale);
            if (existing) {
              existing.content = content;
            } else {
              editing.copy.translations.push({
                id: "",
                copyId: editing.copy.id,
                locale: editing.locale,
                content,
              });
            }
            setEditing(null);
          }}
        />
      )}
    </>
  );
}
