import { type ReactNode, Suspense } from "react";
import { AuthTool } from "./components/auth-tool";
import { PageTool } from "./components/page-tool";

export type Tab = {
  name: string;
  id: string;
  icon: string;
  panel: ReactNode;
};

export const tabs: Tab[] = [
  {
    name: "Auth",
    id: "nextauth",
    icon: "🔐",
    panel: (
      <Suspense fallback={<div>Loading...</div>}>
        <AuthTool />
      </Suspense>
    ),
  },
  {
    name: "Page",
    id: "page",
    icon: "📄",
    panel: <PageTool />,
  },
  {
    name: "Prisma",
    id: "prisma",
    icon: "💾",
    panel: <div>Prisma</div>,
  },
];
