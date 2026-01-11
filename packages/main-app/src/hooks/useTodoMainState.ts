import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { useListStats, Filter, Todo } from "@packages/shared-core";

export function useTodoMainState(
  initialState: Todo[],
  listStatsHook: ReturnType<typeof useListStats>
) {
  const [tasks, setTasks] = useState<Todo[]>(initialState);
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const visibleIdsRef = useRef<string[]>([]);

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
    const query = searchQuery.trim().toLowerCase();
    return filteredTasks.filter((task) =>
      task.text.toLowerCase().includes(query)
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

  useEffect(() => {
    visibleIdsRef.current = filteredTasks.map((ft) => ft.id);
  }, [filteredTasks]);

  // BULK ACTIONS

  const addMany = useCallback(
    (todos: Todo[]) => {
      startTiming();
      setTasks((oldTasks) => [...oldTasks, ...todos]);
    },
    [startTiming]
  );

  const removeMany = useCallback(
    (ids: Set<string>) => {
      startTiming();

      setTasks((oldTasks) => oldTasks.filter((task) => !ids.has(task.id)));
    },
    [startTiming]
  );

  const toggleMany = useCallback(
    (ids: Set<string>) => {
      startTiming();

      setTasks((oldTasks) =>
        oldTasks.map((task) =>
          ids.has(task.id) ? { ...task, completed: !task.completed } : task
        )
      );
    },
    [startTiming]
  );

  const reset = useCallback(() => {
    startTiming();
    setTasks(initialState);
    setFilter("all");
    setSearchQuery("");
  }, [startTiming, initialState]);

  const removeCompleted = useCallback(() => {
    startTiming();
    setTasks((oldTasks) => oldTasks.filter((task) => !task.completed));
  }, [startTiming]);

  return {
    filteredTasks,
    filter,
    add,
    addMany,
    edit,
    remove,
    removeMany,
    toggle,
    toggleMany,
    setFilter,
    setSearchQuery,
    reset,
    removeCompleted,
    stats
  };
}
