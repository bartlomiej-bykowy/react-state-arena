import type { Filter, Todo, useListStats } from "@packages/shared-core";
import { generateUUID, TASKS_CAP } from "@packages/shared-core";
import { useCallback, useMemo, useState } from "react";
import { dispatchTodoAction } from "../utils/dispatchTodoAction";

export function useTodoMainState(
  initialState: Todo[],
  listStatsHook: ReturnType<typeof useListStats>
) {
  const [tasks, setTasks] = useState<Todo[]>(initialState);
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemStatsVisible, setItemStatsVisible] = useState(false);
  const [capEnabled, setCapEnabled] = useState(false);
  const [capNumber, setCapNumber] = useState(TASKS_CAP);

  const { startTiming } = listStatsHook;

  const add = useCallback(
    (text: string) => {
      const newTask: Todo = {
        id: generateUUID(),
        text,
        completed: false,
        editing: false
      };
      startTiming();
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

  const changeCapEnabled = useCallback(
    (enable: boolean) => {
      startTiming();
      setCapEnabled(enable);
      dispatchTodoAction({ type: "cap", payload: { enable, capNumber } });
    },
    [startTiming]
  );

  const chageCapNumber = useCallback(
    (num: number) => {
      startTiming();
      setCapNumber(num);
      dispatchTodoAction({
        type: "cap",
        payload: { enable: capEnabled, capNumber: num }
      });
    },
    [startTiming, capEnabled]
  );

  const changeFilter = useCallback(
    (newFilter: Filter) => {
      startTiming();
      setActiveFilter(newFilter);
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
        payload: { query, filter: activeFilter }
      });
    },
    [startTiming]
  );

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
      dispatchTodoAction({ type: "removeMany", payload: { ids: [...ids] } });
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
      dispatchTodoAction({ type: "toggleMany", payload: { ids: [...ids] } });
    },
    [startTiming]
  );

  const reset = useCallback(() => {
    startTiming();
    setTasks(initialState);
    setActiveFilter("all");
    setSearchQuery("");
    setCapNumber(TASKS_CAP);

    dispatchTodoAction({ type: "reset", payload: { tasks: initialState } });
  }, [startTiming, initialState]);

  const removeCompleted = useCallback(() => {
    startTiming();
    setTasks((oldTasks) => oldTasks.filter((task) => !task.completed));
    dispatchTodoAction({ type: "removeCompleted" });
  }, [startTiming]);

  return {
    filteredTasks,
    activeFilter,
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
    changeStatsVisibility,
    changeCapEnabled,
    capEnabled,
    chageCapNumber,
    capNumber
  };
}
