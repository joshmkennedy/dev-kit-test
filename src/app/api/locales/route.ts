import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const locales = await prisma.supportedLocale.findMany();
  return NextResponse.json(locales);
}
