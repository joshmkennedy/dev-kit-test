/** biome-ignore-all assist/source/organizeImports: no good */
import { prisma } from "@/lib/prisma";
import { protect } from "@/lib/protect/protect";
import { DataTable } from "@/app/components/data-table";
import { columns, type UserRow } from "./components/columns";
import Link from "next/link";

export default async function Users() {
  await protect("admin", "read", "User");

  const users = await prisma.user.findMany({
    take: 20,
    orderBy: {
      createdAt: "desc",
    },
    skip: 0,
  });
  const data: UserRow[] = users
    .filter((u) => u.id && u.email && u.name)
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
    })) as UserRow[];

  return (
    <div>
      <Link href="/admin">&larr; Admin</Link>
      <h1>Users</h1>
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
