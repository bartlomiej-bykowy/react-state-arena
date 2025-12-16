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
import { useRenderCounter } from "@packages/shared-core";

export function MainTodoList() {
  const {
    filteredTasks,
    filter,
    add,
    edit,
    remove,
    toggle,
    setFilter,
    setSearchQuery,
    stats
  } = useTodoMainState(initialTasks);

  const renderCounter = useRenderCounter();

  renderCounter.incrementListRenders();

  return (
    <>
      <div className="flex items-center px-5 py-4 mb-8 bg-purple-600 rounded-md">
        <TodoSearch onSearch={setSearchQuery} />
        <TodoFilters activeFilter={filter} onChange={setFilter} />
      </div>
      <div className="mb-8">
        <TodoAddItem onSave={add} />
      </div>
      <TodoStats
        total={stats.total}
        active={stats.active}
        completed={stats.completed}
        renders={{
          list: renderCounter.listRenders,
          items: renderCounter.itemRenders
        }}
      />
      {filteredTasks.length ? (
        filteredTasks.map((task) => (
          <div key={task.id}>
            <TodoItem
              task={task}
              onDelete={remove}
              onEdit={edit}
              onToggle={toggle}
              onRender={renderCounter.incrementItemRenders}
            />
          </div>
        ))
      ) : (
        <TododListEmptyState />
      )}
    </>
  );
}
