import type { Filter, Todo } from "@packages/shared-core";
import type { store } from "./store";

export type TodoStore = {
  tasks: Todo[];
  filter: Filter;
  searchQuery: string;
  showStatsPerItem: boolean;
};

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type TodoDispatch = AppStore["dispatch"];
