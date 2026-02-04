import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { refreshUISignal } from "../signals";
import { registry } from "../registry";
import type { ScopeKey } from "../types";
import { ensureRecordInRegistry } from "../ensureRecordInRegistry";
import { measuringEnabled } from "../todoOptions";
// import { useSignal } from "./useSignal";

export function useListStats(scope: ScopeKey) {
  // useSignal(scope, metricsResetSignal);
  const renderStart = useRef<number | null>(null);

  if (measuringEnabled) {
    renderStart.current = performance.now();
  }

  const entryRef = useRef(ensureRecordInRegistry("lists", scope));
  ensureRecordInRegistry("itemsTotal", scope);

  const recordRender = () => {
    entryRef.current!.renders++;
    refreshUISignal.runSubscribers(scope);
  };

  const startTiming = useCallback(() => {
    if (!measuringEnabled) return;

    renderStart.current = performance.now();
  }, []);

  const endTiming = () => {
    if (renderStart.current === null) return;

    const delta = performance.now() - renderStart.current;
    const timing = entryRef.current!.timing;
    timing.lastMs = delta;
    timing.totalMs += delta;

    refreshUISignal.runSubscribers(scope);
    renderStart.current = null;
  };

  const resetLastRenderTotalTime = () => {
    // we need to reset items' total timings from last render
    const total = ensureRecordInRegistry("itemsTotal", scope);
    total.timing.lastMs = 0;
  };

  useEffect(() => {
    return () => {
      registry.lists.delete(scope);
      registry.itemsTotal.delete(scope);
    };
  }, [scope]);

  useLayoutEffect(() => {
    if (!measuringEnabled) return;
    recordRender();
    endTiming();
  });

  return {
    stats: registry.lists.get(scope),
    startTiming,
    resetLastRenderTotalTime
  };
}
