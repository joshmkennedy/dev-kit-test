import Link from "next/link";
import { notFound } from "next/navigation";
import { Text } from "@/lib/copy/text";
import { prisma } from "@/lib/prisma";
import { protect } from "@/lib/protect/protect";

export default async function User({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await protect("admin", "read", "User");

  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    return notFound();
  }
  return (
    <div>
      <Link href="/admin/users">&larr; Users</Link>
      <h1>
        <Text cid="user.page.title">User</Text>
				<Text cid="demo.for.cms">Demo for CMS</Text>
      </h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
