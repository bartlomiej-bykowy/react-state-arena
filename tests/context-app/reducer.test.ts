// @vitest-environment node

import { describe, expect, it } from "vitest";
import { reducer } from "../../apps/context-app/src/store/reducer";
import { TASKS_CAP, type TodoAction } from "../../packages/shared-core";
import { makeState, makeTodo } from "../helpers";

describe("Context app: reducer", () => {
  it("returns same state for unknown action", () => {
    const state = makeState();
    const next = reducer(state, {
      type: "__UNKNOWN__"
    } as unknown as TodoAction);
    expect(next).toBe(state);
  });

  it("add: prepends new task", () => {
    const state = makeState({ tasks: [makeTodo({ id: "a" })] });
    const newTask = makeTodo({ id: "x", text: "New" });

    const next = reducer(state, {
      type: "add",
      payload: { task: newTask }
    } as TodoAction);

    expect(next).not.toBe(state);
    expect(next.tasks[0]).toEqual(newTask);
    expect(next.tasks).toHaveLength(2);
    expect(state.tasks[0].id).toBe("a");
  });

  it("edit: toggles editing for matching id", () => {
    const state = makeState({
      tasks: [makeTodo({ id: "a", editing: false }), makeTodo({ id: "b" })]
    });

    const next = reducer(state, {
      type: "edit",
      payload: { id: "a", editing: true }
    } as TodoAction);

    expect(next.tasks.find((t) => t.id === "a")!.editing).toBe(true);
    expect(next.tasks.find((t) => t.id === "b")!.editing).toBe(false);
  });

  it("update: updates text for matching id", () => {
    const state = makeState({
      tasks: [makeTodo({ id: "a", text: "Old" }), makeTodo({ id: "b" })]
    });

    const next = reducer(state, {
      type: "update",
      payload: { id: "a", text: "New" }
    } as TodoAction);

    expect(next.tasks.find((t) => t.id === "a")!.text).toBe("New");
    expect(next.tasks.find((t) => t.id === "b")!.text).toBe("Buy milk");
  });

  it("toggle: flips completed for matching id", () => {
    const state = makeState({
      tasks: [
        makeTodo({ id: "a", completed: false }),
        makeTodo({ id: "b", completed: true })
      ]
    });

    const next = reducer(state, {
      type: "toggle",
      payload: { id: "a" }
    } as TodoAction);

    expect(next.tasks.find((t) => t.id === "a")!.completed).toBe(true);
    expect(next.tasks.find((t) => t.id === "b")!.completed).toBe(true);
  });

  it("remove: removes task by id", () => {
    const state = makeState({
      tasks: [makeTodo({ id: "a" }), makeTodo({ id: "b" })]
    });

    const next = reducer(state, {
      type: "remove",
      payload: { id: "a" }
    } as TodoAction);

    expect(next.tasks.map((t) => t.id)).toEqual(["b"]);
  });

  it("filter: sets activeFilter and searchQuery", () => {
    const state = makeState({ activeFilter: "all", searchQuery: "" });

    const next = reducer(state, {
      type: "filter",
      payload: { filter: "completed", query: "milk" }
    } as TodoAction);

    expect(next.activeFilter).toBe("completed");
    expect(next.searchQuery).toBe("milk");
  });

  it("addMany: prepends many tasks", () => {
    const state = makeState({ tasks: [makeTodo({ id: "a" })] });
    const many = [makeTodo({ id: "x" }), makeTodo({ id: "y" })];

    const next = reducer(state, {
      type: "addMany",
      payload: { tasks: many }
    } as TodoAction);

    expect(next.tasks.map((t) => t.id)).toEqual(["x", "y", "a"]);
  });

  it("toggleMany: flips completed for multiple tasks", () => {
    const state = makeState({
      tasks: [
        makeTodo({ id: "a", completed: false }),
        makeTodo({ id: "b", completed: false }),
        makeTodo({ id: "c", completed: true })
      ]
    });

    const next = reducer(state, {
      type: "toggleMany",
      payload: { ids: ["a", "c"] }
    } as TodoAction);

    const byId = new Map(next.tasks.map((t) => [t.id, t.completed]));
    expect(byId.get("a")).toBe(true);
    expect(byId.get("b")).toBe(false);
    expect(byId.get("c")).toBe(false);
  });

  it("removeMany: removes multiple tasks", () => {
    const state = makeState({
      tasks: [
        makeTodo({ id: "a" }),
        makeTodo({ id: "b" }),
        makeTodo({ id: "c" })
      ]
    });

    const next = reducer(state, {
      type: "removeMany",
      payload: { ids: ["a", "c"] }
    } as TodoAction);

    expect(next.tasks.map((t) => t.id)).toEqual(["b"]);
  });

  it("removeCompleted: removes only completed tasks", () => {
    const state = makeState({
      tasks: [
        makeTodo({ id: "a", completed: false }),
        makeTodo({ id: "b", completed: true }),
        makeTodo({ id: "c", completed: false })
      ]
    });

    const next = reducer(state, { type: "removeCompleted" } as TodoAction);

    expect(next.tasks.map((t) => t.id)).toEqual(["a", "c"]);
  });

  it("showStats: toggles showStatsPerItem", () => {
    const state = makeState({ showStatsPerItem: false });

    const next = reducer(state, {
      type: "showStats",
      payload: { show: true }
    } as TodoAction);

    expect(next.showStatsPerItem).toBe(true);
  });

  it("cap: updates capEnabled and capNumber", () => {
    const state = makeState({ capEnabled: false, capNumber: TASKS_CAP });

    const next = reducer(state, {
      type: "cap",
      payload: { enable: true, capNumber: 10 }
    } as TodoAction);

    expect(next.capEnabled).toBe(true);
    expect(next.capNumber).toBe(10);
  });

  it("reset: restores store initial state", () => {
    const state = makeState({
      tasks: [makeTodo({ id: "old" })],
      activeFilter: "completed",
      searchQuery: "x",
      showStatsPerItem: true,
      capEnabled: true,
      capNumber: 5
    });

    const newTasks = [makeTodo({ id: "n1" }), makeTodo({ id: "n2" })];

    const next = reducer(state, {
      type: "reset",
      payload: { tasks: newTasks }
    } as TodoAction);

    expect(next.tasks).toEqual(newTasks);
    expect(next.tasks).not.toBe(newTasks);
    expect(next.activeFilter).toBe("all");
    expect(next.searchQuery).toBe("");
    expect(next.capNumber).toBe(TASKS_CAP);
    expect(next.showStatsPerItem).toBe(true);
    expect(next.capEnabled).toBe(true);
  });
});
