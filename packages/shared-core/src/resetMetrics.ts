import { registry, type Stats } from "./registry";
import { refreshUISignal } from "./signals";
import type { ScopeKey } from "./types";

function reset(stats: Stats) {
  stats.renders = 0;
  stats.timing.lastMs = 0;
  stats.timing.totalMs = 0;
}

export function resetMetrics() {
  const scopes: ScopeKey[] = ["main", "context", "redux", "zustand"];
  scopes.forEach((scope) => {
    // reset list
    const list = registry.lists.get(scope);
    if (list) reset(list);
    // reset items
    registry.items.forEach((item, key) => {
      if (key.startsWith(scope)) reset(item);
    });
    // reset totals
    const total = registry.itemsTotal.get(scope);
    if (total) reset(total);
    // refresh UI
    refreshUISignal.runSubscribers(scope);
  });
}
