import { useEffect, useLayoutEffect, useRef } from "react";
import { ensureRecordInRegistry } from "../ensureRecordInRegistry";
import { registry } from "../registry";
import { measuringEnabled } from "../todoOptions";
import type { ScopeKey } from "../types";

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
  };

  const endTiming = () => {
    if (startRender.current === null) return;

    const delta = performance.now() - startRender.current;
    const timing = entryRef.current!.timing;
    timing.lastMs = delta;
    timing.totalMs += delta;
    /** The lastMs field within totalRef is reset at the beginning of each
     * action (see startTiming() in the useTodoList hook). Therefore,
     * re-renders originating from non–task-related causes do not reset this
     * property. */
    totalRef.current!.timing.lastMs += delta;
    totalRef.current!.timing.totalMs += delta;

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
