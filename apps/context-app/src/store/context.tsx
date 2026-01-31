import type { Todo, TodoAction, TodoStoreState } from "@packages/shared-core";
import { createContext, useReducer, type Dispatch } from "react";
import { reducer } from "./reducer";

type TodoProviderProps = {
  initialTasks: Todo[];
  children: React.ReactNode;
};

export const TodoStateContext = createContext<TodoStoreState | null>(null);
export const TodoDispatchContext = createContext<Dispatch<TodoAction> | null>(
  null
);

export function TodoProvider({ initialTasks, children }: TodoProviderProps) {
  const initialState: TodoStoreState = {
    tasks: initialTasks,
    activeFilter: "all",
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
