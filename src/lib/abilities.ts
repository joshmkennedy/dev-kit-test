import { AbilityBuilder, type PureAbility } from "@casl/ability";
import {
  createPrismaAbility,
  type PrismaQuery,
  type Subjects,
} from "@casl/prisma";
import type { User, Team } from "@/generated/prisma/client";
import { ROLES } from "./auth";

type AppSubjects = Subjects<{
  User: User;
  Team: Team;
}>;

export type AppAbility = PureAbility<
  [string, AppSubjects | "all"],
  PrismaQuery
>;

export type Domain = "admin" | "manager" | "user";

// ── Domain-specific ability builders ─────────────────────────

function adminAbilities(
  builder: AbilityBuilder<AppAbility>,
  _userId: string,
  roles: string[],
) {
  const { can, cannot } = builder;

  if (
    roles.includes(ROLES.ADMIN) ||
    roles.includes(ROLES.ADMIN__SUPER_ADMIN)
  ) {
    can("manage", "all");
  }

  if (
    roles.includes(ROLES.ADMIN) &&
    !roles.includes(ROLES.ADMIN__SUPER_ADMIN)
  ) {
    cannot("delete", "User");
  }
}

function managerAbilities(
  builder: AbilityBuilder<AppAbility>,
  userId: string,
  roles: string[],
) {
  const { can, cannot } = builder;

  if (
    roles.includes(ROLES.MANAGER) ||
    roles.includes(ROLES.MANAGER__MONEY_HANDLER) ||
    roles.includes(ROLES.MANAGER__USER_SUPERVISOR)
  ) {
    can("read", "Team", {
      managers: { some: { userId } },
    });

    can("read", "User", {
      teams: { some: { managers: { some: { userId } } } },
    });
  }

  if (roles.includes(ROLES.MANAGER__MONEY_HANDLER)) {
    cannot("delete", "Team");
  }
}

function userAbilities(
  builder: AbilityBuilder<AppAbility>,
  userId: string,
  roles: string[],
) {
  const { can } = builder;

  if (roles.includes(ROLES.USER) || roles.includes(ROLES.USER__PAYING)) {
    can("read", "User", { id: userId });
  }
}

const domainBuilders: Record<
  Domain,
  (
    builder: AbilityBuilder<AppAbility>,
    userId: string,
    roles: string[],
  ) => void
> = {
  admin: adminAbilities,
  manager: managerAbilities,
  user: userAbilities,
};

// ── Public API ───────────────────────────────────────────────

/**
 * Build abilities scoped to a single domain.
 * Manager routes use "manager" so admin rules don't bleed through.
 */
export function defineAbilitiesFor(
  userId: string,
  roles: string[],
  domain: Domain,
) {
  const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);
  domainBuilders[domain](builder, userId, roles);
  return builder.build();
}
