import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ROLES = {
  ADMIN: "admin",
  ADMIN__SUPER_ADMIN: "admin__super_admin",
  USER: "user",
  USER__PAYING: "user.paying",
  MANAGER: "manager",
  MANAGER__MONEY_HANDLER: "manager.money_handler",
  MANAGER__USER_SUPERVISOR: "manager.user_supervisor",
};

// Extended roles always include their base role
function withBase(...roles: string[]): string[] {
  const result = new Set<string>();
  for (const role of roles) {
    result.add(role);
    const base = role.split("__")[0].split(".")[0];
    if (base !== role) result.add(base);
  }
  return [...result];
}

const users: { name: string; email: string; roles: string[] }[] = [
  // 2 super admins
  {
    name: "Josh Kennedy",
    email: "joshmk93@gmail.com",
    roles: withBase(
      ROLES.ADMIN__SUPER_ADMIN,
      ROLES.MANAGER,
      ROLES.USER__PAYING,
    ),
  },
  {
    name: "Bob Boss",
    email: "bob@example.com",
    roles: withBase(ROLES.ADMIN__SUPER_ADMIN),
  },

  // 2 regular admins
  { name: "Carol Chen", email: "carol@example.com", roles: [ROLES.ADMIN] },
  { name: "Dave Davis", email: "dave@example.com", roles: [ROLES.ADMIN] },

  // 3 managers with extended roles
  {
    name: "Eve Evans",
    email: "eve@example.com",
    roles: withBase(ROLES.MANAGER__MONEY_HANDLER),
  },
  {
    name: "Frank Fisher",
    email: "frank@example.com",
    roles: withBase(ROLES.MANAGER__USER_SUPERVISOR),
  },
  {
    name: "Grace Green",
    email: "grace@example.com",
    roles: withBase(
      ROLES.MANAGER__MONEY_HANDLER,
      ROLES.MANAGER__USER_SUPERVISOR,
    ),
  },

  // 2 plain managers
  { name: "Hank Hill", email: "hank@example.com", roles: [ROLES.MANAGER] },
  { name: "Ivy Ito", email: "ivy@example.com", roles: [ROLES.MANAGER] },

  // 3 paying users
  {
    name: "Jack Jones",
    email: "jack@example.com",
    roles: withBase(ROLES.USER__PAYING),
  },
  {
    name: "Karen Kim",
    email: "karen@example.com",
    roles: withBase(ROLES.USER__PAYING),
  },
  {
    name: "Leo Lee",
    email: "leo@example.com",
    roles: withBase(ROLES.USER__PAYING),
  },

  // 8 regular users
  { name: "Mia Moore", email: "mia@example.com", roles: [ROLES.USER] },
  { name: "Noah Nguyen", email: "noah@example.com", roles: [ROLES.USER] },
  { name: "Olivia Ortiz", email: "olivia@example.com", roles: [ROLES.USER] },
  { name: "Pete Park", email: "pete@example.com", roles: [ROLES.USER] },
  { name: "Quinn Quinn", email: "quinn@example.com", roles: [ROLES.USER] },
  { name: "Rosa Ruiz", email: "rosa@example.com", roles: [ROLES.USER] },
  { name: "Sam Singh", email: "sam@example.com", roles: [ROLES.USER] },
  { name: "Tina Torres", email: "tina@example.com", roles: [ROLES.USER] },
];

const teams = [
  {
    name: "Engineering",
    managerEmails: [
      "joshmk93@gmail.com",
      "eve@example.com",
      "hank@example.com",
    ],
    memberEmails: [
      "jack@example.com",
      "mia@example.com",
      "noah@example.com",
      "olivia@example.com",
    ],
  },
  {
    name: "Finance",
    managerEmails: ["eve@example.com", "ivy@example.com"],
    memberEmails: ["karen@example.com", "leo@example.com", "pete@example.com"],
  },
  {
    name: "Operations",
    managerEmails: ["frank@example.com", "grace@example.com"],
    memberEmails: [
      "quinn@example.com",
      "rosa@example.com",
      "sam@example.com",
      "tina@example.com",
    ],
  },
];

async function main() {
  console.log("Seeding database...");

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, roles: JSON.stringify(user.roles) },
      create: {
        name: user.name,
        email: user.email,
        roles: JSON.stringify(user.roles),
      },
    });
  }

  console.log(`Seeded ${users.length} users`);

  for (const team of teams) {
    const allEmails = [...team.managerEmails, ...team.memberEmails];

    const created = await prisma.team.upsert({
      where: { id: team.name.toLowerCase() },
      update: {
        name: team.name,
        members: { set: allEmails.map((email) => ({ email })) },
      },
      create: {
        id: team.name.toLowerCase(),
        name: team.name,
        members: { connect: allEmails.map((email) => ({ email })) },
      },
    });

    for (const email of team.managerEmails) {
      const manager = await prisma.user.findUnique({ where: { email } });
      if (manager) {
        await prisma.managerTeam.upsert({
          where: { userId_teamId: { userId: manager.id, teamId: created.id } },
          update: {},
          create: { userId: manager.id, teamId: created.id },
        });
      }
    }

    console.log(
      `Seeded team "${team.name}" with ${allEmails.length} members and ${team.managerEmails.length} managers`,
    );
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
