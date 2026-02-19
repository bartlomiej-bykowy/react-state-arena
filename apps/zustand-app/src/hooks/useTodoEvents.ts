import type { TodoAction, useListStats } from "@packages/shared-core";
import { useEffect } from "react";
import { useStore } from "../store/store";

export function useTodoEvents(listStats: ReturnType<typeof useListStats>) {
  useEffect(() => {
    const actionHandler = (e: CustomEvent<TodoAction>) => {
      listStats.startTiming();

      useStore.getState().applyEvent(e.detail);
    };

    window.addEventListener("rsa:todo-action", actionHandler);

    return () => window.removeEventListener("rsa:todo-action", actionHandler);
  }, [dispatchEvent]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("rsa:state-request"));
  }, []);
}
