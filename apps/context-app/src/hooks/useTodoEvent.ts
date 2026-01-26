import { useEffect } from "react";
import { useTodoDispatch } from "./useTodoDispatch";
import type { useListStats, TodoAction } from "@packages/shared-core";

export function useTodoEvents(listStats: ReturnType<typeof useListStats>) {
  const dispatch = useTodoDispatch();

  useEffect(() => {
    const actionHandler = (e: CustomEvent<TodoAction>) => {
      listStats.startTiming();
      dispatch(e.detail);
    };

    window.addEventListener("rsa:todo-action", actionHandler);

    return () => window.removeEventListener("rsa:todo-action", actionHandler);
  }, [dispatch]);
}
