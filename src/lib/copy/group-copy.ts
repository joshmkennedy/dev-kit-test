import type { Copy, Translation } from "@/generated/prisma/client";

export type CopyWithTranslations = Copy & { translations: Translation[] };

export type GroupedCopy = {
  pages: Record<string, CopyWithTranslations[]>;
  components: Record<string, CopyWithTranslations[]>;
};

/**
 * Groups copy entries by deriving type from CID naming conventions:
 * - CIDs containing ".page." or ".page-" → page copy, route from segments before "page"
 * - Everything else → component copy, grouped by first CID segment
 */
export function groupCopy(copies: CopyWithTranslations[]): GroupedCopy {
  const pages: Record<string, CopyWithTranslations[]> = {};
  const components: Record<string, CopyWithTranslations[]> = {};

  for (const copy of copies) {
    const segments = copy.id.split(".");
    const pageIndex = segments.findIndex(
      (s) => s === "page" || s.startsWith("page-"),
    );

    if (pageIndex > 0) {
      const route = `/${segments.slice(0, pageIndex).join("/")}`;
      if (!pages[route]) pages[route] = [];
      pages[route].push(copy);
    } else {
      const group = segments[0];
      if (!components[group]) components[group] = [];
      components[group].push(copy);
    }
  }

  return { pages, components };
}
