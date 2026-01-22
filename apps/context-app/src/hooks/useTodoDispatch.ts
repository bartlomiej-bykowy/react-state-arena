import { useContext } from "react";
import { TodoDispatchContext } from "../store/context";

export function useTodoDispatch() {
  const dispatch = useContext(TodoDispatchContext);

  if (!dispatch) {
    throw new Error("useTodoState must be used within <TodoProvider>.");
  }

  return dispatch;
}
