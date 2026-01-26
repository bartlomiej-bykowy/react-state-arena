import { useCallback, useMemo, useState } from "react";
import { generateUUID } from "@packages/shared-core";
import type { useListStats, Filter, Todo } from "@packages/shared-core";
import { dispatchTodoAction } from "../utils/dispatchTodoAction";

export function useTodoMainState(
  initialState: Todo[],
  listStatsHook: ReturnType<typeof useListStats>
) {
  const [tasks, setTasks] = useState<Todo[]>(initialState);
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemStatsVisible, setItemStatsVisible] = useState(false);

  const { startTiming } = listStatsHook;

  const add = useCallback(
    (text: string) => {
      startTiming();
      const newTask: Todo = {
        id: generateUUID(),
        text,
        completed: false,
        editing: false
      };
      setTasks((oldTasks) => [newTask, ...oldTasks]);
      dispatchTodoAction({ type: "add", payload: { task: newTask } });
    },
    [startTiming]
  );

  const remove = useCallback(
    (taskId: string) => {
      startTiming();
      setTasks((oldTasks) => oldTasks.filter((task) => task.id !== taskId));
      dispatchTodoAction({ type: "remove", payload: { id: taskId } });
    },
    [startTiming]
  );

  const edit = useCallback(
    (taskId: string, value: boolean) => {
      startTiming();
      setTasks((oldTasks) => {
        return oldTasks.map((task) =>
          task.id !== taskId ? task : { ...task, editing: value }
        );
      });
      dispatchTodoAction({
        type: "edit",
        payload: { id: taskId, editing: value }
      });
    },
    [startTiming]
  );

  const update = useCallback(
    (taskId: string, text: string) => {
      startTiming();
      setTasks((oldTasks) => {
        return oldTasks.map((task) =>
          task.id !== taskId ? task : { ...task, text }
        );
      });
      dispatchTodoAction({ type: "update", payload: { id: taskId, text } });
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
      dispatchTodoAction({ type: "toggle", payload: { id: taskId } });
    },
    [startTiming]
  );

  const changeStatsVisibility = useCallback(
    (visible: boolean) => {
      startTiming();

      setItemStatsVisible(visible);
      dispatchTodoAction({ type: "showStats", payload: { show: visible } });
    },
    [startTiming]
  );

  const changeFilter = useCallback(
    (newFilter: Filter) => {
      startTiming();
      setFilter(newFilter);
      dispatchTodoAction({
        type: "filter",
        payload: { query: searchQuery, filter: newFilter }
      });
    },
    [startTiming]
  );

  const search = useCallback(
    (query: string) => {
      startTiming();
      setSearchQuery(query);
      dispatchTodoAction({
        type: "filter",
        payload: { query, filter }
      });
    },
    [startTiming]
  );

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

  // BULK ACTIONS

  const addMany = useCallback(
    (todos: Todo[]) => {
      startTiming();
      setTasks((oldTasks) => [...todos, ...oldTasks]);
      dispatchTodoAction({ type: "addMany", payload: { tasks: todos } });
    },
    [startTiming]
  );

  const removeMany = useCallback(
    (ids: Set<string>) => {
      startTiming();

      setTasks((oldTasks) => oldTasks.filter((task) => !ids.has(task.id)));
      dispatchTodoAction({ type: "removeMany", payload: { ids } });
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
      dispatchTodoAction({ type: "toggleMany", payload: { ids } });
    },
    [startTiming]
  );

  const reset = useCallback(() => {
    startTiming();
    setTasks(initialState);
    setFilter("all");
    setSearchQuery("");

    dispatchTodoAction({ type: "reset", payload: { tasks: initialState } });
  }, [startTiming, initialState]);

  const removeCompleted = useCallback(() => {
    startTiming();
    setTasks((oldTasks) => oldTasks.filter((task) => !task.completed));
    dispatchTodoAction({ type: "removeCompleted" });
  }, [startTiming]);

  return {
    filteredTasks,
    filter,
    changeFilter,
    search,
    add,
    addMany,
    edit,
    update,
    remove,
    removeMany,
    toggle,
    toggleMany,
    reset,
    removeCompleted,
    stats,
    itemStatsVisible,
    changeStatsVisibility
  };
}
