export { generateTodos } from "./src/generateTodos";
export { generateUUID } from "./src/generateUUID";
export { useHighlight } from "./src/hooks/useHighlight";
export { useItemStats } from "./src/hooks/useItemStats";
export { useListStats } from "./src/hooks/useListStats";
export { useSignal } from "./src/hooks/useSignal";
export { initialTasks } from "./src/initialTasks";
export { resetMetrics } from "./src/resetMetrics";

export { createSignal, type Subscriber } from "./src/signal";
export { refreshUISignal } from "./src/signals";
export {
  highlightRenders,
  measuringEnabled,
  setHighlightRenders,
  setMeasuringEnabled,
  TASKS_CAP
} from "./src/todoOptions";
// export * from "./src/types";
export type {
  Filter,
  ScopeKey,
  Todo,
  TodoAction,
  TodoStoreState
} from "./src/types";
