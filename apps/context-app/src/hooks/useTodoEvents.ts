import type { TodoAction, useListStats } from "@packages/shared-core";
import { useEffect } from "react";
import { useTodoDispatch } from "./useTodoDispatch";

export function useTodoEvents(listStats: ReturnType<typeof useListStats>) {
  const dispatch = useTodoDispatch();

  useEffect(() => {
    const actionHandler = (e: CustomEvent<TodoAction>) => {
      listStats.startTiming();
      dispatch(e.detail);
    };

    window.addEventListener("rsa:todo-action", actionHandler);

    return () => window.removeEventListener("rsa:todo-action", actionHandler);
  }, [dispatch, listStats.startTiming]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("rsa:state-request"));
  }, []);
}
