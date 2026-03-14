import { ROLES } from "../auth";

export type Policy = {
  id: string;
  description: string;
  resource: string;
  roles: string[];
  scope?: string;
  resourceParam?: string;
  actions: string[];
};

export const policies: Policy[] = [
  {
    id: "admin-access",
    description: "Admins can access admin pages",
    resource: "admin",
    roles: [ROLES.ADMIN, ROLES.ADMIN__SUPER_ADMIN],
    actions: ["read", "write"],
  },
  {
    id: "manager-access",
    description: "Managers can access manager pages",
    resource: "manager",
    roles: [
      ROLES.MANAGER,
      ROLES.MANAGER__MONEY_HANDLER,
      ROLES.MANAGER__USER_SUPERVISOR,
    ],
    actions: ["read"],
  },
  {
    id: "manager-team-scope",
    description: "Managers can only view teams they manage",
    resource: "manager.my-teams",
    roles: [
      ROLES.MANAGER,
      ROLES.MANAGER__MONEY_HANDLER,
      ROLES.MANAGER__USER_SUPERVISOR,
    ],
    scope: "managerTeam.userId",
    resourceParam: "teamId",
    actions: ["read"],
  },
  {
    id: "user-access",
    description: "Users can access user pages",
    resource: "user",
    roles: [ROLES.USER, ROLES.USER__PAYING],
    actions: ["read"],
  },
];

/**
 * Find the most specific policy matching a resource name.
 * Matches by longest prefix so "manager.my-teams" wins over "manager".
 */
export function matchPolicy(resource: string): Policy | undefined {
  let best: Policy | undefined;
  let bestLength = 0;

  for (const policy of policies) {
    const pr = policy.resource;
    if (
      (resource === pr || resource.startsWith(`${pr}.`)) &&
      pr.length > bestLength
    ) {
      best = policy;
      bestLength = pr.length;
    }
  }

  return best;
}
