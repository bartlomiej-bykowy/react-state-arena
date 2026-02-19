import { TASKS_CAP, type TodoAction } from "@packages/shared-core";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./initialState";

type ActionType = {
  [K in TodoAction["type"]]: Extract<TodoAction, { type: K }>["payload"];
};

/**
 * Although RTK uses Immer under the hood, reducers in this project are written
 * in an explicit immutable style (no direct mutations). This is intentional:
 * - to keep mental model as similar other apps as possible
 * - to avoid Immer-specific optimizations affecting performance measurements
 * - to ensure a fair, apples-to-apples comparison between apps
 */

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    add(state, action: PayloadAction<ActionType["add"]>) {
      return {
        ...state,
        tasks: [action.payload.task, ...state.tasks]
      };
    },
    edit(state, action: PayloadAction<ActionType["edit"]>) {
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
    },
    update(state, action: PayloadAction<ActionType["update"]>) {
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload.id) {
            return { ...task, text: action.payload.text };
          }
          return task;
        })
      };
    },
    toggle(state, action: PayloadAction<ActionType["toggle"]>) {
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload.id) {
            return { ...task, completed: !task.completed };
          }
          return task;
        })
      };
    },
    remove(state, action: PayloadAction<ActionType["remove"]>) {
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id)
      };
    },
    filter(state, action: PayloadAction<ActionType["filter"]>) {
      return {
        ...state,
        activeFilter: action.payload.filter,
        searchQuery: action.payload.query
      };
    },
    addMany(state, action: PayloadAction<ActionType["addMany"]>) {
      return {
        ...state,
        tasks: [...action.payload.tasks, ...state.tasks]
      };
    },
    toggleMany(state, action: PayloadAction<ActionType["toggleMany"]>) {
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
    },
    removeMany(state, action: PayloadAction<ActionType["removeMany"]>) {
      const ids = new Set(action.payload.ids);
      return {
        ...state,
        tasks: state.tasks.filter((task) => !ids.has(task.id))
      };
    },
    removeCompleted(state) {
      return {
        ...state,
        tasks: state.tasks.filter((task) => !task.completed)
      };
    },
    reset(state, action: PayloadAction<ActionType["reset"]>) {
      return {
        tasks: [...action.payload.tasks],
        activeFilter: "all",
        searchQuery: "",
        showStatsPerItem: state.showStatsPerItem,
        capEnabled: state.capEnabled,
        capNumber: TASKS_CAP
      };
    },
    showStats(state, action: PayloadAction<ActionType["showStats"]>) {
      return {
        ...state,
        showStatsPerItem: action.payload.show
      };
    },
    setTasksCap(state, action: PayloadAction<ActionType["cap"]>) {
      return {
        ...state,
        capEnabled: action.payload.enable,
        capNumber: action.payload.capNumber
      };
    },
    rewriteState(_state, action: PayloadAction<ActionType["rewriteState"]>) {
      return {
        ...action.payload
      };
    }
  }
});

export const {
  add,
  addMany,
  edit,
  update,
  toggle,
  filter,
  toggleMany,
  remove,
  removeCompleted,
  removeMany,
  reset,
  showStats,
  setTasksCap,
  rewriteState
} = todoSlice.actions;

export const todoReducer = todoSlice.reducer;
