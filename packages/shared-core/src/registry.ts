export type Timing = {
  lastMs: number;
  totalMs: number;
};

export type ItemStats = {
  renders: number;
  timing: Timing;
};

type ListStats = {
  renders: number;
  timing: Timing;
};

type Registry = {
  list: ListStats;
  items: Map<string, ItemStats>;
};

export const registry: Registry = {
  list: { renders: 0, timing: { lastMs: 0, totalMs: 0 } },
  items: new Map<string, ItemStats>()
};
