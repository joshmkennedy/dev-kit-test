"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type TeamRow = {
  id: string;
  name: string;
  teamManagers: { id: string | null; name: string | null }[];
};

export const teamColumns: ColumnDef<TeamRow, unknown>[] = [
  {
    accessorKey: "name",
    header: "Team Name",
    cell: ({ row }) => (
      <Link href={`/manager/my-teams/${row.original.id}`} className="underline">
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "teamManagers",
    id: "teamManagers",
    header: "Managers",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row
          .getValue<TeamRow["teamManagers"]>("teamManagers")
          .map((manager) => (
            <Link
              key={manager.id}
              href={`/manager/my-teams/${row.original.id}/member/${manager.id}`}
              className="underline"
            >
              {manager.name}
            </Link>
          ))}
      </div>
    ),
  },
];
