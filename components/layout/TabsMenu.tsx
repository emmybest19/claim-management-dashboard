"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useWorkbenchStore } from "@/store/workbenchStore";
import { TabIcon } from "./TabIcon";

/** The ▼ dropdown at the far right of the tab bar. */
export function TabsMenu() {
  const openTabs = useWorkbenchStore((s) => s.openTabs);
  const activeTabId = useWorkbenchStore((s) => s.activeTabId);
  const setActiveTab = useWorkbenchStore((s) => s.setActiveTab);
  const closeTab = useWorkbenchStore((s) => s.closeTab);
  const closeOthers = useWorkbenchStore((s) => s.closeOthers);
  const closeAll = useWorkbenchStore((s) => s.closeAll);

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    // Focus the active tab's entry (or the first item) when the menu opens.
    const items = menuItems();
    (items.find((el) => el.dataset.active === "true") ?? items[0])?.focus();
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function menuItems() {
    return Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [],
    );
  }

  function close(returnFocus = true) {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }

  function onMenuKeyDown(e: React.KeyboardEvent) {
    const items = menuItems();
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(index + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === "Tab") {
      close(false);
    }
  }

  const run = (fn: () => void) => () => {
    fn();
    close();
  };

  const hasTabs = openTabs.length > 0;
  const itemClass =
    "flex h-7 w-full items-center gap-2 rounded px-2 text-left text-[13px] outline-none hover:bg-hover focus-visible:bg-hover disabled:pointer-events-none disabled:opacity-40";

  return (
    <div ref={rootRef} className="relative flex shrink-0 items-center border-l border-line px-1">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label="Open tabs menu"
        title="Open tabs"
        className={`flex h-7 items-center gap-1 rounded px-1.5 text-muted outline-none hover:bg-hover hover:text-fg focus-visible:bg-hover ${
          open ? "bg-hover text-fg" : ""
        }`}
      >
        {hasTabs && (
          <span className="min-w-4 text-center text-[11px] font-medium tabular-nums">
            {openTabs.length}
          </span>
        )}
        <ChevronDown className="size-4" />
      </button>

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label="Open tabs"
          onKeyDown={onMenuKeyDown}
          className="absolute top-full right-1 z-50 mt-1 w-72 rounded-md border border-line bg-canvas p-1 shadow-lg shadow-black/10"
        >
          <div className="px-2 pt-1 pb-1.5 text-[11px] font-medium text-subtle">Open tabs</div>
          {hasTabs ? (
            <div className="scrollbar-thin max-h-72 overflow-y-auto">
              {openTabs.map((tab) => {
                const active = tab.id === activeTabId;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="menuitem"
                    data-active={active}
                    onClick={run(() => setActiveTab(tab.id))}
                    className={`${itemClass} ${active ? "text-fg" : "text-fg/85"}`}
                  >
                    <TabIcon tab={tab} className="size-4 shrink-0 text-muted" />
                    <span className="truncate">{tab.title}</span>
                    {active && <Check className="ml-auto size-3.5 shrink-0 text-accent" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-2 py-1.5 text-[13px] text-muted">No open tabs</div>
          )}

          <div role="separator" className="my-1 h-px bg-line" />

          <button
            type="button"
            role="menuitem"
            disabled={!activeTabId}
            onClick={run(() => activeTabId && closeTab(activeTabId))}
            className={itemClass}
          >
            Close
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={!activeTabId || openTabs.length < 2}
            onClick={run(() => activeTabId && closeOthers(activeTabId))}
            className={itemClass}
          >
            Close Others
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={!hasTabs}
            onClick={run(closeAll)}
            className={itemClass}
          >
            Close All
          </button>
        </div>
      )}
    </div>
  );
}
