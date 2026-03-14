import type { Prisma } from "@/generated/prisma/client";

type ScopeBuilder = (
  userId: string,
  resourceId?: string,
) => Prisma.UserWhereInput;

export const scopeBuilders: Record<string, ScopeBuilder> = {
  "managerTeam.userId": (userId, teamId) => ({
    managedTeams: {
      some: {
        userId,
        ...(teamId ? { teamId } : {}),
      },
    },
  }),
};
