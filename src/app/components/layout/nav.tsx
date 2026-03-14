import Link from "next/link";
import { auth } from "@/lib/auth";
import { can } from "@/lib/protect/protect";

const navItems = [
  { label: "Admin", href: "/admin", resource: "admin" },
  { label: "Manager", href: "/manager", resource: "manager" },
  { label: "Dashboard", href: "/user", resource: "user" },
];

export async function Nav() {
  const session = await auth();
  if (!session?.user) return null;

  const userRoles = session.user.roles ?? [];
  const visible = navItems.filter((item) => can(userRoles, item.resource));

  if (visible.length === 0) return null;

  return (
    <nav className="flex flex-col gap-1">
      {visible.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="px-3 py-2 rounded-md text-sm hover:bg-white/10 transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
