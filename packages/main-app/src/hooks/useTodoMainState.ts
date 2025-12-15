import { useState } from "react";
import type { Filter, Todo } from "shared-ui/types";

export function useTodoMainState(initialState: Todo[]) {
  const [tasks, setTasks] = useState<Todo[]>(initialState);
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const add = (text: string) => {
    const newTask: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false
    };
    setTasks((tasks) => [newTask, ...tasks]);
  };

  const remove = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const edit = (taskId: string, text: string) => {
    setTasks((oldTasks) => {
      return oldTasks.map((task) =>
        task.id !== taskId ? task : { ...task, text }
      );
    });
  };

  const toggle = (taskId: string) => {
    setTasks((oldTasks) => {
      return oldTasks.map((task) =>
        task.id !== taskId ? task : { ...task, completed: !task.completed }
      );
    });
  };

  const filteredTasks = () => {
    const filteredTasks = tasks.filter((task) => {
      if (filter === "active" && task.completed) return false;
      if (filter === "completed" && !task.completed) return false;
      return true;
    });
    return filteredTasks.filter((task) =>
      task.text.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  };

  const stats = {
    total: tasks.length,
    active: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length
  };

  return {
    tasks,
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
