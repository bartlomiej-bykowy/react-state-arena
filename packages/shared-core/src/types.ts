export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  editing: boolean;
};

export type Filter = "all" | "active" | "completed";

export type ScopeKey = "main" | "context" | "redux" | "zustand";

export type TodoAction =
  | { type: "add"; payload: { task: Todo } }
  // change to editing state
  | { type: "edit"; payload: { id: string; editing: boolean } }
  // update task's value
  | { type: "update"; payload: { id: string; text: string } }
  | { type: "toggle"; payload: { id: string } }
  | { type: "remove"; payload: { id: string } }
  | { type: "filter"; payload: { query: string; filter: Filter } }
  | { type: "addMany"; payload: { tasks: Todo[] } }
  | { type: "toggleMany"; payload: { ids: string[] } }
  | { type: "removeMany"; payload: { ids: string[] } }
  | { type: "removeCompleted"; payload?: null }
  | { type: "reset"; payload: { tasks: Todo[] } }
  | { type: "showStats"; payload: { show: boolean } }
  | { type: "cap"; payload: { enable: boolean; capNumber: number } }
  | { type: "rewriteState"; payload: TodoStoreState };

export type TodoStoreState = {
  tasks: Todo[];
  activeFilter: Filter;
  searchQuery: string;
  showStatsPerItem: boolean;
  capEnabled: boolean;
  capNumber: number;
};
