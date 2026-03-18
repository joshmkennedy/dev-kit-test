import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { protect } from "@/lib/protect/protect";
import { FieldTranslations } from "./field-translations";
import { BackButton } from "./back-button";

export const dynamic = "force-dynamic";

export default async function FieldDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await protect("admin", "read", "all");

  const { id } = await params;
  const copyId = decodeURIComponent(id);

  const [copy, locales] = await Promise.all([
    prisma.copy.findUnique({
      where: { id: copyId },
      include: { translations: true },
    }),
    prisma.supportedLocale.findMany({ orderBy: { code: "asc" } }),
  ]);

  if (!copy) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <BackButton />
        <h1 className="text-3xl mt-2 font-semibold">Field</h1>
        <code className="text-sm text-blue-400/80">{copy.id}</code>
        {copy.description && (
          <p className="text-foreground/50 text-sm mt-1">{copy.description}</p>
        )}
      </div>

      <FieldTranslations
        copyId={copy.id}
        translations={copy.translations}
        locales={locales}
      />
    </div>
  );
}
