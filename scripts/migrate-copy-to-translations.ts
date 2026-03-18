import { prisma } from "@/lib/prisma";

async function main() {
  const copies = await prisma.copy.findMany();

  let migrated = 0;
  for (const copy of copies) {
    if (!copy.content) continue;

    await prisma.translation.upsert({
      where: { copyId_locale: { copyId: copy.id, locale: "en" } },
      create: { copyId: copy.id, locale: "en", content: copy.content },
      update: {},
    });
    migrated++;
  }

  console.log(`Migrated ${migrated} copy entries to translations`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
