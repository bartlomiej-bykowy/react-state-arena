export type Timing = {
  lastMs: number;
  totalMs: number;
};

export type Stats = {
  renders: number;
  timing: Timing;
};

export type Registry = {
  lists: Map<string, Stats>;
  items: Map<string, Stats>;
  itemsTotal: Map<string, Stats>;
};

export const registry: Registry = {
  lists: new Map<string, Stats>(),
  items: new Map<string, Stats>(),
  itemsTotal: new Map<string, Stats>()
};
