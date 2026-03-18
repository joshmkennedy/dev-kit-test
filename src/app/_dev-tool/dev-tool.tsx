"use client";
import { memo, type ReactNode, useState } from "react";

type TabConfig = {
  name: string;
  id: string;
  icon: string;
  panel: ReactNode;
};

export const DevTool = memo(function DevTool({ tabs }: { tabs: TabConfig[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);

  return (
    <div className="fixed bottom-10 right-10 flex gap-4 items-center z-10">
      <button
        type="button"
        onClick={() => setIsOpen((s) => !s)}
        className="w-12 h-12 flex justify-center items-center font-bold rounded-full aspect-square cursor-pointer hover:bg-white/10"
      >
        {"< />"}
      </button>

      {/* PANEL */}
      {isOpen && (
        <div className="absolute bottom-0 right-[calc(100%+1rem)] flex flex-col gap-0 p-4 rounded-md min-w-150 dark:bg-gray-800 bg-gray-100">
          <header className="flex items-center gap-4 p-1 rounded-md">
            <button type="button" onClick={() => setIsOpen(false)}>
              &times;
            </button>
            <h1>Dev Tool Smool</h1>
          </header>

          <div className="flex">
            <div className="flex flex-col gap-1 rounded-md min-w-10 dark:bg-gray-800 bg-gray-100">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`p-2 rounded-md ${activeTabId === tab.id
                      ? "bg-purple-100 text-purple-800"
                      : ""
                    } w-full text-left`}
                >
                  {tab.icon} {tab.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4 p-4 flex-1 w-full">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={activeTabId === tab.id ? "" : "hidden"}
                >
                  {tab.panel}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
