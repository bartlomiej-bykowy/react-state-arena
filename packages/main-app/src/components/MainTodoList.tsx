import { TodoListEmptyState, TodoItem, TodoStats } from "@packages/shared-ui";
import { initialTasks } from "../initialTasks";
import { useTodoMainState } from "../hooks/useTodoMainState";
import {
  useHighlight,
  useListStats,
  type ScopeKey
} from "@packages/shared-core";
import { useRef } from "react";
import { TodoActions } from "./TodoActions";
import { TodoOptions } from "./TodoOptions";
import { TodoSearch } from "./TodoSearch";
import { TodoFilters } from "./TodoFilters";
import { TodoAddItem } from "./TodoAddItem";

const SCOPE: ScopeKey = "main";

export function MainTodoList() {
  const listStats = useListStats(SCOPE);
  const {
    filteredTasks,
    filter,
    add,
    addMany,
    edit,
    remove,
    removeMany,
    removeCompleted,
    toggle,
    toggleMany,
    changeFilter,
    search,
    reset,
    itemStatsVisible,
    setItemStatsVisible,
    stats
  } = useTodoMainState(initialTasks, listStats);

  const listRef = useRef<HTMLDivElement>(null);
  useHighlight(listRef);

  return (
    <>
      <div className="flex flex-wrap gap-x-4 items-center text-xs">
        <TodoSearch onSearch={search} />
        <TodoFilters activeFilter={filter} onChange={changeFilter} />
        <TodoOptions onChange={setItemStatsVisible} value={itemStatsVisible} />
        <TodoActions
          visibleTaskIds={filteredTasks.map((t) => t.id)}
          addMany={addMany}
          toggleMany={toggleMany}
          removeMany={removeMany}
          reset={reset}
          removeCompleted={removeCompleted}
        />
      </div>
      <div className="mb-5">
        <TodoAddItem onSave={add} />
      </div>
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
                onDelete={remove}
                onEdit={edit}
                onToggle={toggle}
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
