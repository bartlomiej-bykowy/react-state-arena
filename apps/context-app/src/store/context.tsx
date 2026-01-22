import type { Todo } from "@packages/shared-core";
import { createContext, useReducer, type ActionDispatch } from "react";
import { reducer } from "./reducer";
import type { TodoAction } from "./types";

type TodoProviderProps = {
  initialTasks: Todo[];
  children: React.ReactNode;
};

export const TodoStateContext = createContext<Todo[] | null>(null);
export const TodoDispatchContext = createContext<ActionDispatch<
  [action: TodoAction]
> | null>(null);

export function TodoProvider({ initialTasks, children }: TodoProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialTasks);

  return (
    <TodoDispatchContext value={dispatch}>
      <TodoStateContext value={state}>{children}</TodoStateContext>
    </TodoDispatchContext>
  );
}
