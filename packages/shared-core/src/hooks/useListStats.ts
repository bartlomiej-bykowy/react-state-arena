import { useCallback, useRef } from "react";
import { listRendersSignal, listTimingSignal } from "../metricSignals";
import { registry } from "../registry";
import type { ScopeKey } from "../types";

export function useListStats(scope: ScopeKey) {
  const renderStart = useRef<number>(null);

  let entry = registry.lists.get(scope);

  if (!entry) {
    entry = { renders: 0, timing: { lastMs: 0, totalMs: 0 } };
    registry.lists.set(scope, entry);
  }

  const recordRender = () => {
    entry.renders++;
    listRendersSignal.set(entry.renders);
  };

  const startTiming = useCallback(() => {
    renderStart.current = performance.now();
  }, []);

  const endTiming = () => {
    if (renderStart.current === null) return;

    const delta = performance.now() - renderStart.current;
    const timing = entry.timing;
    timing.lastMs = delta;
    timing.totalMs += delta;

    listTimingSignal.set(timing);
    renderStart.current = null;
  };

  return {
    stats: registry.lists.get(scope),
    recordRender,
    startTiming,
    endTiming
  };
}
