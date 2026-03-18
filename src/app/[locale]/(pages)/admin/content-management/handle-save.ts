"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { protect } from "@/lib/protect/protect";

export async function updateCopy(copyId: string, locale: string, content: string) {
  await protect("admin", "manage", "all");
  await prisma.translation.upsert({
    where: {
      
      copyId_locale: { copyId, locale },
    },
    create: { copyId, locale, content },
    update: { content },
  });
  revalidatePath("/");
  return { copyId, locale, content };
}

export async function addLocale(code: string, name: string) {
  await prisma.supportedLocale.create({ data: { code, name } });
  revalidatePath("/");
  return { code, name };
}

export async function removeLocale(code: string) {
  await prisma.$transaction([
    prisma.translation.deleteMany({ where: { locale: code } }),
    prisma.supportedLocale.delete({ where: { code } }),
  ]);
  revalidatePath("/");
  return { code };
}
