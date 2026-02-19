import type { TodoAction } from "@packages/shared-core";

declare module "*.css";

declare global {
  interface WindowEventMap {
    "rsa:todo-action": CustomEvent<TodoAction>;
    "rsa:state-request": CustomEvent;
  }
}
