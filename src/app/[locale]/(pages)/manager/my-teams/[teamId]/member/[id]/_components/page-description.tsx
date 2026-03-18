"use client";

import React, { use } from "react";
import { getAllCopyMap } from "@/lib/copy/get-all-copy";

export function PageDescription() {
  const [date, setDate] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4 items-start">
      <div>
        <h1 suppressHydrationWarning={true}>
          <Text cid="team-member.page-description.more"  fallback="page description" description="page description"/>{" "}
          {date.toLocaleString()}
        </h1>
      </div>
    </div>
  );
}

function Text({cid, fallback}:{cid:import("@/generated/copy-ids").CopyId, fallback:string, description:string}) {
  const [ content, setContent ] = React.useState("");
  const [ copyPromise, setCopyPromise ] = React.useState<Promise<Record<string, string>>|undefined>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Shut up biome
  React.useEffect(() => {
    setCopyPromise(getAllCopyMap());
  },[]);
  if(copyPromise && content.length === 0) {
    const map = use(copyPromise);
    setContent(map[cid] ?? fallback);
  }
  return <>{content}</>;
}
