"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateCopy(copyId: string, locale: string, content: string) {
  await prisma.translation.upsert({
    where: { copyId_locale: { copyId, locale } },
    create: { copyId, locale, content },
    update: { content },
  });
  revalidatePath("/");
  return { copyId, locale, content };
}
