import { memo, useLayoutEffect, useRef } from "react";
import type { KeyboardEvent, MouseEvent } from "react";

import {
  itemStatsUiRefreshSignal,
  useHighlight,
  useItemStats,
  type ScopeKey,
  type Todo
} from "@packages/shared-core";

export type TodoItemProps = {
  task: Todo;
  readonly?: boolean;
  statsVisible: boolean;
  scope: ScopeKey;
  onToggle?: (id: string) => void;
  onUpdate?: (id: string, text: string) => void;
  onEdit?: (id: string, val: boolean) => void;
  onDelete?: (id: string) => void;
};

export const TodoItem = memo(function TodoItem({
  task,
  readonly,
  statsVisible,
  scope,
  onToggle,
  onUpdate,
  onEdit,
  onDelete
}: TodoItemProps) {
  const itemStats = useItemStats(task.id, scope);
  const rendersCountRef = useRef<HTMLSpanElement>(null);
  const renderTimesRef = useRef<HTMLSpanElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  useHighlight(itemRef);

  if (statsVisible) {
    itemStatsUiRefreshSignal.subscribe;
  }

  useLayoutEffect(() => {
    if (statsVisible) {
      const { renders, timing } = itemStats.stats!;
      rendersCountRef.current!.textContent = renders.toString();
      renderTimesRef.current!.textContent = `Render time: last = ${timing.lastMs.toFixed(2)}ms • total = ${timing.totalMs.toFixed(2)}ms`;
    }
  });

  const handleToggle = () => {
    if (readonly) return;

    onToggle?.(task.id);
  };

  const handleEdit = (e: MouseEvent) => {
    if (readonly || task.completed) return;

    e.preventDefault();
    onEdit?.(task.id, true);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (readonly) return;

    e.stopPropagation();
    if (e.key === "Enter") {
      const input = e.target as HTMLInputElement;
      if (input.value.trim() === "") return;
      onUpdate?.(task.id, input.value);
      onEdit?.(task.id, false);
    }
    if (e.key === "Escape") {
      onEdit?.(task.id, false);
    }
  };

  const handleDelete = (e: MouseEvent) => {
    if (readonly) return;

    e.preventDefault();
    onDelete?.(task.id);
  };

  return (
    <div
      className={`relative px-3 py-2 w-full flex items-center gap-x-4 ${readonly ? "" : "hover:bg-gray-100"} rounded-md mb-4 shadow-[0_0_12px_0_rgba(66,68,90,0.25)] text-xs`}
      ref={itemRef}
    >
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
        Mark as {task.completed ? "not completed" : "completed"}
      </label>
      <input
        type="checkbox"
        checked={task.completed}
        id={`task-${task.id}-checkbox`}
        onChange={handleToggle}
        disabled={readonly}
        className={readonly ? "cursor-not-allowed" : ""}
      />
      {!task.editing ? (
        <p className={`${task.completed ? "line-through text-gray-500" : ""}`}>
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
            disabled={readonly}
          />
          <p className="text-[10px] text-gray-600 whitespace-nowrap">
            (Press Enter to accept, press Esc to cancel)
          </p>
        </div>
      )}
      {!readonly && (
        <div className="flex gap-x-2 items-center ml-auto">
          {!task.completed && !task.editing && (
            <button
              title="Edit"
              aria-label="Edit"
              className={`w-7 h-7 flex items-center justify-center ${task.completed ? "cursor-not-allowed" : "cursor-pointer"}`}
              onClick={(e) => handleEdit(e)}
              disabled={readonly || task.completed}
            >
              🖊️
            </button>
          )}
          <button
            title="Delete"
            aria-label="Delete"
            className="flex justify-center items-center w-7 h-7 cursor-pointer"
            onClick={(e) => handleDelete(e)}
            disabled={readonly}
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
});
