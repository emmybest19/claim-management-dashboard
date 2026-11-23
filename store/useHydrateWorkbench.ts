"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useWorkbenchStore } from "./workbenchStore";

// zustand only attaches the persist API where storage exists, so it is
// undefined during server rendering.
const persistApi = () => useWorkbenchStore.persist as typeof useWorkbenchStore.persist | undefined;

function subscribe(callback: () => void) {
  const api = persistApi();
  if (!api) return () => {};
  const unsubFinish = api.onFinishHydration(callback);
  const unsubStart = api.onHydrate(callback);
  return () => {
    unsubFinish();
    unsubStart();
  };
}

const getSnapshot = () => persistApi()?.hasHydrated() ?? false;
const getServerSnapshot = () => false;

/**
 * Restores saved tabs from localStorage after mount and reports whether that
 * has happened. Before then, callers should avoid rendering persisted UI so the
 * user never sees the default tabs flash and get replaced.
 */
export function useHydrateWorkbench(): boolean {
  const hydrated = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const api = persistApi();
    if (api && !api.hasHydrated()) void api.rehydrate();
  }, []);

  return hydrated;
}
