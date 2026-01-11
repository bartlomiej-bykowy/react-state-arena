import type { Todo } from "./types";

export function generateTodos(count: number): Todo[] {
  const todos: Todo[] = [];

  for (let i = 1; i <= count; i++) {
    todos.push({
      id: crypto.randomUUID(),
      text: `Generated Task ${i}`,
      completed: false
    });
  }

  return todos;
}
