import { protect } from "@/lib/protect/protect";
import Link from "next/link";

export default async function Admin() {
  await protect("admin");

  return (
    <div className="flex flex-col gap-4 items-start">
      <div className="">
        <h1>Admin</h1>
      </div>
      <Link
        href="/admin/users"
        className="p-3 bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 rounded-md "
      >
        Users
      </Link>
    </div>
  );
}
