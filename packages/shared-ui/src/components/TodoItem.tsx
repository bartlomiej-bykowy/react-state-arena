import { memo, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import type { Todo } from "../..";
import { useItemStats } from "@packages/shared-core";

export type TodoItemProps = {
  task: Todo;
  readonly?: boolean;
  onToggle?: (id: string) => void;
  onEdit?: (id: string, text: string) => void;
  onDelete?: (id: string) => void;
};

export const TodoItem = memo(function TodoItem({
  task,
  readonly,
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
    <div className="relative px-5 py-4 w-full flex items-center gap-x-4 hover:bg-gray-100 rounded-xl mb-4 shadow-[0_0_12px_0_rgba(66,68,90,0.25)]">
      <span ref={rendersCountRef}></span>
      <span ref={renderTimesRef}></span>
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
        <div className="flex relative flex-col">
          <label htmlFor={`htmlInput-${task.id}`} className="sr-only">
            Edit task
          </label>
          <input
            type="text"
            defaultValue={task.text}
            id={`htmlInput-${task.id}`}
            onKeyDown={handleKeyPress}
            className="p-3 mb-1 w-full rounded-md border border-gray-400"
            autoFocus
          />
          <p className="text-sm text-gray-600">
            (Press Enter to accept, press Esc to cancel)
          </p>
        </div>
      )}
      <div className="flex gap-x-2 items-center ml-auto">
        {!task.completed && (
          <button
            title="Edit"
            className={`w-10 h-10 flex items-center justify-center ${task.completed ? "cursor-not-allowed" : "cursor-pointer"}`}
            onClick={(e) => handleEdit(e)}
            disabled={readonly || task.completed}
          >
            🖊️
          </button>
        )}
        <button
          title="Delete"
          className="flex justify-center items-center w-10 h-10 cursor-pointer"
          onClick={(e) => handleDelete(e)}
          disabled={readonly}
        >
          🗑️
        </button>
      </div>
    </div>
  );
});
