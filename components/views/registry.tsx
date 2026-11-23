import type { ComponentType } from "react";
import type { Tab, ViewKey } from "@/types/workbench";
import { PlaceholderView } from "./PlaceholderView";

export type ViewProps = { tab: Tab };

const placeholder = (stage: string): ComponentType<ViewProps> => {
  function Placeholder(props: ViewProps) {
    return <PlaceholderView {...props} stage={stage} />;
  }
  return Placeholder;
};

/**
 * Maps a section's `view` key (lib/workbench/modules.ts) to the component that
 * renders inside its tab. Replace placeholders as each stage lands.
 */
export const VIEWS: Record<ViewKey, ComponentType<ViewProps>> = {
  "claims.overview": placeholder("Stage 3 — Claims Overview"),
  "claims.list": placeholder("Stage 4 — Claims List"),
  "activations.android": placeholder("Stage 5 — Activations Reports"),
  "activations.samsung": placeholder("Stage 5 — Activations Reports"),
  "activations.transsion": placeholder("Stage 5 — Activations Reports"),
  "activations.monthly": placeholder("Stage 5 — Activations Reports"),
  "reports.total": placeholder("Stage 5 — Reports"),
  "reports.daily": placeholder("Stage 5 — Reports"),
  "documents.type": placeholder("Stage 6 — Documents"),
  "documents.locking": placeholder("Stage 6 — Documents"),
  "alerts.list": placeholder("Stage 6 — Alerts"),
  "settings.general": placeholder("a later stage (Settings is not defined yet)"),
};
