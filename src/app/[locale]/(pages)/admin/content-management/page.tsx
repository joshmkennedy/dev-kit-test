import Link from "next/link";
import { groupCopy } from "@/lib/copy/group-copy";
import { Text } from "@/lib/copy/text";
import { prisma } from "@/lib/prisma";
import { protect } from "@/lib/protect/protect";

export const dynamic = "force-dynamic";

export default async function ContentManagement() {
  await protect("admin", "read", "all");
  const data = await prisma.copy.findMany({ include: { translations: true } });
  const grouped = groupCopy(data);

  const pages = Object.entries(grouped.pages).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  const components = Object.entries(grouped.components).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-6xl">
					<Text cid="admin.content-mgmt.page.title" description="Admin Content Management Page title">Content Management</Text>
				</h1>
        <p className="text-xl mt-2">
          <Text cid="admin.content-mgmt.page.description" description="a description for that top level Admin Content Management Page girl..."> Manage all copy entries across your application.</Text>
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Pages</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 font-medium text-foreground/60">
                Route
              </th>
              <th className="px-4 py-3 font-medium text-foreground/60">
                Entries
              </th>
            </tr>
          </thead>
          <tbody>
            {pages.map(([route, entries]) => (
              <tr
                key={route}
                className="border-b border-white/5 hover:bg-white/5"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/content-management/pages${route}`}
                    className="text-blue-400 hover:underline"
                  >
                    {route}
                  </Link>
                </td>
                <td className="px-4 py-3 text-foreground/60">
                  {entries.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Components</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 font-medium text-foreground/60">
                Component
              </th>
              <th className="px-4 py-3 font-medium text-foreground/60">
                Entries
              </th>
            </tr>
          </thead>
          <tbody>
            {components.map(([name, entries]) => (
              <tr
                key={name}
                className="border-b border-white/5 hover:bg-white/5"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/content-management/components/${name}`}
                    className="text-blue-400 hover:underline"
                  >
                    {name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-foreground/60">
                  {entries.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
