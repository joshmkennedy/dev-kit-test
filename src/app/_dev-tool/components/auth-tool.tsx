import { auth, ROLES } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/app/components/data-table";
import { columns } from "./auth-columns";
import { updateManagedTeams, updateRoles } from "./auth-tool-actions";

export async function AuthTool() {
  const session = await auth();
  if (!session) {
    return <div>No session</div>;
  }

  const [user, allTeams] = await Promise.all([
    prisma.user.findUnique({
      where: { email: session.user?.email ?? "" },
      include: {
        managedTeams: {
          select: { teamId: true },
        },
      },
    }),
    prisma.team.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!user) {
    return <div>No user</div>;
  }

  const currentRoles = JSON.parse(user.roles) as string[];
  const currentTeamIds = user.managedTeams.map((mt) => mt.teamId);

  const allRoles = Object.values(ROLES).map((role) => ({
    id: role,
    label: role,
  }));

  const teamOptions = allTeams.map((t) => ({ id: t.id, label: t.name }));

  const rows = [
    { key: "Name", value: user.name },
    { key: "Email", value: user.email },
    {
      key: "Roles",
      value: currentRoles.join(", "),
      editable: {
        label: "Select roles",
        options: allRoles,
        selected: currentRoles,
        onSave: updateRoles,
      },
    },
    {
      key: "Managed Teams",
      value: currentTeamIds.length ? currentTeamIds.join(", ") : "None",
      editable: {
        label: "Select teams",
        options: teamOptions,
        selected: currentTeamIds,
        onSave: updateManagedTeams,
      },
    },
  ];

  return (
    <div>
      <h1>Auth Tool</h1>
      <DataTable columns={columns} data={rows} />
    </div>
  );
}
