import type { Todo, TodoAction } from "@packages/shared-core";
import { createContext, useReducer, type Dispatch } from "react";
import { reducer } from "./reducer";
import type { TodoState } from "./types";

type TodoProviderProps = {
  initialTasks: Todo[];
  children: React.ReactNode;
};

export const TodoStateContext = createContext<TodoState | null>(null);
export const TodoDispatchContext = createContext<Dispatch<TodoAction> | null>(
  null
);

export function TodoProvider({ initialTasks, children }: TodoProviderProps) {
  const initialState: TodoState = {
    tasks: initialTasks,
    filter: "all",
    searchQuery: "",
    showStatsPerItem: false
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TodoDispatchContext value={dispatch}>
      <TodoStateContext value={state}>{children}</TodoStateContext>
    </TodoDispatchContext>
  );
}
