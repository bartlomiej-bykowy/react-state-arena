import { TodoListEmptyState, TodoItem, TodoStats } from "@packages/shared-ui";

import {
  useHighlight,
  useListStats,
  type ScopeKey
} from "@packages/shared-core";
import { useRef } from "react";
import { useContextTodoState } from "../hooks/useContextTodoState";

const SCOPE: ScopeKey = "context";

export function ContextTodoList() {
  const listStats = useListStats(SCOPE);
  const { filteredTasks, itemStatsVisible, stats } =
    useContextTodoState(listStats);

  const listRef = useRef<HTMLDivElement>(null);
  useHighlight(listRef);

  return (
    <>
      <div className="mb-5">
        <TodoStats
          total={stats.total}
          active={stats.active}
          completed={stats.completed}
        />
      </div>

      <div ref={listRef}>
        {filteredTasks.length ? (
          filteredTasks.map((task) => (
            <div key={task.id}>
              <TodoItem
                task={task}
                readonly={true}
                statsVisible={itemStatsVisible}
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
