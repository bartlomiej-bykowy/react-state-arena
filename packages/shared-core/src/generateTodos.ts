import { generateUUID } from "./generateUUID";
import type { Todo } from "./types";

export function generateTodos(count: number): Todo[] {
  const todos: Todo[] = [];

  for (let i = 1; i <= count; i++) {
    todos.push({
      id: generateUUID(),
      text: `Generated Task ${i}`,
      completed: false,
      editing: false
    });
  }

  return todos;
}
