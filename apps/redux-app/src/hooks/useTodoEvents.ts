import type { TodoAction, useListStats } from "@packages/shared-core";
import { useEffect } from "react";
import {
  add,
  addMany,
  edit,
  filter,
  remove,
  removeCompleted,
  removeMany,
  reset,
  rewriteState,
  setTasksCap,
  showStats,
  toggle,
  toggleMany,
  update
} from "../store/todoSlice";
import { useTodoDispatch } from "./useTodoDispatch";

export function useTodoEvents(listStats: ReturnType<typeof useListStats>) {
  const dispatch = useTodoDispatch();

  useEffect(() => {
    const actionHandler = (e: CustomEvent<TodoAction>) => {
      listStats.startTiming();
      const { type, payload } = e.detail;

      switch (type) {
        case "add":
          dispatch(add(payload));
          break;
        case "edit":
          dispatch(edit(payload));
          break;
        case "update":
          dispatch(update(payload));
          break;
        case "toggle":
          dispatch(toggle(payload));
          break;
        case "remove":
          dispatch(remove(payload));
          break;
        case "filter":
          dispatch(filter(payload));
          break;
        case "addMany":
          dispatch(addMany(payload));
          break;
        case "toggleMany":
          dispatch(toggleMany(payload));
          break;
        case "removeMany":
          dispatch(removeMany(payload));
          break;
        case "removeCompleted":
          dispatch(removeCompleted());
          break;
        case "reset":
          dispatch(reset(payload));
          break;
        case "showStats":
          dispatch(showStats(payload));
          break;
        case "cap":
          dispatch(setTasksCap(payload));
          break;
        case "rewriteState":
          dispatch(rewriteState(payload));
      }
    };

    window.addEventListener("rsa:todo-action", actionHandler);

    return () => window.removeEventListener("rsa:todo-action", actionHandler);
  }, [dispatch]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("rsa:state-request"));
  }, []);
}
