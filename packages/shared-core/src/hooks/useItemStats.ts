import { useCallback, useRef } from "react";
import { itemRendersSignal, itemTimingSignal } from "../metricSignals";
import { registry } from "../registry";

export function useItemStats(id: string) {
  const startRender = useRef<number>(null);

  let entry = registry.items.get(id);

  if (!entry) {
    entry = {
      renders: 0,
      timing: {
        lastMs: 0,
        totalMs: 0
      }
    };
    registry.items.set(id, entry);
  }

  const recordRender = () => {
    entry.renders++;
    let total = 0;
    registry.items.forEach((item) => {
      total += item.renders;
    });
    itemRendersSignal.set(total);
  };

  const startTiming = useCallback(() => {
    startRender.current = performance.now();
  }, []);

  const endTiming = () => {
    if (startRender.current === null) return;

    const delta = performance.now() - startRender.current;
    const timing = registry.items.get(id)!.timing;
    timing.lastMs = delta;
    timing.totalMs += delta;

    let sumLast = 0;
    let sumTotal = 0;
    registry.items.forEach((item) => {
      sumLast += item.timing.lastMs;
      sumTotal += item.timing.totalMs;
    });

    itemTimingSignal.set({ lastMs: sumLast, totalMs: sumTotal });
    startRender.current = null;
  };

  const removeItem = useCallback(() => {
    registry.items.delete(id);
  }, [id]);

  return {
    stats: registry.items.get(id),
    recordRender,
    startTiming,
    endTiming,
    removeItem
  };
}
