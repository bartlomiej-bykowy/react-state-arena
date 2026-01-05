import { useCallback, useMemo, useState } from "react";
import type { Filter, Todo } from "@packages/shared-ui";
import type { useListStats } from "@packages/shared-core";

export function useTodoMainState(
  initialState: Todo[],
  listStatsHook: ReturnType<typeof useListStats>
) {
  const [tasks, setTasks] = useState<Todo[]>(initialState);
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { startTiming } = listStatsHook;

  const add = useCallback(
    (text: string) => {
      startTiming();
      const newTask: Todo = {
        id: crypto.randomUUID(),
        text,
        completed: false
      };
      setTasks((oldTasks) => [newTask, ...oldTasks]);
    },
    [startTiming]
  );

  const remove = useCallback(
    (taskId: string) => {
      startTiming();
      setTasks((oldTasks) => oldTasks.filter((task) => task.id !== taskId));
    },
    [startTiming]
  );

  const edit = useCallback(
    (taskId: string, text: string) => {
      startTiming();
      setTasks((oldTasks) => {
        return oldTasks.map((task) =>
          task.id !== taskId ? task : { ...task, text }
        );
      });
    },
    [startTiming]
  );

  const toggle = useCallback(
    (taskId: string) => {
      startTiming();
      setTasks((oldTasks) => {
        return oldTasks.map((task) =>
          task.id !== taskId ? task : { ...task, completed: !task.completed }
        );
      });
    },
    [startTiming]
  );

  const filteredTasks = useMemo(() => {
    const filteredTasks = tasks.filter((task) => {
      if (filter === "active" && task.completed) return false;
      if (filter === "completed" && !task.completed) return false;
      return true;
    });
    return filteredTasks.filter((task) =>
      task.text.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [tasks, filter, searchQuery]);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      active: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length
    }),
    [tasks]
  );

  return {
    filteredTasks,
    filter,
    add,
    edit,
    remove,
    toggle,
    setFilter,
    setSearchQuery,
    stats
  };
}
