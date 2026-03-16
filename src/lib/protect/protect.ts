import { redirect, unauthorized } from "next/navigation";
import type { Session } from "next-auth";
import { auth } from "../auth";
import {
  type AppAbility,
  type Domain,
  defineAbilitiesFor,
} from "../abilities";

export type ProtectResult = {
  session: Session;
  ability: AppAbility;
};

type SubjectName = "User" | "Team" | "all";

export async function protect(
  domain: Domain,
  action: string,
  subject: SubjectName,
): Promise<ProtectResult> {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const ability = defineAbilitiesFor(
    session.user.id,
    session.user.roles ?? [],
    domain,
  );

  if (!ability.can(action, subject)) {
    unauthorized();
  }

  return { session, ability };
}
