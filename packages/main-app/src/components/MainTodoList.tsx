import { TodoListEmptyState, TodoItem, TodoStats } from "@packages/shared-ui";

import { useTodoMainState } from "../hooks/useTodoMainState";
import {
  initialTasks,
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
    activeFilter,
    add,
    addMany,
    edit,
    update,
    remove,
    removeMany,
    removeCompleted,
    toggle,
    toggleMany,
    changeFilter,
    search,
    reset,
    itemStatsVisible,
    changeStatsVisibility,
    changeCapEnabled,
    capEnabled,
    chageCapNumber,
    capNumber,
    stats
  } = useTodoMainState(initialTasks, listStats);

  const listRef = useRef<HTMLDivElement>(null);
  useHighlight(listRef);

  return (
    <>
      <div className="flex flex-wrap gap-x-4 items-center text-xs">
        <TodoSearch onSearch={search} />
        <TodoFilters activeFilter={activeFilter} onChange={changeFilter} />
        <TodoOptions
          onStatsVisibilityChange={changeStatsVisibility}
          statsVisible={itemStatsVisible}
          onCapEnabledChange={changeCapEnabled}
          capEnabled={capEnabled}
        />
        <TodoActions
          visibleTaskIds={filteredTasks.map((t) => t.id)}
          addMany={addMany}
          toggleMany={toggleMany}
          removeMany={removeMany}
          reset={reset}
          removeCompleted={removeCompleted}
          onCapNumberChange={chageCapNumber}
          capNumber={capNumber}
          capEnabled={capEnabled}
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
          scope={SCOPE}
          resetLastRenderTotalTime={listStats.resetLastRenderTotalTime}
        />
      </div>
      <div ref={listRef} className="max-h-[320px] overflow-y-auto -m-2.5 p-2.5">
        {filteredTasks.length ? (
          filteredTasks.map((task) => (
            <div key={task.id}>
              <TodoItem
                task={task}
                onDelete={remove}
                onEdit={edit}
                onUpdate={update}
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
