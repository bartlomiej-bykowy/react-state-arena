import { useMemo } from "react";
import { useStore } from "../store/store";

export function useZustandTodoState() {
  const tasks = useStore((state) => state.tasks);
  const searchQuery = useStore((state) => state.searchQuery);
  const activeFilter = useStore((state) => state.activeFilter);
  const showStatsPerItem = useStore((state) => state.showStatsPerItem);
  const capEnabled = useStore((state) => state.capEnabled);
  const capNumber = useStore((state) => state.capNumber);

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filteredTasks = tasks.filter((task) => {
      if (activeFilter === "active" && task.completed) return false;
      if (activeFilter === "completed" && !task.completed) return false;
      if (query && !task.text.toLowerCase().includes(query)) return false;
      return true;
    });

    return capEnabled ? filteredTasks.slice(0, capNumber) : filteredTasks;
  }, [tasks, activeFilter, searchQuery, capEnabled, capNumber]);

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
