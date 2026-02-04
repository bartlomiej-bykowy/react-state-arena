import {
  initialTasks,
  TASKS_CAP,
  type TodoStoreState
} from "@packages/shared-core";
import { create } from "zustand";
import type { StoreMethods } from "./types";

export const useStore = create<TodoStoreState & StoreMethods>(
  (set, get, store) => ({
    tasks: [...initialTasks],
    activeFilter: "all",
    searchQuery: "",
    showStatsPerItem: false,
    capEnabled: false,
    capNumber: TASKS_CAP,
    // actions
    add: (payload) => {
      set((state) => ({
        tasks: [payload.task, ...state.tasks]
      }));
    },
    edit: (payload) => {
      set((state) => ({
        tasks: state.tasks.map((task) => {
          if (task.id === payload.id) {
            return {
              ...task,
              editing: payload.editing
            };
          }
          return task;
        })
      }));
    },
    update: (payload) => {
      set((state) => ({
        tasks: state.tasks.map((task) => {
          if (task.id === payload.id) {
            return { ...task, text: payload.text };
          }
          return task;
        })
      }));
    },
    toggle: (payload) => {
      set((state) => ({
        tasks: state.tasks.map((task) => {
          if (task.id === payload.id) {
            return { ...task, completed: !task.completed };
          }
          return task;
        })
      }));
    },
    remove: (payload) => {
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== payload.id)
      }));
    },
    filter: (payload) => {
      set(() => ({
        activeFilter: payload.filter,
        searchQuery: payload.query
      }));
    },
    addMany: (payload) => {
      set((state) => ({
        tasks: [...payload.tasks, ...state.tasks]
      }));
    },
    toggleMany: (payload) => {
      set((state) => {
        const ids = new Set(payload.ids);
        return {
          tasks: state.tasks.map((task) => {
            if (ids.has(task.id)) {
              return { ...task, completed: !task.completed };
            }
            return task;
          })
        };
      });
    },
    removeMany: (payload) => {
      set((state) => {
        const ids = new Set(payload.ids);
        return {
          tasks: state.tasks.filter((task) => !ids.has(task.id))
        };
      });
    },
    removeCompleted: () => {
      set((state) => ({
        tasks: state.tasks.filter((task) => !task.completed)
      }));
    },
    reset: () => {
      set(store.getInitialState());
    },
    showStats: (payload) => {
      set(() => ({
        showStatsPerItem: payload.show
      }));
    },
    cap: (payload) => {
      set(() => ({
        capEnabled: payload.enable,
        capNumber: payload.capNumber
      }));
    },
    // action dispatcher
    applyEvent: (action) => {
      switch (action.type) {
        case "add":
          get().add(action.payload);
          break;
        case "edit":
          get().edit(action.payload);
          break;
        case "update":
          get().update(action.payload);
          break;
        case "toggle":
          get().toggle(action.payload);
          break;
        case "remove":
          get().remove(action.payload);
          break;
        case "filter":
          get().filter(action.payload);
          break;
        case "addMany":
          get().addMany(action.payload);
          break;
        case "toggleMany":
          get().toggleMany(action.payload);
          break;
        case "removeMany":
          get().removeMany(action.payload);
          break;
        case "removeCompleted":
          get().removeCompleted(action.payload);
          break;
        case "reset":
          get().reset(action.payload);
          break;
        case "showStats":
          get().showStats(action.payload);
          break;
        case "cap":
          get().cap(action.payload);
          break;
        default:
          return;
      }
    }
  })
);
