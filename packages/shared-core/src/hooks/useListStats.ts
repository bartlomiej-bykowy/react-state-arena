import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { registry } from "../data/registry";
import { refreshUISignal } from "../signal/signals";
import type { ScopeKey } from "../types";
import { ensureRecordInRegistry } from "../utils/ensureRecordInRegistry";
import { measuringEnabled } from "../utils/todoOptions";

export function useListStats(scope: ScopeKey) {
  const renderStart = useRef<number | null>(null);

  if (measuringEnabled) {
    renderStart.current = performance.now();
  }

  const entryRef = useRef(ensureRecordInRegistry("lists", scope));
  const totalRef = useRef(ensureRecordInRegistry("itemsTotal", scope));

  const recordRender = () => {
    entryRef.current!.renders++;
  };

  const startTiming = useCallback(() => {
    if (!measuringEnabled) return;
    totalRef.current.timing.lastMs = 0;
    renderStart.current = performance.now();
  }, []);

  const endTiming = () => {
    if (renderStart.current === null) return;

    const delta = performance.now() - renderStart.current;
    const timing = entryRef.current!.timing;
    timing.lastMs = delta;
    timing.totalMs += delta;

    renderStart.current = null;
  };

  useLayoutEffect(() => {
    if (!measuringEnabled) return;
    recordRender();
    endTiming();
    refreshUISignal.runSubscribers(scope);
  });

  useEffect(() => {
    return () => {
      registry.lists.delete(scope);
      registry.itemsTotal.delete(scope);
    };
  }, [scope]);

  return {
    stats: {
      listStats: registry.lists.get(scope),
      itemsStats: registry.itemsTotal.get(scope)
    },
    startTiming
  };
}
