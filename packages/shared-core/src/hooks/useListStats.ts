import { useCallback, useRef } from "react";
import { listRendersSignal, listTimingSignal } from "../metricSignals";
import { registry } from "../registry";

export function useListStats() {
  const renderStart = useRef<number>(null);

  const recordRender = () => {
    registry.list.renders++;
    listRendersSignal.set(registry.list.renders);
  };

  const startTiming = useCallback(() => {
    renderStart.current = performance.now();
  }, []);

  const endTiming = () => {
    if (renderStart.current === null) return;

    const delta = performance.now() - renderStart.current;
    const timing = registry.list.timing;
    timing.lastMs = delta;
    timing.totalMs += delta;

    listTimingSignal.set(timing);
    renderStart.current = null;
  };

  const getItemsRenderSum = () => {
    let sum = 0;
    registry.items.forEach((item) => {
      sum += item.renders;
    });
    return sum;
  };

  return {
    stats: registry.list,
    recordRender,
    getItemsRenderSum,
    startTiming,
    endTiming
  };
}
