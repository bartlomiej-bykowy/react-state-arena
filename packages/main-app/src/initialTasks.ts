import type { Todo } from "@packages/shared-core";

export const initialTasks: Todo[] = [
  {
    id: crypto.randomUUID(),
    text: "Buy groceries",
    completed: false
  },
  {
    id: crypto.randomUUID(),
    text: "Clean the kitchen",
    completed: false
  },
  {
    id: crypto.randomUUID(),
    text: "Prepare meeting notes",
    completed: false
  },
  {
    id: crypto.randomUUID(),
    text: "Walk the dog",
    completed: false
  },
  {
    id: crypto.randomUUID(),
    text: "Reply to emails",
    completed: false
  }
];
