export type Todo = {
  id: string;
  text: string;
  completed: boolean;
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
