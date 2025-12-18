import { itemRendersSignal } from "../metricSignals";
import { registry } from "../registry";

export function useItemStats(id: string) {
  let entry = registry.items.get(id);

  if (!entry) {
    entry = {
      renders: 0
    };
    registry.items.set(id, entry);
  }

  const recordRender = () => {
    entry.renders++;
    itemRendersSignal.increment();
  };

  return {
    stats: registry.items,
    recordRender
  };
}
