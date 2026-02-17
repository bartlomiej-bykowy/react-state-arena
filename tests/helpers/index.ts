import {
  TASKS_CAP,
  type Todo,
  type TodoStoreState
} from "../../packages/shared-core";

export function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: "t1",
    text: "Buy milk",
    completed: false,
    editing: false,
    ...overrides
  };
}

export function makeState(
  partial: Partial<TodoStoreState> = {}
): TodoStoreState {
  return {
    tasks: [makeTodo({ id: "a" }), makeTodo({ id: "b", completed: true })],
    activeFilter: "all",
    searchQuery: "",
    showStatsPerItem: false,
    capEnabled: false,
    capNumber: TASKS_CAP,
    ...partial
  };
}

export function makeListStatsHook() {
  return {
    startTiming: vi.fn()
    // biome-ignore lint/suspicious/noExplicitAny: ""
  } as any;
}
