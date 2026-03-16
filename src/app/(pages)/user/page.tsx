import { prisma } from "@/lib/prisma";
import { protect } from "@/lib/protect/protect";
import Link from "next/link";

export default async function User() {
  const { session } = await protect("user", "read", "User");

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!,
    },
  });
  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="flex flex-col gap-4 items-start">
      <div>
        <h1>User</h1>
        <p>{user.name}</p>
      </div>

      <Link
        href="/user/profile"
        className="p-3 bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 rounded-md "
      >
        Profile
      </Link>
    </div>
  );
}
