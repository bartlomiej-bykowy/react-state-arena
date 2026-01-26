import { useEffect, useLayoutEffect, useRef } from "react";
import { itemRendersSignal, itemTimingSignal } from "../metricSignals";
import { registry } from "../registry";
import type { ScopeKey } from "../types";
import { ensureRecordInRegistry } from "../ensureRecordInRegistry";
import { measuringEnabled } from "../todoOptions";

export function useItemStats(id: string, scope: ScopeKey) {
  const startRender = useRef<number | null>(null);

  if (measuringEnabled) {
    startRender.current = performance.now();
  }

  const key = `${scope}:${id}`;

  const entryRef = useRef(ensureRecordInRegistry("items", key));
  const totalRef = useRef(ensureRecordInRegistry("itemsTotal", scope));

  const recordRender = () => {
    entryRef.current!.renders++;
    totalRef.current!.renders++;

    itemRendersSignal.set(scope, totalRef.current!.renders);
  };

  const endTiming = () => {
    if (startRender.current === null) return;

    const delta = performance.now() - startRender.current;
    const timing = entryRef.current!.timing;
    timing.lastMs = delta;
    timing.totalMs += delta;
    // total lastMs is reseted during list's commit phase (check useLayoutEffect in useListStats hook)
    totalRef.current!.timing.lastMs += delta;
    totalRef.current!.timing.totalMs += delta;

    itemTimingSignal.set(scope, { ...totalRef.current!.timing });
    startRender.current = null;
  };

  const resetItemMetrics = () => {
    startRender.current = null;
    registry.items.forEach((_, key) => {
      registry.items.set(key, {
        renders: 0,
        timing: { lastMs: 0, totalMs: 0 }
      });
    });

    itemRendersSignal.set(scope, totalRef.current!.renders);
    itemTimingSignal.set(scope, { ...totalRef.current!.timing });
  };

  useEffect(() => {
    return () => {
      registry.items.delete(key);
    };
  }, [key]);

  useLayoutEffect(() => {
    if (!measuringEnabled) return;
    recordRender();
    endTiming();
  });

  return {
    stats: registry.items.get(key),
    resetItemMetrics
  };
}
