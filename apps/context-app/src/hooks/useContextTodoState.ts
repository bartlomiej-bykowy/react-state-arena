import type { useListStats } from "@packages/shared-core";
import { useTodoDispatch } from "./useTodoDispatch";

export function useContextTodoState(
  listStats: ReturnType<typeof useListStats>
) {
  const dispatch = useTodoDispatch();

  return {};
}
