import { prisma } from "@/lib/prisma";
import { protect } from "@/lib/protect/protect";
import Link from "next/link";
import { DataTable } from "@/app/components/data-table";
import { type MemberRow, columns } from "./_components/columns";
import { notFound } from "next/navigation";

export default async function ManagerTeamList({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const session = await protect("manager.my-teams", { teamId });

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!,
    },
    include: {
      managedTeams: {
        where: {
          teamId,
        },
        include: {
          team: {
            include: {
              members: {
                select: {
                  name: true,
                  email: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return notFound();
  }

  const data: MemberRow[] =
    user.managedTeams
      .find((t) => t.teamId === teamId)
      ?.team.members.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        teamId,
      })) ?? [];

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Members</h1>
      <Link href="/manager/my-teams">&larr; Teams</Link>
      <div className="mt-4">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
