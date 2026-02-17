// @vitest-environment node

import { describe, expect, it } from "vitest";
import { generateTodos } from "../../packages/shared-core";

describe("generateTodos", () => {
  it("returns the requested count", () => {
    const todos = generateTodos(5);
    expect(todos).toHaveLength(5);
  });

  it("returns valid Todo object", () => {
    const [todo] = generateTodos(1);

    expect(todo).toHaveProperty("id");
    expect(typeof todo.id).toBe("string");
    expect(todo).toHaveProperty("text");
    expect(typeof todo.text).toBe("string");
    expect(todo).toHaveProperty("completed");
    expect(typeof todo.completed).toBe("boolean");
    expect(todo).toHaveProperty("editing");
    expect(typeof todo.editing).toBe("boolean");
  });

  it("generates unique ids", () => {
    const todos = generateTodos(20);
    const ids = new Set(todos.map((t) => t.id));

    expect(ids.size).toBe(todos.length);
  });

  it("does not mark todos as completed by default", () => {
    const toods = generateTodos(5);
    expect(toods.every((t) => t.completed === false)).toBe(true);
  });
});
