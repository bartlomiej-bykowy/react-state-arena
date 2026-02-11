import {
  type ScopeKey,
  useHighlight,
  useListStats
} from "@packages/shared-core";
import { TodoItem, TodoListEmptyState, TodoStats } from "@packages/shared-ui";
import { useRef } from "react";
import { useTodoEvents } from "../hooks/useTodoEvents";
import { useZustandTodoState } from "../hooks/useZustandTodoState";

const SCOPE: ScopeKey = "zustand";

export function ZustandTodoList() {
  const listStats = useListStats(SCOPE);
  useTodoEvents(listStats);
  const { filteredTasks, stats, showStatsPerItem } = useZustandTodoState();

  const listRef = useRef<HTMLDivElement>(null);
  useHighlight(listRef);

  return (
    <>
      <div className="mb-5">
        <TodoStats
          total={stats.total}
          active={stats.active}
          completed={stats.completed}
          scope={SCOPE}
          stats={listStats.stats}
        />
      </div>

      <div ref={listRef} className="max-h-[320px] overflow-y-auto -m-2.5 p-2.5">
        {filteredTasks.length ? (
          filteredTasks.map((task) => (
            <div key={task.id}>
              <TodoItem
                task={task}
                readonly={true}
                statsVisible={showStatsPerItem}
                scope={SCOPE}
              />
            </div>
          ))
        ) : (
          <TodoListEmptyState />
        )}
      </div>
    </>
  );
}
