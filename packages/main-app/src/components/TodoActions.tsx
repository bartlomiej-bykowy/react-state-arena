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

const buttonStyles =
  "px-3 py-2 rounded-md cursor-pointer text-white bg-blue-700";

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
    <div className="flex gap-x-3 items-center mb-4 whitespace-nowrap">
      <div className="flex gap-x-3 items-center p-2 rounded-md border border-gray-400 border-dashed">
        <button onClick={handleAddMany} className={buttonStyles}>
          Add
        </button>
        <button onClick={handleToggleMany} className={buttonStyles}>
          Toggle
        </button>
        <button onClick={handleRemoveMany} className={buttonStyles}>
          Remove
        </button>

        <label htmlFor="number-of-tasks" className="sr-only">
          Set number of tasks
        </label>
        <input
          id="number-of-tasks"
          type="number"
          value={numOfTasks}
          min={0}
          onChange={(e) =>
            setNumOfTasks(
              Number(e.target.value) < 1 ? 1 : Number(e.target.value)
            )
          }
          className="max-w-[75px] px-3 py-2 rounded-md border border-gray-400 focus:border-purple-600"
        />
        <span>tasks</span>
      </div>
      <button onClick={reset} className={buttonStyles}>
        Reset
      </button>
      <button onClick={removeCompleted} className={buttonStyles}>
        Remove completed
      </button>
    </div>
  );
}
