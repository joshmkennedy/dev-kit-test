import Link from "next/link";
import { Text } from "@/lib/copy/text";
import { protect } from "@/lib/protect/protect";

export default async function UserProfile() {
  await protect("user", "read", "User");

  return (
    <div>
      <Link href="/user">&larr; 
        <Text cid="user.profile.page.link.back" description="Nav link for /user">
          User
        </Text>
      </Link>
      <h1>User Profile</h1>
    </div>
  );
}
