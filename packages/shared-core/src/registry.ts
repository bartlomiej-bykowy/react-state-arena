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
  lists: Map<string, ListStats>;
  items: Map<string, ItemStats>;
};

export const registry: Registry = {
  lists: new Map<string, ListStats>(),
  items: new Map<string, ItemStats>()
};
