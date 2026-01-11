import {
  TodoAddItem,
  // TodoActions,
  // TodoAddItem,
  TododListEmptyState,
  TodoFilters,
  // TodoFilters,
  TodoItem,
  TodoSearch,
  TodoStats
  // TodoSearch,
  // TodoStats
} from "@packages/shared-ui/index";
import { initialTasks } from "../initialTasks";
import { useTodoMainState } from "../hooks/useTodoMainState";
import { useListStats } from "@packages/shared-core";
import { useLayoutEffect } from "react";
import { TodoActions } from "./TodoActions";

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
    stats
  } = useTodoMainState(initialTasks, listStats);

  listStats.startTiming();

  useLayoutEffect(() => {
    listStats.recordRender();
    listStats.endTiming();
  });

  return (
    <>
      <div className="flex items-center px-5 py-4 mb-8 bg-purple-600 rounded-md">
        <TodoSearch onSearch={setSearchQuery} />
        <TodoFilters activeFilter={filter} onChange={setFilter} />
        <TodoActions
          visibleTaskIds={filteredTasks.map((t) => t.id)}
          addMany={addMany}
          toggleMany={toggleMany}
          removeMany={removeMany}
          reset={reset}
          removeCompleted={removeCompleted}
        />
      </div>
      <div className="mb-8">
        <TodoAddItem onSave={add} />
      </div>
      <TodoStats
        total={stats.total}
        active={stats.active}
        completed={stats.completed}
      />
      {filteredTasks.length ? (
        filteredTasks.map((task) => (
          <div key={task.id}>
            <TodoItem
              task={task}
              onDelete={remove}
              onEdit={edit}
              onToggle={toggle}
            />
          </div>
        ))
      ) : (
        <TododListEmptyState />
      )}
    </>
  );
}
