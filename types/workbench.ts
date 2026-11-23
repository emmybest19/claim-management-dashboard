import type { LucideIcon } from "lucide-react";

export type ModuleId =
  | "claims"
  | "activations"
  | "reports"
  | "documents"
  | "alerts"
  | "settings";

/** Key into the view registry (components/views/registry.tsx). */
export type ViewKey = string;

export type Section = {
  id: string;
  label: string;
  icon: LucideIcon;
  view: ViewKey;
  /** Optional params passed to the view, e.g. a preset status filter. */
  params?: Record<string, string>;
};

export type SectionGroup = {
  label?: string;
  sections: Section[];
};

export type WorkbenchModule = {
  id: ModuleId;
  label: string;
  icon: LucideIcon;
  groups: SectionGroup[];
};

export type Tab = {
  /** Stable identity: `${module}:${section}` for sections, e.g. `claim:CLM-1042` for details. */
  id: string;
  title: string;
  module: ModuleId;
  section: string;
  view: ViewKey;
  params?: Record<string, string>;
  closable: boolean;
};

export type Theme = "light" | "dark";
