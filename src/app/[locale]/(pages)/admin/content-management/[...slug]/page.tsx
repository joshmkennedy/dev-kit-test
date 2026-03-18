import Link from "next/link";
import { notFound } from "next/navigation";
import { type CopyWithTranslations, groupCopy } from "@/lib/copy/group-copy";
import { prisma } from "@/lib/prisma";
import { protect } from "@/lib/protect/protect";
import { CopyTable } from "./copy-table";
import { Text } from "@/lib/copy/text";

export const dynamic = "force-dynamic";

export default async function ContentDetail({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  await protect("admin", "read", "all");

  const { slug } = await params;
  const [type, ...rest] = slug;

  if (type !== "pages" && type !== "components") {
    notFound();
  }

  const [data, supportedLocales] = await Promise.all([
    prisma.copy.findMany({ include: { translations: true } }),
    prisma.supportedLocale.findMany(),
  ]);
  const grouped = groupCopy(data);
  const locales = supportedLocales.map((l) => l.code);

  let entries: CopyWithTranslations[];
  let title: string;

  if (type === "pages") {
    const route = `/${rest.join("/")}`;
    entries = grouped.pages[route];
    title = route;
  } else {
    const name = rest[0];
    entries = grouped.components[name];
    title = name;
  }

  if (!entries) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/content-management"
          className="text-sm text-blue-400 hover:underline"
        >
          &larr; <Text cid="admin.content-slug.page.backlink" description="Content Editor back link to all content">Content Management</Text>
        </Link>
        <h1 className="text-4xl mt-2">{title}</h1>
        <p className="text-foreground/60 mt-1">
          {type === "pages" ? "Page" : "Component"} &middot; {entries.length}{" "}
          {entries.length === 1 ? "entry" : "entries"}
        </p>
      </div>
      <CopyTable entries={entries} locales={locales} />
    </div>
  );
}
