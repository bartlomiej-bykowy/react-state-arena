import { useEffect, useLayoutEffect, useRef } from "react";
import { itemRendersSignal, itemTimingSignal } from "../metricSignals";
import { registry } from "../registry";
import type { ScopeKey } from "../types";
import { ensureRecordInRegistry } from "../ensureRecordInRegistry";

export function useItemStats(id: string, scope: ScopeKey) {
  const startRender = useRef<number | null>(null);
  startRender.current = performance.now();

  const key = `${scope}:${id}`;

  const entryRef = useRef(ensureRecordInRegistry("items", key));
  const totalRef = useRef(ensureRecordInRegistry("itemsTotal", scope));

  const recordRender = () => {
    entryRef.current!.renders++;
    totalRef.current!.renders++;

    itemRendersSignal.set(totalRef.current!.renders);
  };

  const endTiming = () => {
    if (startRender.current === null) return;

    const delta = performance.now() - startRender.current;
    const timing = entryRef.current!.timing;
    timing.lastMs = delta;
    timing.totalMs += delta;

    totalRef.current!.timing.lastMs += delta;
    totalRef.current!.timing.totalMs += delta;

    itemTimingSignal.set({ ...totalRef.current!.timing });
    startRender.current = null;
  };

  useEffect(() => {
    return () => {
      registry.items.delete(key);
    };
  }, [key]);

  useLayoutEffect(() => {
    recordRender();
    endTiming();
  });

  return {
    stats: registry.items.get(key)
  };
}
