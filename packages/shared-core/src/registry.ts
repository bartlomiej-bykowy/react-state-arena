type ItemStats = {
  renders: number;
};

type ListStats = {
  renders: number;
};

type Registry = {
  list: ListStats;
  items: Map<string, ItemStats>;
};

export const registry: Registry = {
  list: { renders: 0 },
  items: new Map<string, ItemStats>()
};
