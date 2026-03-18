import { accessibleBy } from "@casl/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DataTable } from "@/app/components/data-table";
import { Text } from "@/lib/copy/text";
import { prisma } from "@/lib/prisma";
import { protect } from "@/lib/protect/protect";
import { columns, type MemberRow } from "./_components/columns";

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
      <Link href="/manager/my-teams">
        &larr;{" "}
        <Text
          cid="manager.my-teams.page.link.back"
          description="Back link for /manager/my-teams"
        >
          My Teams
        </Text>
      </Link>

      <h1 className="text-xl font-bold mb-4">
        <Text
          cid="manager.my-teams.page.title-prefix"
          description="Page title prefix for /manager/my-teams/[teamId]. Goes before the team name."
        >
          Team:
        </Text>{" "}
        {team.name}
      </h1>

      <div className="mt-4">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
