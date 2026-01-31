import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./types";

export const selectAllTodos = (state: RootState) => state.todo.tasks;
export const selectItemStatsSetting = (state: RootState) =>
  state.todo.showStatsPerItem;
const selectFilterSetting = (state: RootState) => state.todo.activeFilter;
const selectSearchQuery = (state: RootState) => state.todo.searchQuery;

export const selectFilteredTasks = createSelector(
  [selectAllTodos, selectFilterSetting, selectSearchQuery],
  (tasks, activeFilter, searchQuery) => {
    const query = searchQuery.trim().toLowerCase();
    return tasks.filter((task) => {
      if (activeFilter === "active" && task.completed) return false;
      if (activeFilter === "completed" && !task.completed) return false;
      if (query && !task.text.toLowerCase().includes(query)) return false;
      return true;
    });
  }
);

export const selectTodosStats = createSelector([selectAllTodos], (tasks) => {
  let active = 0;
  let completed = 0;
  for (const task of tasks) task.completed ? completed++ : active++;
  return { total: tasks.length, active, completed };
});
