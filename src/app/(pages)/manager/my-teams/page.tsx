import { prisma } from "@/lib/prisma";
import { protect } from "@/lib/protect/protect";
import Link from "next/link";
import { DataTable } from "@/app/components/data-table";
import { type TeamRow, teamColumns } from "./team-columns";

export default async function ManagerTeams() {
  const session = await protect("manager.my-teams");

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!,
    },
    include: {
      managedTeams: {
        include: {
          team: {
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
          },
        },
      },
    },
  });
  if (!user) {
    return <div>No managed teams found</div>;
  }

  const data: TeamRow[] = user.managedTeams.map((mt) => ({
    id: mt.team.id,
    name: mt.team.name,
    teamManagers: mt.team.managers.map((m) => ({
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
