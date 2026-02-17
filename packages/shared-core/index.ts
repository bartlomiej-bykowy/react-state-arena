export { initialTasks } from "./src/data/initialTasks";
export { registry, type Stats, type Timing } from "./src/data/registry";
export { useHighlight } from "./src/hooks/useHighlight";
export { useItemStats } from "./src/hooks/useItemStats";
export { useListStats } from "./src/hooks/useListStats";
export { useSignal } from "./src/hooks/useSignal";
export { createSignal, type Subscriber } from "./src/signal/signal";
export { refreshUISignal } from "./src/signal/signals";
export type {
  Filter,
  ScopeKey,
  Todo,
  TodoAction,
  TodoStoreState
} from "./src/types";
export { ensureRecordInRegistry } from "./src/utils/ensureRecordInRegistry";
export { generateTodos } from "./src/utils/generateTodos";
export { generateUUID } from "./src/utils/generateUUID";
export { resetMetrics } from "./src/utils/resetMetrics";
export {
  highlightRenders,
  measuringEnabled,
  setHighlightRenders,
  setMeasuringEnabled,
  TASKS_CAP
} from "./src/utils/todoOptions";
