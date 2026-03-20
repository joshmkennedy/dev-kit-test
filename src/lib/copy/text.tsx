import type { CopyId } from "@/generated/copy-ids";
import { EditableText } from "./editable-text";
import { t } from "./t";
import { auth } from "../auth";

export async function Text({ cid, children, description }: { cid: CopyId; children: string; description?: string }) {
  const content = await t(cid, children, description);
	
  const session = await auth();
  if (!session?.user) return null;
	const sessionRoles = session.user.roles ?? [];
	
	if (sessionRoles.includes("admin")) {
		return <EditableText text={content} cid={cid} />;
	}

  return <>{content}</>;
}

