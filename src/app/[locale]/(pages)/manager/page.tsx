import Link from "next/link";
import { Text } from "@/lib/copy/text";
import { protect } from "@/lib/protect/protect";

export default async function Manager() {
  await protect("manager", "read", "Team");

  return (
    <Link
      href="/manager/my-teams"
      className="p-2 px-8 bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 rounded-md "
    >
      <Text cid="manager.page.link.my-teams" description="Nav link for /manager/my-teams">
        My Teams
      </Text>
    </Link>
  );
}
