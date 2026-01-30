import { useTodoState } from "./useTodoState";
import { useMemo } from "react";

export function useContextTodoState() {
  const { tasks, filter, searchQuery, showStatsPerItem } = useTodoState();

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filteredTasks = tasks.filter((task) => {
      if (filter === "active" && task.completed) return false;
      if (filter === "completed" && !task.completed) return false;
      if (query && !task.text.toLowerCase().includes(query)) return false;
      return true;
    });

    return filteredTasks;
  }, [tasks, filter, searchQuery]);

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
