import { listRendersSignal } from "../metricSignals";
import { registry } from "../registry";

export function useListStats() {
  const recordRender = () => {
    registry.list.renders++;
    listRendersSignal.increment();
  };

  const getItemsRenderSum = () => {
    let sum = 0;
    registry.items.forEach((item) => (sum += item.renders));
    return sum;
  };

  return {
    stats: registry.list,
    recordRender,
    getItemsRenderSum
  };
}
