import type { Filter, Todo } from "@packages/shared-core";

export type TodoState = {
  tasks: Todo[];
  filter: Filter;
  searchQuery: string;
  showStatsPerItem: boolean;
};
