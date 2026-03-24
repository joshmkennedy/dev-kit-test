import Link from "next/link";
import { Text } from "@/lib/copy/text";
import { prisma } from "@/lib/prisma";
import { protect } from "@/lib/protect/protect";

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
        <h1><Text cid="user.page.title" description="Page title for /user">User</Text></h1>
        <p>{user.name}</p>
      </div>

      <Link
        href="/user/profile"
        className="p-3 bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 rounded-md "
      >
        <Text cid="user.page.link.profile" description="Nav link for /user/profile">
          Profile
        </Text>


      </Link>
        <p>
          <Text cid="user.page.page-description" description="a page header description on the users profile page or something" >some random text that is not editable yet....</Text>
        </p>
    </div>
  );
}
