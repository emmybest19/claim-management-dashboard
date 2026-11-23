"use client";

import { LayoutDashboard, List } from "lucide-react";
import { VIEWS } from "@/components/views/registry";
import { findSection, tabForSection } from "@/lib/workbench/modules";
import { useWorkbenchStore } from "@/store/workbenchStore";
import { TabBar } from "./TabBar";

export function MainCanvas({ hydrated }: { hydrated: boolean }) {
  const openTabs = useWorkbenchStore((s) => s.openTabs);
  const activeTabId = useWorkbenchStore((s) => s.activeTabId);

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-canvas">
      <TabBar hydrated={hydrated} />
      <div className="relative min-h-0 flex-1">
        {hydrated && openTabs.length === 0 && <EmptyCanvas />}
        {/*
          Every open tab stays mounted and inactive ones are hidden, so each view
          keeps its own scroll position, filters and form state between switches.
        */}
        {hydrated &&
          openTabs.map((tab) => {
            const View = VIEWS[tab.view];
            const active = tab.id === activeTabId;
            return (
              <section
                key={tab.id}
                id={`panel-${tab.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${tab.id}`}
                hidden={!active}
                className="scrollbar-thin absolute inset-0 overflow-auto"
              >
                {View ? (
                  <View tab={tab} />
                ) : (
                  <div className="p-6 text-sm text-danger">Unknown view: {tab.view}</div>
                )}
              </section>
            );
          })}
      </div>
    </main>
  );
}

function EmptyCanvas() {
  const openTab = useWorkbenchStore((s) => s.openTab);
  const shortcuts = [
    { section: "overview", icon: LayoutDashboard },
    { section: "list", icon: List },
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-6 text-center">
      <div>
        <p className="text-base font-semibold">No tabs open</p>
        <p className="mt-1 text-[13px] text-muted">
          Pick a section from the sidebar, or jump straight in:
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {shortcuts.map(({ section, icon: Icon }) => {
          const s = findSection("claims", section)!;
          return (
            <button
              key={section}
              type="button"
              onClick={() => openTab(tabForSection("claims", s))}
              className="flex h-9 items-center gap-2 rounded-md border border-line bg-panel px-3 text-[13px] outline-none hover:bg-hover focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Icon className="size-4 text-accent" strokeWidth={1.75} />
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
