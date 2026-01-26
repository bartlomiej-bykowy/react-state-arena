import { useContext } from "react";
import { TodoStateContext } from "../store/context";

export function useTodoState() {
  const state = useContext(TodoStateContext);

  if (state === null) {
    throw new Error("useTodoState must be used within <TodoProvider>.");
  }

  return state;
}
