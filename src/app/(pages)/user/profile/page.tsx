import { protect } from "@/lib/protect/protect";
import Link from "next/link";

export default async function UserProfile() {
  await protect("user.profile");

  return (
    <div>
      <Link href="/user">&larr; User</Link>
      <h1>User Profile</h1>
    </div>
  );
}
