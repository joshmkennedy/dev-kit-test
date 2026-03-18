"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type MemberRow = {
  id: string;
  name: string | null;
  email: string | null;
  teamId: string;
};

export const columns: ColumnDef<MemberRow, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/manager/my-teams/${row.original.teamId}/member/${row.original.id}`}
        className="underline"
      >
        {row.original.name ?? "—"}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
