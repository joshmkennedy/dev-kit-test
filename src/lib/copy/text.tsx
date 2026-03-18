import type { CopyId } from "@/generated/copy-ids";
import { t } from "./t";

export async function Text({ cid, children, description }: { cid: CopyId; children: string; description?: string }) {
  const content = await t(cid, children, description);
  return <>{content}</>;
}
