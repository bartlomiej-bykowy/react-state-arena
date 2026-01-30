import { initialTasks } from "@packages/shared-core";
import type { TodoStore } from "./types";

export const initialState: TodoStore = {
  tasks: [...initialTasks],
  filter: "all",
  searchQuery: "",
  showStatsPerItem: false
};
