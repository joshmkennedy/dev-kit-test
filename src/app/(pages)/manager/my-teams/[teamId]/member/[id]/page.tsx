import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { protect } from "@/lib/protect/protect";
import { notFound } from "next/navigation";

export default async function TeamMember({
  params,
}: {
  params: Promise<{ id: string; teamId: string }>;
}) {
  const { id, teamId } = await params;
  await protect("manager.my-teams", { teamId });
  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    }
  })
  const user = await prisma.user.findUnique({
    where: {
      id,
      teams: {
        some: {
          id: teamId,
        },
      },
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
        &larr; {team?.name ?? teamId}
      </Link>
      <h1>Team Member</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
