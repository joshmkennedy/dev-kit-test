import { prisma } from "@/lib/prisma";
import { protect } from "@/lib/protect/protect";
import { accessibleBy } from "@casl/prisma";
import Link from "next/link";
import { Text } from "@/lib/copy/text";
import type { TeamRow } from "./team-columns";
import { TeamsTable } from "./teams-table";

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
      <Link href="/manager">&larr; <Text cid="manager.myteams.page.title">Dashboard</Text></Link>
      <div className="mt-4">
        <TeamsTable data={data} />
      </div>
    </div>
  );
}
