"use client";

import { PanelLeftClose } from "lucide-react";
import { MODULE_BY_ID, sectionTabId, tabForSection } from "@/lib/workbench/modules";
import { useWorkbenchStore } from "@/store/workbenchStore";

export function SecondarySidebar() {
  const activeModule = useWorkbenchStore((s) => s.activeModule);
  const sidebarOpen = useWorkbenchStore((s) => s.sidebarOpen);
  const activeTabId = useWorkbenchStore((s) => s.activeTabId);
  const openTabIds = useWorkbenchStore((s) => s.openTabs.map((t) => t.id).join("|"));
  const openTab = useWorkbenchStore((s) => s.openTab);
  const toggleSidebar = useWorkbenchStore((s) => s.toggleSidebar);

  const mod = activeModule ? MODULE_BY_ID[activeModule] : null;
  if (!sidebarOpen || !mod) return null;

  const openIds = new Set(openTabIds.split("|"));

  return (
    <aside
      aria-label={`${mod.label} sections`}
      className="flex w-60 shrink-0 flex-col border-r border-line bg-panel"
    >
      <header className="flex h-9 shrink-0 items-center justify-between pr-1 pl-4">
        <h2 className="text-[11px] font-semibold tracking-wider text-muted uppercase">
          {mod.label}
        </h2>
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
          className="flex size-7 items-center justify-center rounded text-subtle outline-none hover:bg-hover hover:text-fg focus-visible:bg-hover"
        >
          <PanelLeftClose className="size-4" />
        </button>
      </header>

      <div className="scrollbar-thin flex-1 overflow-y-auto pb-3">
        {mod.groups.map((group, gi) => (
          <div key={group.label ?? gi} className={gi > 0 ? "mt-3" : undefined}>
            {group.label && (
              <h3 className="px-4 pb-1 text-[11px] font-medium text-subtle">{group.label}</h3>
            )}
            <ul>
              {group.sections.map((section) => {
                const id = sectionTabId(mod.id, section.id);
                const isActive = id === activeTabId;
                const isOpen = openIds.has(id);
                const Icon = section.icon;
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => openTab(tabForSection(mod.id, section))}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex h-8 w-full items-center gap-2.5 pr-3 pl-4 text-left text-[13px] outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-inset ${
                        isActive ? "bg-selected text-fg" : "text-fg/85 hover:bg-hover"
                      }`}
                    >
                      <Icon
                        className={`size-4 shrink-0 ${isActive ? "text-accent" : "text-muted"}`}
                        strokeWidth={1.75}
                      />
                      <span className="truncate">{section.label}</span>
                      {isOpen && !isActive && (
                        <span
                          aria-label="open in a tab"
                          className="ml-auto size-1.5 shrink-0 rounded-full bg-subtle"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
