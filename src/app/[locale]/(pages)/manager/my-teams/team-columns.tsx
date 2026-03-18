"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { CopyId } from "@/generated/copy-ids";
import Link from "next/link";

export type TeamRow = {
  id: string;
  name: string;
  teamManagers: { id: string | null; name: string | null }[];
};

export function getTeamColumns(t: (cid: CopyId, fallback: string, description?: string) => string): ColumnDef<TeamRow, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: t("manager.my-teams.column.team-name", "Team Name", "Column header for team name"),
      cell: ({ row }) => (
        <Link href={`/manager/my-teams/${row.original.id}`} className="underline">
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: "teamManagers",
      id: "teamManagers",
      header: t("manager.my-teams.column.managers", "Managers", "Column header for managers"),
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
}
