import type { TodoAction } from "@packages/shared-core";

export function dispatchTodoAction(action: TodoAction) {
  const todoActionEvent = new CustomEvent("rsa:todo-action", {
    detail: action
  });

  window.dispatchEvent(todoActionEvent);
}
