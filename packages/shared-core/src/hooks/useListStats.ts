import { useCallback, useLayoutEffect, useRef } from "react";
import { listRendersSignal, listTimingSignal } from "../metricSignals";
import { registry } from "../registry";
import type { ScopeKey } from "../types";
import { ensureRecordInRegistry } from "../ensureRecordInRegistry";

export function useListStats(scope: ScopeKey) {
  const renderStart = useRef<number>(null);
  renderStart.current = performance.now();

  const entryRef = useRef(ensureRecordInRegistry("lists", scope));

  const recordRender = () => {
    entryRef.current!.renders++;
    listRendersSignal.set(entryRef.current!.renders);
  };

  const startTiming = useCallback(() => {
    renderStart.current = performance.now();
  }, []);

  const endTiming = () => {
    if (renderStart.current === null) return;

    const delta = performance.now() - renderStart.current;
    const timing = entryRef.current!.timing;
    timing.lastMs = delta;
    timing.totalMs += delta;

    listTimingSignal.set({ ...timing });
    renderStart.current = null;
  };

  const resetLastRenderTotalTime = () => {
    // we need to reset items' total timings from last render
    const total = ensureRecordInRegistry("itemsTotal", scope);
    total.timing.lastMs = 0;
  };

  useLayoutEffect(() => {
    recordRender();
    endTiming();
    resetLastRenderTotalTime();
  });

  return {
    stats: registry.lists.get(scope),
    startTiming
  };
}
