import {
  TodoAddItem,
  TododListEmptyState,
  TodoFilters,
  TodoItem,
  TodoSearch,
  TodoStats
} from "@packages/shared-ui/index";
import { initialTasks } from "../initialTasks";
import { useTodoMainState } from "../hooks/useTodoMainState";
import { useHighlight, useListStats } from "@packages/shared-core";
import { useLayoutEffect, useRef } from "react";
import { TodoActions } from "./TodoActions";
import { TodoOptions } from "./TodoOptions";

export function MainTodoList() {
  const listStats = useListStats();
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
    setFilter,
    setSearchQuery,
    reset,
    itemStatsVisible,
    setItemStatsVisible,
    stats
  } = useTodoMainState(initialTasks, listStats);

  const listRef = useRef<HTMLDivElement>(null);
  useHighlight(listRef);

  listStats.startTiming();

  useLayoutEffect(() => {
    listStats.recordRender();
    listStats.endTiming();
  });

  return (
    <>
      <div className="flex flex-wrap gap-x-4 items-center text-xs">
        <TodoSearch onSearch={setSearchQuery} />
        <TodoFilters activeFilter={filter} onChange={setFilter} />
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
              />
            </div>
          ))
        ) : (
          <TododListEmptyState />
        )}
      </div>
    </>
  );
}
