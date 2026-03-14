import { redirect, unauthorized } from "next/navigation";
import type { Session } from "next-auth";
import { auth } from "../auth";
import { prisma } from "../prisma";
import { matchPolicy } from "./policy";
import { scopeBuilders } from "./scope-builders";

export async function protect(
  resource: string,
  params?: Record<string, string>,
): Promise<Session> {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const policy = matchPolicy(resource);

  if (!policy) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`No policy for resource "${resource}" — denied by default`);
    }
    unauthorized();
  }

  // Role gate
  const userRoles = session.user.roles ?? [];
  const hasRole = policy.roles.some((r) => userRoles.includes(r));
  if (!hasRole) {
    unauthorized();
  }

  // Scope gate
  if (policy.scope && policy.scope in scopeBuilders) {
    const resourceId = policy.resourceParam
      ? params?.[policy.resourceParam]
      : undefined;
    const where = scopeBuilders[policy.scope](session.user.id, resourceId);

    const authorized = await prisma.user.findUnique({
      where: { email: session.user.email!, AND: where },
      select: { id: true },
    });
    if (!authorized) {
      unauthorized();
    }
  }

  return session;
}

/**
 * Check if a user's roles grant access to a resource.
 * Pure role check — no DB call, no redirect. For UI visibility decisions.
 */
export function can(userRoles: string[], resource: string): boolean {
  const policy = matchPolicy(resource);
  if (!policy) return false;
  return policy.roles.some((r) => userRoles.includes(r));
}
