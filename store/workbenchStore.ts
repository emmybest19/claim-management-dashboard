"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ModuleId, Tab } from "@/types/workbench";
import {
  DEFAULT_MODULE,
  DEFAULT_TABS,
  MODULE_BY_ID,
  findSection,
  sectionTabId,
} from "@/lib/workbench/modules";

type WorkbenchState = {
  activeModule: ModuleId | null;
  sidebarOpen: boolean;
  openTabs: Tab[];
  activeTabId: string | null;
};

type WorkbenchActions = {
  /** Icon bar click. Clicking the active module again toggles the sidebar (VS Code behaviour). */
  selectModule: (module: ModuleId) => void;
  toggleSidebar: () => void;
  /** Opens the tab, or focuses it if a tab with the same id is already open. */
  openTab: (tab: Tab) => void;
  setActiveTab: (id: string) => void;
  closeTab: (id: string) => void;
  closeOthers: (id: string) => void;
  closeAll: () => void;
  moveTab: (fromId: string, toId: string) => void;
};

export type WorkbenchStore = WorkbenchState & WorkbenchActions;

const initialState: WorkbenchState = {
  activeModule: DEFAULT_MODULE,
  sidebarOpen: true,
  openTabs: DEFAULT_TABS,
  activeTabId: DEFAULT_TABS[0]?.id ?? null,
};

export const STORAGE_KEY = "claims-workbench:v1";

export const useWorkbenchStore = create<WorkbenchStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      selectModule: (module) => {
        const { activeModule, sidebarOpen } = get();
        if (module === activeModule) {
          set({ sidebarOpen: !sidebarOpen });
        } else {
          set({ activeModule: module, sidebarOpen: true });
        }
      },

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      openTab: (tab) =>
        set((s) => {
          const exists = s.openTabs.some((t) => t.id === tab.id);
          return {
            openTabs: exists ? s.openTabs : [...s.openTabs, tab],
            activeTabId: tab.id,
          };
        }),

      setActiveTab: (id) => {
        const tab = get().openTabs.find((t) => t.id === id);
        if (!tab) return;
        // Keep the sidebar in sync with the focused tab's module.
        set({ activeTabId: id, activeModule: tab.module });
      },

      closeTab: (id) =>
        set((s) => {
          const index = s.openTabs.findIndex((t) => t.id === id);
          if (index === -1 || !s.openTabs[index].closable) return s;
          const openTabs = s.openTabs.filter((t) => t.id !== id);
          let activeTabId = s.activeTabId;
          if (activeTabId === id) {
            // Focus the right neighbour, else the left one — like an editor.
            const next = openTabs[index] ?? openTabs[index - 1];
            activeTabId = next?.id ?? null;
          }
          return { openTabs, activeTabId };
        }),

      closeOthers: (id) =>
        set((s) => ({
          openTabs: s.openTabs.filter((t) => t.id === id || !t.closable),
          activeTabId: s.openTabs.some((t) => t.id === id) ? id : s.activeTabId,
        })),

      closeAll: () =>
        set((s) => {
          const openTabs = s.openTabs.filter((t) => !t.closable);
          return { openTabs, activeTabId: openTabs[0]?.id ?? null };
        }),

      moveTab: (fromId, toId) =>
        set((s) => {
          if (fromId === toId) return s;
          const from = s.openTabs.findIndex((t) => t.id === fromId);
          const to = s.openTabs.findIndex((t) => t.id === toId);
          if (from === -1 || to === -1) return s;
          const openTabs = [...s.openTabs];
          const [moved] = openTabs.splice(from, 1);
          openTabs.splice(to, 0, moved);
          return { openTabs };
        }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Rehydrated manually after mount (see useHydrateWorkbench) so the
      // server-rendered HTML and the first client render match.
      skipHydration: true,
      partialize: ({ activeModule, sidebarOpen, openTabs, activeTabId }) => ({
        activeModule,
        sidebarOpen,
        openTabs,
        activeTabId,
      }),
      // Sanitise persisted state: drop tabs for sections that no longer exist and
      // refresh titles/views from the current module config.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<WorkbenchState>;
        const openTabs = (Array.isArray(p.openTabs) ? p.openTabs : current.openTabs).flatMap(
          (tab): Tab[] => {
            if (!tab || !MODULE_BY_ID[tab.module]) return [];
            if (tab.id !== sectionTabId(tab.module, tab.section)) return [tab]; // e.g. detail tabs
            const section = findSection(tab.module, tab.section);
            if (!section) return [];
            return [{ ...tab, title: section.label, view: section.view, params: section.params }];
          },
        );
        const activeTabId = openTabs.some((t) => t.id === p.activeTabId)
          ? (p.activeTabId as string)
          : (openTabs[0]?.id ?? null);
        const activeModule =
          p.activeModule && MODULE_BY_ID[p.activeModule] ? p.activeModule : current.activeModule;
        return {
          ...current,
          openTabs,
          activeTabId,
          activeModule,
          sidebarOpen: typeof p.sidebarOpen === "boolean" ? p.sidebarOpen : current.sidebarOpen,
        };
      },
    },
  ),
);
