import type { Reducer } from "react";
import {
  TASKS_CAP,
  type TodoStoreState,
  type TodoAction
} from "@packages/shared-core";

export const reducer: Reducer<TodoStoreState, TodoAction> = (state, action) => {
  switch (action.type) {
    case "add":
      return {
        ...state,
        tasks: [action.payload.task, ...state.tasks]
      };
    case "edit":
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload.id) {
            return {
              ...task,
              editing: action.payload.editing
            };
          }
          return task;
        })
      };
    case "update":
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload.id) {
            return { ...task, text: action.payload.text };
          }
          return task;
        })
      };
    case "toggle":
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload.id) {
            return { ...task, completed: !task.completed };
          }
          return task;
        })
      };
    case "remove":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id)
      };
    case "filter":
      return {
        ...state,
        activeFilter: action.payload.filter,
        searchQuery: action.payload.query
      };
    case "addMany":
      return {
        ...state,
        tasks: [...action.payload.tasks, ...state.tasks]
      };
    case "toggleMany": {
      const ids = new Set(action.payload.ids);
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (ids.has(task.id)) {
            return { ...task, completed: !task.completed };
          }
          return task;
        })
      };
    }
    case "removeMany": {
      const ids = new Set(action.payload.ids);
      return {
        ...state,
        tasks: state.tasks.filter((task) => !ids.has(task.id))
      };
    }
    case "removeCompleted":
      return {
        ...state,
        tasks: state.tasks.filter((task) => !task.completed)
      };
    case "reset":
      return {
        tasks: [...action.payload.tasks],
        activeFilter: "all",
        searchQuery: "",
        showStatsPerItem: state.showStatsPerItem,
        capNumber: TASKS_CAP,
        capEnabled: state.capEnabled
      };
    case "showStats":
      return {
        ...state,
        showStatsPerItem: action.payload.show
      };
    case "cap":
      return {
        ...state,
        capEnabled: action.payload.enable,
        capNumber: action.payload.capNumber
      };
    default:
      return state;
  }
};
