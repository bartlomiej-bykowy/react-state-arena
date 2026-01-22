import type { Todo } from "@packages/shared-core";

export type TodoState = Todo[];

export type TodoAction =
  | { type: "add"; payload: { task: Todo } }
  | { type: "edit"; payload: { id: string; text: string } }
  | { type: "toggle"; payload: { id: string } }
  | { type: "remove"; payload: { id: string } }
  | { type: "addMany"; payload: { tasks: Todo[] } }
  | { type: "toggleMany"; payload: { ids: string[] } }
  | { type: "removeMany"; payload: { ids: string[] } }
  | { type: "removeCompleted" }
  | { type: "reset"; payload: { tasks: Todo[] } };
