import { Text } from "@/lib/copy/text";
import { protect } from "@/lib/protect/protect";
import Link from "next/link";

export default async function Admin() {
  await protect("admin", "manage", "all");

  return (
    <div className="flex flex-col gap-4 items-start">
      <div className="">
        <h1>
          <Text cid="admin.page.title">Admin</Text>
        </h1>
        <p>
          <Text cid="admin.page.description-forrealsies" description="Admin page description">
            For all you admining needs
          </Text>
        </p>
      </div>
      <Link
        href="/admin/users"
        className="p-3 bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 rounded-md "
      >
        Users
      </Link>

      <Link
        href="/admin/content-management"
        className="p-3 bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 rounded-md "
      >
        <Text cid="admin.page.link.content-management">Content Management</Text>
      </Link>
    </div>
  );
}
