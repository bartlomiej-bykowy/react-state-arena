import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";

import { type Todo, useItemStats } from "@packages/shared-core";

export type TodoItemProps = {
  task: Todo;
  readonly?: boolean;
  statsVisible: boolean;
  onToggle?: (id: string) => void;
  onEdit?: (id: string, text: string) => void;
  onDelete?: (id: string) => void;
};

export const TodoItem = memo(function TodoItem({
  task,
  readonly,
  statsVisible,
  onToggle,
  onEdit,
  onDelete
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const itemStats = useItemStats(task.id);
  itemStats.startTiming();
  const rendersCountRef = useRef<HTMLSpanElement>(null);
  const renderTimesRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    itemStats.recordRender();
    itemStats.endTiming();

    const { renders, timing } = itemStats.stats!;

    rendersCountRef.current!.textContent = renders.toString();
    renderTimesRef.current!.textContent = `Render time: last = ${timing.lastMs.toFixed(2)}ms • total = ${timing.totalMs.toFixed(2)}ms`;
  });

  useEffect(() => {
    return () => itemStats.removeItem();
  }, []);

  const handleToggle = () => {
    if (readonly) return;

    onToggle?.(task.id);
  };

  const handleEdit = (e: MouseEvent) => {
    if (readonly || task.completed) return;

    e.preventDefault();
    setIsEditing(true);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (readonly) return;

    e.stopPropagation();
    if (e.key === "Enter") {
      const input = e.target as HTMLInputElement;
      if (input.value.trim() === "") return;
      onEdit?.(task.id, input.value);
      setIsEditing(false);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const handleDelete = (e: MouseEvent) => {
    if (readonly) return;

    e.preventDefault();
    onDelete?.(task.id);
  };

  return (
    <div className="relative px-3 py-2 w-full flex items-center gap-x-4 hover:bg-gray-100 rounded-md mb-4 shadow-[0_0_12px_0_rgba(66,68,90,0.25)] text-xs">
      <div
        className={`flex absolute top-0 right-0 gap-x-3 items-center text-[10px] -translate-y-1/2 ${!statsVisible ? "invisible" : ""}`}
      >
        <span
          className="px-1 py-0.5 bg-green-400 rounded-full"
          ref={renderTimesRef}
        ></span>
        <span
          className="flex justify-center items-center h-[18px] text-white bg-red-400 rounded-full min-w-[18px]"
          ref={rendersCountRef}
        ></span>
      </div>

      <label htmlFor={`task-${task.id}-checkbox`} className="sr-only">
        Mark the task as {task.completed ? "to do" : "completed"}
      </label>
      <input
        type="checkbox"
        checked={task.completed}
        id={`task-${task.id}-checkbox`}
        onChange={handleToggle}
        disabled={readonly}
      />
      {!isEditing ? (
        <p
          className={`${task.completed ? "line-through text-gray-500" : ""}`}
          aria-live="polite"
        >
          {task.text}
        </p>
      ) : (
        <div className="flex relative gap-x-2 items-center">
          <label htmlFor={`htmlInput-${task.id}`} className="sr-only">
            Edit task
          </label>
          <input
            type="text"
            defaultValue={task.text}
            id={`htmlInput-${task.id}`}
            onKeyDown={handleKeyPress}
            className="px-2 py-1 w-full rounded-md border border-gray-400"
            autoFocus
          />
          <p className="text-[10px] text-gray-600 whitespace-nowrap">
            (Press Enter to accept, press Esc to cancel)
          </p>
        </div>
      )}
      <div className="flex gap-x-2 items-center ml-auto">
        {!task.completed && !isEditing && (
          <button
            title="Edit"
            className={`w-7 h-7 flex items-center justify-center ${task.completed ? "cursor-not-allowed" : "cursor-pointer"}`}
            onClick={(e) => handleEdit(e)}
            disabled={readonly || task.completed}
          >
            🖊️
          </button>
        )}
        <button
          title="Delete"
          className="flex justify-center items-center w-7 h-7 cursor-pointer"
          onClick={(e) => handleDelete(e)}
          disabled={readonly}
        >
          🗑️
        </button>
      </div>
    </div>
  );
});
