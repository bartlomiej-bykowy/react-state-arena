import { useCallback, useRef } from "react";
import { itemRendersSignal, itemTimingSignal } from "../metricSignals";
import { registry } from "../registry";
import type { ScopeKey } from "../types";

export function useItemStats(id: string, scope: ScopeKey) {
  const startRender = useRef<number>(null);
  const key = `${scope}:${id}`;

  let entry = registry.items.get(key);

  if (!entry) {
    entry = {
      renders: 0,
      timing: {
        lastMs: 0,
        totalMs: 0
      }
    };
    registry.items.set(key, entry);
  }

  const recordRender = () => {
    entry.renders++;
    let total = 0;
    registry.items.forEach((item, itemKey) => {
      if (itemKey.includes(scope)) total += item.renders;
    });

    itemRendersSignal.set(total);
  };

  const startTiming = useCallback(() => {
    startRender.current = performance.now();
  }, []);

  const endTiming = () => {
    if (startRender.current === null) return;

    const delta = performance.now() - startRender.current;
    const timing = registry.items.get(key)!.timing;
    timing.lastMs = delta;
    timing.totalMs += delta;

    let sumLast = 0;
    let sumTotal = 0;
    registry.items.forEach((item, itemKey) => {
      if (itemKey.includes(scope)) {
        sumLast += item.timing.lastMs;
        sumTotal += item.timing.totalMs;
      }
    });

    itemTimingSignal.set({ lastMs: sumLast, totalMs: sumTotal });
    startRender.current = null;
  };

  const removeItem = useCallback(() => {
    registry.items.delete(key);
  }, [id]);

  return {
    stats: registry.items.get(key),
    recordRender,
    startTiming,
    endTiming,
    removeItem
  };
}
