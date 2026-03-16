import { prisma } from "@/lib/prisma";
import { protect } from "@/lib/protect/protect";
import { accessibleBy } from "@casl/prisma";
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
  const { ability } = await protect("manager", "read", "Team");

  const caslWhere = accessibleBy(ability).Team;
  console.log("CASL where clause:", JSON.stringify(caslWhere, null, 2));
  console.log("Ability rules:", JSON.stringify(ability.rules, null, 2));

  const team = await prisma.team.findFirst({
    where: {
      AND: [caslWhere, { id: teamId }],
    },
    include: {
      members: {
        select: {
          name: true,
          email: true,
          id: true,
        },
      },
    },
  });

  if (!team) {
    return notFound();
  }

  const data: MemberRow[] = team.members.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    teamId,
  }));

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
