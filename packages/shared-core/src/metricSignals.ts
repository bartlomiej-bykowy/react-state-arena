import { createSignal } from "./signal";

export const listRendersSignal = createSignal(0);
export const listTimingSignal = createSignal({ lastMs: 0, totalMs: 0 });
export const itemRendersSignal = createSignal(0);
export const itemTimingSignal = createSignal({ lastMs: 0, totalMs: 0 });
export const itemStatsUiRefreshSignal = createSignal(Date.now());
