import { useContext } from "react";
import { TodoDispatchContext } from "../store/context";

export function useTodoDispatch() {
  const dispatch = useContext(TodoDispatchContext);

  if (dispatch === null) {
    throw new Error("useTodoDispatch must be used within <TodoProvider>.");
  }

  return dispatch;
}
