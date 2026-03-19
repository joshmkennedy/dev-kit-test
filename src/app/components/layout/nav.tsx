import Link from "next/link";
import { type Domain, defineAbilitiesFor } from "@/lib/abilities";
import { auth } from "@/lib/auth";
import { t } from "@/lib/copy/t";

export async function Nav() {
  const navItems = [
    {
      label: await t("nav.item.admin", "Admin", "admin nav item"),
      href: "/admin",
      domain: "admin" as Domain,
      action: "manage",
      subject: "all" as const,
    },
    {
      label: t("nav.item.manager", "Manager", "manager nav item"),
      href: "/manager",
      domain: "manager" as Domain,
      action: "read",
      subject: "Team" as const,
    },
    {
      label:t( "nav.item.dashboard", "Dashboard", "dashboard nav item"),
      href: "/user",
      domain: "user" as Domain,
      action: "read",
      subject: "User" as const,
    },
  ];
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
