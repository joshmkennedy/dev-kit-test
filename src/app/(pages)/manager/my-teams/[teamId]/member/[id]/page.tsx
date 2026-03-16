import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { protect } from "@/lib/protect/protect";
import { accessibleBy } from "@casl/prisma";
import { notFound } from "next/navigation";

export default async function TeamMember({
  params,
}: {
  params: Promise<{ id: string; teamId: string }>;
}) {
  const { id, teamId } = await params;
  const { ability:teamAbility } = await protect("manager", "read", "Team");
  const { ability:userAbility } = await protect("manager", "read", "Team");

  // Verify the logged-in user manages this team
  const team = await prisma.team.findFirst({
    where: {
      AND: [accessibleBy(teamAbility).Team, { id: teamId }],
    },
    select: { name: true },
  });

  if (!team) {
    return notFound();
  }

  // Fetch the member
  const user = await prisma.user.findUnique({
    where: {
      id,
      teams: {
        some: {
          id: teamId,
        },
      },
      AND: [accessibleBy(userAbility).User, { id }],
    },
    include: {
      teams: true,
    },
  });

  if (!user) {
    return notFound();
  }

  return (
    <div>
      <Link href={`/manager/my-teams/${teamId}`}>
        &larr; {team.name}
      </Link>
      <h1>Team Member</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
