import { TodoListEmptyState, TodoItem, TodoStats } from "@packages/shared-ui";

import {
  useHighlight,
  useListStats,
  type ScopeKey
} from "@packages/shared-core";
import { useRef } from "react";
import { useReduxTodoState } from "../hooks/useReduxTodoState";
import { useTodoEvents } from "../hooks/useTodoEvents";

const SCOPE: ScopeKey = "redux";

export function ReduxTodoList() {
  const listStats = useListStats(SCOPE);
  useTodoEvents(listStats);
  const { filteredTasks, stats, showStatsPerItem } = useReduxTodoState();

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
        />
      </div>

      <div ref={listRef}>
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
