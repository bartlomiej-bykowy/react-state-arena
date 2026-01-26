export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  editing: boolean;
};

export type Filter = "all" | "active" | "completed";

export type BulkActionType =
  | "addMany"
  | "removeMany"
  | "toggleMany"
  | "reset"
  | "toggleAll"
  | "removeCompleted";

export type BulkActionPayload =
  | { type: "addMany"; payload: Todo[] }
  | { type: "removeMany"; payload: Todo["id"][] }
  | { type: "toggleMany"; payload: Todo["id"][] }
  | { type: "toggleAll"; payload?: null }
  | { type: "removeCompleted"; payload?: null }
  | { type: "reset"; payload?: null };

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
  | { type: "toggleMany"; payload: { ids: Set<string> } }
  | { type: "removeMany"; payload: { ids: Set<string> } }
  | { type: "removeCompleted" }
  | { type: "reset"; payload: { tasks: Todo[] } }
  | { type: "showStats"; payload: { show: boolean } };
