import {
  initialTasks,
  TASKS_CAP,
  type TodoStoreState
} from "@packages/shared-core";

export const initialState: TodoStoreState = {
  tasks: [...initialTasks],
  activeFilter: "all",
  searchQuery: "",
  showStatsPerItem: false,
  capEnabled: false,
  capNumber: TASKS_CAP
};
