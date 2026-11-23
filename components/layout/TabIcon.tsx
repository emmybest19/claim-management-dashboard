import { createElement } from "react";
import type { LucideProps } from "lucide-react";
import { tabIcon } from "@/lib/workbench/modules";
import type { Tab } from "@/types/workbench";

/** The icon of the section a tab was opened from. */
export function TabIcon({ tab, ...props }: { tab: Tab } & LucideProps) {
  return createElement(tabIcon(tab), { strokeWidth: 1.75, ...props });
}
