import { generateTodos, type Todo } from "@packages/shared-core";
import { useState } from "react";

type TodoActionsProps = {
  visibleTaskIds: string[];
  addMany: (todos: Todo[]) => void;
  toggleMany: (ids: Set<string>) => void;
  removeMany: (ids: Set<string>) => void;
  reset: () => void;
  removeCompleted: () => void;
};

export function TodoActions({
  visibleTaskIds,
  addMany,
  toggleMany,
  removeMany,
  reset,
  removeCompleted
}: TodoActionsProps) {
  const [numOfTasks, setNumOfTasks] = useState(10);

  const handleAddMany = () => {
    const tasks = generateTodos(numOfTasks);
    addMany(tasks);
  };

  const handleToggleMany = () => {
    const taskIdsToToggle = new Set(
      visibleTaskIds.slice(0, Math.min(numOfTasks, visibleTaskIds.length))
    );

    toggleMany(taskIdsToToggle);
  };

  const handleRemoveMany = () => {
    const taskIdsToRemove = new Set(
      visibleTaskIds.slice(0, Math.min(numOfTasks, visibleTaskIds.length))
    );

    removeMany(taskIdsToRemove);
  };

  return (
    <div className="flex gap-x-3 items-center">
      <label htmlFor="number-of-tasks" className="sr-only">
        Set number of tasks
      </label>
      <input
        type="number"
        placeholder="100"
        value={numOfTasks}
        onChange={(e) => setNumOfTasks(Number(e.target.value))}
      />
      <button onClick={handleAddMany}>Add {numOfTasks} tasks</button>
      <button onClick={handleToggleMany}>Toggle {numOfTasks} tasks</button>
      <button onClick={handleRemoveMany}>Remove {numOfTasks} tasks</button>
      <button onClick={reset}>Reset</button>
      <button onClick={removeCompleted}>Remove completed</button>
    </div>
  );
}
