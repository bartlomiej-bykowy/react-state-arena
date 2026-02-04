import { useEffect } from "react";
import { useTodoDispatch } from "./useTodoDispatch";
import type { useListStats, TodoAction } from "@packages/shared-core";
import {
  add,
  addMany,
  edit,
  filter,
  remove,
  removeCompleted,
  removeMany,
  reset,
  showStats,
  toggle,
  toggleMany,
  update,
  setTasksCap
} from "../store/todoSlice";

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
      }
    };

    window.addEventListener("rsa:todo-action", actionHandler);

    return () => window.removeEventListener("rsa:todo-action", actionHandler);
  }, [dispatch]);
}
