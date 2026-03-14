"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateRoles(roles: string[]) {
  const session = await auth();
  if (!session?.user?.email) return;

  await prisma.user.update({
    where: { email: session.user.email },
    data: { roles: JSON.stringify(roles) },
  });
}

export async function updateManagedTeams(teamIds: string[]) {
  const session = await auth();
  if (!session?.user?.email) return;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return;

  await prisma.$transaction([
    prisma.managerTeam.deleteMany({ where: { userId: user.id } }),
    ...teamIds.map((teamId) =>
      prisma.managerTeam.create({
        data: { userId: user.id, teamId },
      }),
    ),
  ]);
}
