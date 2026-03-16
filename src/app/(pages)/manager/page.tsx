import { protect } from "@/lib/protect/protect";
import Link from "next/link";

export default async function Manager() {
  await protect("manager", "read", "Team");

  return (
    <Link
      href="/manager/my-teams"
      className="p-2 px-8 bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 rounded-md "
    >
      My Teams
    </Link>
  );
}
