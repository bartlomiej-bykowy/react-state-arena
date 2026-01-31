import { initialTasks, type TodoStoreState } from "@packages/shared-core";

export const initialState: TodoStoreState = {
  tasks: [...initialTasks],
  activeFilter: "all",
  searchQuery: "",
  showStatsPerItem: false
};
