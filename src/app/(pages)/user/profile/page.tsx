import { protect } from "@/lib/protect/protect";
import Link from "next/link";

export default async function UserProfile() {
  await protect("user", "read", "User");

  return (
    <div>
      <Link href="/user">&larr; User</Link>
      <h1>User Profile</h1>
    </div>
  );
}
