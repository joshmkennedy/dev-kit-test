import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import type { CopyText } from "./extracty-copy";

async function main() {
  const generatedCopy = await fs.readFile(
    path.join(__dirname, "../src/generated/copy.json"),
    "utf8",
  );
  try {
    const copy = JSON.parse(generatedCopy) as CopyText[];

    for (const c of copy) {
      console.log(`Seeding ${c.id}`);
      await prisma.copy.upsert({
        where: { id: c.id },
        create: { id: c.id, description: c.description },
        update: { description: c.description },
      });
      await prisma.translation.upsert({
        where: { copyId_locale: { copyId: c.id, locale: "en" } },
        create: { copyId: c.id, locale: "en", content: c.content },
        update: {},
      });
    }
    // Delete copy entries that are no longer used in the codebase
    const activeIds = copy.map((c) => c.id);
    const { count } = await prisma.copy.deleteMany({
      where: { id: { notIn: activeIds } },
    });
    if (count > 0) {
      console.log(`Cleaned up ${count} unused copy entries`);
    }

    console.log("Seeded copy");
  } catch (e) {
    console.error("Failed to seed copy", e);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
