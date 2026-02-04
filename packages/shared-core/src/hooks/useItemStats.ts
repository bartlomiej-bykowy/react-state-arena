import { useEffect, useLayoutEffect, useRef } from "react";
import { refreshUISignal } from "../signals";
import { registry } from "../registry";
import type { ScopeKey } from "../types";
import { ensureRecordInRegistry } from "../ensureRecordInRegistry";
import { measuringEnabled } from "../todoOptions";
// import { useSignal } from "./useSignal";

export function useItemStats(id: string, scope: ScopeKey) {
  // useSignal(scope, metricsResetSignal);
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

    refreshUISignal.runSubscribers(scope);
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

    refreshUISignal.runSubscribers(scope);
    startRender.current = null;
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
    stats: registry.items.get(key)
  };
}
