import type { Todo } from "../types";
import { generateUUID } from "../utils/generateUUID";

export const initialTasks: Todo[] = [
  {
    id: generateUUID(),
    text: "Buy groceries",
    completed: false,
    editing: false
  },
  {
    id: generateUUID(),
    text: "Clean the kitchen",
    completed: false,
    editing: false
  },
  {
    id: generateUUID(),
    text: "Prepare meeting notes",
    completed: false,
    editing: false
  },
  {
    id: generateUUID(),
    text: "Walk the dog",
    completed: false,
    editing: false
  },
  {
    id: generateUUID(),
    text: "Reply to emails",
    completed: false,
    editing: false
  }
];
