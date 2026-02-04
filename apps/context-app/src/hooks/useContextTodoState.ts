import { useTodoState } from "./useTodoState";
import { useMemo } from "react";

export function useContextTodoState() {
  const {
    tasks,
    activeFilter,
    searchQuery,
    showStatsPerItem,
    capEnabled,
    capNumber
  } = useTodoState();

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filteredTasks = tasks.filter((task) => {
      if (activeFilter === "active" && task.completed) return false;
      if (activeFilter === "completed" && !task.completed) return false;
      if (query && !task.text.toLowerCase().includes(query)) return false;
      return true;
    });

    return capEnabled ? filteredTasks.slice(0, capNumber) : filteredTasks;
  }, [tasks, activeFilter, searchQuery, capEnabled, capEnabled]);

  const stats = useMemo(() => {
    let active = 0;
    let completed = 0;
    for (const task of tasks) task.completed ? completed++ : active++;
    return { total: tasks.length, active, completed };
  }, [tasks]);

  return {
    filteredTasks,
    stats,
    showStatsPerItem
  };
}
