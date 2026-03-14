"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useState, useTransition } from "react";

export type AuthRow = {
  key: string;
  value: string | null;
  editable?: {
    label: string;
    options: { id: string; label: string }[];
    selected: string[];
    onSave: (values: string[]) => Promise<void>;
  };
};

function MultiSelect({
  label,
  options,
  selected,
  onSave,
}: {
  label: string;
  options: { id: string; label: string }[];
  selected: string[];
  onSave: (values: string[]) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(selected);
  const [isPending, startTransition] = useTransition();

  function toggle(id: string) {
    setCurrent((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  }

  function handleSave() {
    startTransition(async () => {
      await onSave(current);
      setOpen(false);
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="text-left w-full hover:bg-white/5 rounded px-1 -mx-1 cursor-pointer"
      >
        {current
          .map((id) => options.find((o) => o.id === id)?.label ?? id)
          .join(", ") || <span className="text-foreground/40">None</span>}
      </button>

      {open && (
        <div className="fixed top-1/2 -translatey-1/2 left-1/2 -translate-1/2 mt-1 z-50 bg-gray-700 border border-white/10 rounded-md p-2 min-w-56 shadow-lg">
          <p className="text-xs text-foreground/50 px-2 pb-1">{label}</p>
          <div className="max-h-48 overflow-y-auto flex flex-col">
            {options.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={current.includes(opt.id)}
                  onChange={() => toggle(opt.id)}
                  className="accent-purple-500"
                />
                {opt.label}
              </label>
            ))}
          </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="mt-2 w-full text-center text-xs bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded px-2 py-1 cursor-pointer"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
        </div>
      )}
    </div>
  );
}

export const columns: ColumnDef<AuthRow, unknown>[] = [
  {
    accessorKey: "key",
    header: "Property",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const { editable, value } = row.original;
      if (editable) {
        return (
          <MultiSelect
            label={editable.label}
            options={editable.options}
            selected={editable.selected}
            onSave={editable.onSave}
          />
        );
      }
      return value;
    },
  },
];
