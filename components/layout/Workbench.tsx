"use client";

import { useEffect } from "react";
import { useHydrateWorkbench } from "@/store/useHydrateWorkbench";
import { useWorkbenchStore } from "@/store/workbenchStore";
import { IconBar } from "./IconBar";
import { MainCanvas } from "./MainCanvas";
import { SecondarySidebar } from "./SecondarySidebar";

export function Workbench() {
  const hydrated = useHydrateWorkbench();
  const toggleSidebar = useWorkbenchStore((s) => s.toggleSidebar);

  // Ctrl/Cmd+B toggles the sidebar, as in VS Code.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleSidebar]);

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <IconBar />
      <SecondarySidebar />
      <MainCanvas hydrated={hydrated} />
    </div>
  );
}
