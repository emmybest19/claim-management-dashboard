"use client";

import { PanelLeft, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useWorkbenchStore } from "@/store/workbenchStore";
import { TabIcon } from "./TabIcon";
import { TabsMenu } from "./TabsMenu";

export function TabBar({ hydrated }: { hydrated: boolean }) {
  const openTabs = useWorkbenchStore((s) => s.openTabs);
  const activeTabId = useWorkbenchStore((s) => s.activeTabId);
  const sidebarOpen = useWorkbenchStore((s) => s.sidebarOpen);
  const setActiveTab = useWorkbenchStore((s) => s.setActiveTab);
  const closeTab = useWorkbenchStore((s) => s.closeTab);
  const moveTab = useWorkbenchStore((s) => s.moveTab);
  const toggleSidebar = useWorkbenchStore((s) => s.toggleSidebar);

  const stripRef = useRef<HTMLDivElement>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  // Keep the active tab visible when it changes (opened from sidebar/menu).
  useEffect(() => {
    if (!activeTabId) return;
    const el = stripRef.current?.querySelector<HTMLElement>(
      `[data-tab-id="${CSS.escape(activeTabId)}"]`,
    );
    el?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activeTabId, openTabs.length]);

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  function onTabKeyDown(e: React.KeyboardEvent, index: number) {
    let next = -1;
    if (e.key === "ArrowRight") next = (index + 1) % openTabs.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + openTabs.length) % openTabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = openTabs.length - 1;
    else if (e.key === "Delete" && openTabs[index].closable) {
      e.preventDefault();
      closeTab(openTabs[index].id);
      return;
    }
    if (next === -1) return;
    e.preventDefault();
    const tab = openTabs[next];
    setActiveTab(tab.id);
    stripRef.current?.querySelector<HTMLElement>(`[data-tab-id="${CSS.escape(tab.id)}"]`)?.focus();
  }

  return (
    <div className="flex h-9 shrink-0 items-stretch border-b border-line bg-tabbar">
      {!sidebarOpen && (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Expand sidebar"
          title="Expand sidebar"
          className="flex w-9 shrink-0 items-center justify-center border-r border-line text-subtle outline-none hover:bg-hover hover:text-fg focus-visible:bg-hover"
        >
          <PanelLeft className="size-4" />
        </button>
      )}

      <div
        ref={stripRef}
        role="tablist"
        aria-label="Open tabs"
        className="scrollbar-none flex min-w-0 flex-1 items-stretch overflow-x-auto"
        onWheel={(e) => {
          // Let a vertical mouse wheel scroll the strip horizontally.
          if (e.deltaY !== 0 && stripRef.current) stripRef.current.scrollLeft += e.deltaY;
        }}
      >
        {hydrated &&
          openTabs.map((tab, index) => {
            const active = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                data-tab-id={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={active}
                aria-controls={`panel-${tab.id}`}
                tabIndex={active ? 0 : -1}
                title={tab.title}
                draggable
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => onTabKeyDown(e, index)}
                onAuxClick={(e) => {
                  // Middle-click closes, like a browser or editor.
                  if (e.button === 1 && tab.closable) {
                    e.preventDefault();
                    closeTab(tab.id);
                  }
                }}
                onMouseDown={(e) => {
                  if (e.button === 1) e.preventDefault(); // suppress autoscroll
                }}
                onDragStart={(e) => {
                  setDragId(tab.id);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(e) => {
                  if (!dragId || dragId === tab.id) return;
                  e.preventDefault();
                  moveTab(dragId, tab.id);
                }}
                onDragEnd={() => setDragId(null)}
                className={`group relative flex max-w-56 min-w-0 shrink-0 cursor-pointer items-center gap-2 border-r border-line pr-1.5 pl-3 text-[13px] outline-none select-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-inset ${
                  active ? "bg-canvas text-fg" : "text-muted hover:bg-hover hover:text-fg"
                } ${dragId === tab.id ? "opacity-50" : ""}`}
              >
                {active && <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-accent" />}
                <TabIcon tab={tab} className={`size-3.5 shrink-0 ${active ? "text-accent" : ""}`} />
                <span className="truncate">{tab.title}</span>
                {tab.closable && (
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                    aria-label={`Close ${tab.title}`}
                    title="Close"
                    className={`flex size-5 shrink-0 items-center justify-center rounded hover:bg-hover hover:text-fg ${
                      active ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                    }`}
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            );
          })}
      </div>

      <TabsMenu />
    </div>
  );
}
