import { generateUUID, type Todo } from "@packages/shared-core";

export const initialTasks: Todo[] = [
  {
    id: generateUUID(),
    text: "Buy groceries",
    completed: false
  },
  {
    id: generateUUID(),
    text: "Clean the kitchen",
    completed: false
  },
  {
    id: generateUUID(),
    text: "Prepare meeting notes",
    completed: false
  },
  {
    id: generateUUID(),
    text: "Walk the dog",
    completed: false
  },
  {
    id: generateUUID(),
    text: "Reply to emails",
    completed: false
  }
];
