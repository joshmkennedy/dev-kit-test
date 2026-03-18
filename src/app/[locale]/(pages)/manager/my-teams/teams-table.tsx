"use client";

import { DataTable } from "@/app/components/data-table";
import { useCopy } from "@/lib/copy/use-copy";
import { type TeamRow, getTeamColumns } from "./team-columns";

export function TeamsTable({ data }: { data: TeamRow[] }) {
  const t = useCopy();
  const columns = getTeamColumns(t);
  return <DataTable columns={columns} data={data} />;
}
