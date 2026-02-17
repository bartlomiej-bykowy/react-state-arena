import type { TodoAction } from "@packages/shared-core";

export type StoreMethods = {
  applyEvent: (action: TodoAction) => void;
} & {
  [K in TodoAction["type"]]: (
    payload: Extract<TodoAction, { type: K }>["payload"]
  ) => void;
} & {
  removeCompleted: () => void;
  reset: () => void;
};
