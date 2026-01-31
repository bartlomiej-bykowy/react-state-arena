import type { Reducer } from "react";
import type { TodoAction, TodoStoreState } from "@packages/shared-core";

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
    case "toggleMany":
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (action.payload.ids.has(task.id)) {
            return { ...task, completed: !task.completed };
          }
          return task;
        })
      };
    case "removeMany":
      return {
        ...state,
        tasks: state.tasks.filter((task) => !action.payload.ids.has(task.id))
      };
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
        showStatsPerItem: state.showStatsPerItem
      };
    case "showStats":
      return {
        ...state,
        showStatsPerItem: action.payload.show
      };
    default:
      return state;
  }
};
