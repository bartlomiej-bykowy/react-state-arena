// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
  selectFilteredTasks,
  selectTodosStats
} from "../../apps/redux-app/src/store/selectors";
import { makeState, makeTodo } from "../helpers";

describe("Redux app: selectors", () => {
  it("selectFilteredTasks: filters by query + completed and applies cap", () => {
    let state = makeState({
      searchQuery: "milk",
      tasks: [makeTodo({ id: "a" }), makeTodo({ id: "b", completed: true })]
    });
    expect(selectFilteredTasks({ todo: state }).map((x) => x.id)).toEqual([
      "a",
      "b"
    ]);

    state = makeState({
      searchQuery: "milk",
      activeFilter: "completed",
      tasks: [makeTodo({ id: "a" }), makeTodo({ id: "b", completed: true })]
    });
    expect(selectFilteredTasks({ todo: state }).map((x) => x.id)).toEqual([
      "b"
    ]);

    state = makeState({
      searchQuery: "",
      activeFilter: "all",
      capEnabled: true,
      capNumber: 2,
      tasks: [
        makeTodo({ id: "a" }),
        makeTodo({ id: "b", completed: true }),
        makeTodo({ id: "c" })
      ]
    });
    expect(selectFilteredTasks({ todo: state })).toHaveLength(2);
  });

  it("selectTodosStats: returns total/active/completed", () => {
    const state = makeState({
      tasks: [
        makeTodo({ id: "a" }),
        makeTodo({ id: "b", completed: true }),
        makeTodo({ id: "c" })
      ]
    });
    expect(selectTodosStats({ todo: state })).toEqual({
      total: 3,
      active: 2,
      completed: 1
    });
  });
});
