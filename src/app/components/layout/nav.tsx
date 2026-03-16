import Link from "next/link";
import { auth } from "@/lib/auth";
import { type Domain, defineAbilitiesFor } from "@/lib/abilities";

const navItems = [
  { label: "Admin", href: "/admin", domain: "admin" as Domain, action: "manage", subject: "all" as const },
  { label: "Manager", href: "/manager", domain: "manager" as Domain, action: "read", subject: "Team" as const },
  { label: "Dashboard", href: "/user", domain: "user" as Domain, action: "read", subject: "User" as const },
];

export async function Nav() {
  const session = await auth();
  if (!session?.user) return null;

  const roles = session.user.roles ?? [];
  const visible = navItems.filter((item) => {
    const ability = defineAbilitiesFor(session.user.id, roles, item.domain);
    return ability.can(item.action, item.subject);
  });

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
