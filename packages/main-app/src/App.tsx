import { useState } from "react";
import {
  TodoAddItem,
  TododListEmptyState,
  TodoFilters,
  TodoItem,
  TodoSearch,
  type Todo,
  type Filter,
  TodoStats
} from "@packages/shared-ui/index";
import { initialTasks } from "./initialTasks";

export default function App() {
  const [tasks, setTasks] = useState<Todo[]>(initialTasks);
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const addNewTask = (text: string) => {
    const newTask: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false
    };
    setTasks((tasks) => [newTask, ...tasks]);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const editTask = (taskId: string, text: string) => {
    setTasks((oldTasks) => {
      return oldTasks.map((task) =>
        task.id !== taskId ? task : { ...task, text }
      );
    });
  };

  const toggleTask = (taskId: string) => {
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

  return (
    <>
      <div className="flex items-center px-5 py-4 mb-8 bg-purple-600 rounded-md">
        <TodoSearch onSearch={setSearchQuery} />
        <TodoFilters activeFilter={filter} onChange={setFilter} />
      </div>
      <div className="mb-8">
        <TodoAddItem onSave={addNewTask} />
      </div>
      <TodoStats total={0} active={0} completed={0} />
      {filteredTasks().length ? (
        filteredTasks().map((task) => (
          <div key={task.id}>
            <TodoItem
              task={task}
              onDelete={deleteTask}
              onEdit={editTask}
              onToggle={toggleTask}
            />
          </div>
        ))
      ) : (
        <TododListEmptyState />
      )}
    </>
  );
}
