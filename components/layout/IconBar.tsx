"use client";

import { Moon, Sun } from "lucide-react";
import { MODULES } from "@/lib/workbench/modules";
import { setTheme, useTheme } from "@/lib/theme";
import { useWorkbenchStore } from "@/store/workbenchStore";
import type { WorkbenchModule } from "@/types/workbench";

export function IconBar() {
  const activeModule = useWorkbenchStore((s) => s.activeModule);
  const sidebarOpen = useWorkbenchStore((s) => s.sidebarOpen);
  const selectModule = useWorkbenchStore((s) => s.selectModule);
  const theme = useTheme();

  const main = MODULES.filter((m) => m.id !== "settings");
  const settings = MODULES.find((m) => m.id === "settings");

  const renderButton = (m: WorkbenchModule) => {
    const Icon = m.icon;
    const active = m.id === activeModule;
    return (
      <li key={m.id}>
        <button
          type="button"
          onClick={() => selectModule(m.id)}
          aria-label={m.label}
          aria-pressed={active}
          title={m.label}
          className={`group relative flex h-14 w-full flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors outline-none focus-visible:bg-hover ${
            active ? "text-fg" : "text-subtle hover:text-fg"
          }`}
        >
          {/* Active indicator, like VS Code's activity bar. */}
          <span
            aria-hidden
            className={`absolute inset-y-2 left-0 w-0.5 rounded-r bg-accent transition-opacity ${
              active && sidebarOpen ? "opacity-100" : active ? "opacity-40" : "opacity-0"
            }`}
          />
          <Icon className="size-5" strokeWidth={1.75} />
          <span className="leading-none">{m.label === "Activations" ? "Activ." : m.label}</span>
        </button>
      </li>
    );
  };

  return (
    <nav
      aria-label="Modules"
      className="flex w-[60px] shrink-0 flex-col justify-between border-r border-line bg-rail"
    >
      <ul className="flex flex-col pt-1">{main.map(renderButton)}</ul>
      <ul className="flex flex-col pb-1">
        <li>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Light theme" : "Dark theme"}
            className="flex h-12 w-full items-center justify-center text-subtle transition-colors outline-none hover:text-fg focus-visible:bg-hover"
          >
            {theme === "dark" ? (
              <Sun className="size-5" strokeWidth={1.75} />
            ) : (
              <Moon className="size-5" strokeWidth={1.75} />
            )}
          </button>
        </li>
        {settings && renderButton(settings)}
      </ul>
    </nav>
  );
}
