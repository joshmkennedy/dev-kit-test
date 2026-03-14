import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import { prisma } from "./prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: string[];
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      session.user.roles = JSON.parse(
        (user as unknown as { roles: string }).roles,
      );
      return session;
    },
  },
});

export const ROLES = {
  ADMIN: "admin",
  ADMIN__SUPER_ADMIN: "admin__super_admin",

  USER: "user",
  USER__PAYING: "user.paying",

  MANAGER: "manager",
  MANAGER__MONEY_HANDLER: "manager.money_handler",
  MANAGER__USER_SUPERVISOR: "manager.user_supervisor",
};
