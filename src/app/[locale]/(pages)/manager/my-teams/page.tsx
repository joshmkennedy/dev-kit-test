import { prisma } from "@/lib/prisma";
import { protect } from "@/lib/protect/protect";
import { accessibleBy } from "@casl/prisma";
import Link from "next/link";
import { DataTable } from "@/app/components/data-table";
import { type TeamRow, teamColumns } from "./team-columns";

export default async function ManagerTeams() {
  const { ability } = await protect("manager", "read", "Team");

  const teams = await prisma.team.findMany({
    where: accessibleBy(ability).Team,
    include: {
      managers: {
        include: {
          user: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });

  const data: TeamRow[] = teams.map((team) => ({
    id: team.id,
    name: team.name,
    teamManagers: team.managers.map((m) => ({
      id: m.user.id,
      name: m.user.name,
    })),
  }));

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Teams</h1>
      <Link href="/manager">&larr; Dashboard</Link>
      <div className="mt-4">
        <DataTable columns={teamColumns} data={data} />
      </div>
    </div>
  );
}
