import type { Reducer } from "react";
import type { TodoAction, TodoState } from "./types";
import type { Todo } from "@packages/shared-core";

export const reducer: Reducer<TodoState, TodoAction> = (state, action) => {
  switch (action.type) {
    case "add":
      return [...state, action.payload.task];
    case "edit":
      return state.map((task) => {
        if (task.id === action.payload.id) {
          return { ...task, text: action.payload.text };
        }
        return task;
      });
    case "toggle":
      return state.map((task) => {
        if (task.id === action.payload.id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
    case "remove":
      return state.filter((task) => task.id !== action.payload.id);
    case "addMany":
      return [...state, action.payload.tasks] as Todo[];
    case "toggleMany":
      return state.map((task) => {
        if (action.payload.ids.includes(task.id)) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
    case "removeMany":
      return state.filter((task) => !action.payload.ids.includes(task.id));
    case "removeCompleted":
      return state.filter((task) => !task.completed);
    case "reset":
      return [...action.payload.tasks] as Todo[];
    default:
      return state;
  }
};
