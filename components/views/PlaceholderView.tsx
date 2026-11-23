import { TabIcon } from "@/components/layout/TabIcon";
import { MODULE_BY_ID } from "@/lib/workbench/modules";
import type { ViewProps } from "./registry";

/** Stand-in for views that later stages will build. */
export function PlaceholderView({ tab, stage }: ViewProps & { stage: string }) {
  const params = Object.entries(tab.params ?? {});
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-[12px] text-subtle">
        <span>{MODULE_BY_ID[tab.module].label}</span>
        <span aria-hidden>/</span>
        <span>{tab.title}</span>
      </div>
      <h1 className="mt-1 flex items-center gap-2 text-xl font-semibold">
        <TabIcon tab={tab} className="size-5 text-accent" />
        {tab.title}
      </h1>

      <div className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-line bg-panel/50 px-6 py-12 text-center">
        <p className="text-sm font-medium">This view is not built yet</p>
        <p className="mt-1 max-w-sm text-[13px] text-muted">It is planned for {stage}.</p>
        {params.length > 0 && (
          <p className="mt-3 font-mono text-[12px] text-subtle">
            {params.map(([k, v]) => `${k}=${v}`).join("  ")}
          </p>
        )}
      </div>
    </div>
  );
}
