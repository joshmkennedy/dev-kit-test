"use client";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type UserRow = {
  id: string;
  name: string;
  email: string;
};
export const columns: ColumnDef<UserRow, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link href={`/admin/users/${row.original.id}`} className="underline">
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
