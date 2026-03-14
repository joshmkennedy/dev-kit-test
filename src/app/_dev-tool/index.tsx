import { DevTool } from "./dev-tool";
import { tabs } from "./tabs";

export function DevToolWrapper() {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <DevTool
      tabs={tabs.map((t) => ({
        name: t.name,
        id: t.id,
        icon: t.icon,
        panel: t.panel,
      }))}
    />
  );
}
