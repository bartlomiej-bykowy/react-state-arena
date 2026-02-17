// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
  add,
  addMany,
  edit,
  filter,
  remove,
  removeCompleted,
  removeMany,
  reset,
  setTasksCap,
  showStats,
  todoReducer,
  toggle,
  toggleMany,
  update
} from "../../apps/redux-app/src/store/todoSlice";
import { TASKS_CAP } from "../../packages/shared-core";
import { makeState, makeTodo } from "../helpers";

describe("Redux app: todoSlice", () => {
  it("add: prepends new task", () => {
    const state = makeState({ tasks: [makeTodo({ id: "old" })] });
    const newTask = makeTodo({ id: "new", text: "New" });
    const next = todoReducer(state, add({ task: newTask }));

    expect(next.tasks.map((x) => x.id)).toEqual(["new", "old"]);
    expect(next).not.toBe(state);
  });

  it("edit: toggles editing for matching id", () => {
    const state = makeState({
      tasks: [
        makeTodo({ id: "a", editing: false }),
        makeTodo({ id: "b", editing: false })
      ]
    });
    const next = todoReducer(state, edit({ id: "a", editing: true }));

    const tasks = new Map(next.tasks.map((t) => [t.id, t]));
    expect(tasks.get("a")?.editing).toBe(true);
    expect(tasks.get("b")?.editing).toBe(false);
  });

  it("update: updates text for matching id", () => {
    const state = makeState({
      tasks: [
        makeTodo({ id: "a", text: "Old" }),
        makeTodo({ id: "b", text: "Keep" })
      ]
    });

    const next = todoReducer(state, update({ id: "a", text: "New" }));
    const tasks = new Map(next.tasks.map((t) => [t.id, t]));

    expect(tasks.get("a")?.text).toBe("New");
    expect(tasks.get("b")?.text).toBe("Keep");
  });

  it("toggle: flips completed for matching id", () => {
    const state = makeState({
      tasks: [makeTodo({ id: "a", completed: false })]
    });
    const next = todoReducer(state, toggle({ id: "a" }));

    expect(next.tasks[0].completed).toBe(true);
  });

  it("remove: removes task by id", () => {
    const state = makeState({
      tasks: [
        makeTodo({ id: "a" }),
        makeTodo({ id: "b" }),
        makeTodo({ id: "c" })
      ]
    });
    const next = todoReducer(state, remove({ id: "b" }));

    expect(next.tasks.map((x) => x.id)).toEqual(["a", "c"]);
  });

  it("filter: sets activeFilter and searchQuery", () => {
    const state = makeState({ activeFilter: "all", searchQuery: "" });
    const next = todoReducer(
      state,
      filter({ filter: "completed", query: "milk" })
    );

    expect(next.activeFilter).toBe("completed");
    expect(next.searchQuery).toBe("milk");
  });

  it("addMany: prepends many tasks", () => {
    const state = makeState({ tasks: [makeTodo({ id: "old" })] });
    const many = [makeTodo({ id: "x" }), makeTodo({ id: "y" })];
    const next = todoReducer(state, addMany({ tasks: many }));

    expect(next.tasks.map((x) => x.id)).toEqual(["x", "y", "old"]);
  });

  it("toggleMany: flips completed for multiple tasks", () => {
    const state = makeState({
      tasks: [
        makeTodo({ id: "a", completed: false }),
        makeTodo({ id: "b", completed: false }),
        makeTodo({ id: "c", completed: true })
      ]
    });
    const next = todoReducer(state, toggleMany({ ids: ["a", "c"] }));
    const byId = new Map(next.tasks.map((x) => [x.id, x.completed]));

    expect(byId.get("a")).toBe(true);
    expect(byId.get("b")).toBe(false);
    expect(byId.get("c")).toBe(false);
  });

  it("removeMany: removes multiple tasks", () => {
    const state = makeState({
      tasks: [
        makeTodo({ id: "a" }),
        makeTodo({ id: "b" }),
        makeTodo({ id: "c" }),
        makeTodo({ id: "d" })
      ]
    });
    const next = todoReducer(state, removeMany({ ids: ["b", "d"] }));

    expect(next.tasks.map((x) => x.id)).toEqual(["a", "c"]);
  });

  it("removeCompleted: removes only completed tasks", () => {
    const state = makeState({
      tasks: [
        makeTodo({ id: "a", completed: false }),
        makeTodo({ id: "b", completed: true })
      ]
    });
    const next = todoReducer(state, removeCompleted());

    expect(next.tasks.map((x) => x.id)).toEqual(["a"]);
  });

  it("showStats: sets showStatsPerItem", () => {
    const state = makeState({ showStatsPerItem: false });
    const next = todoReducer(state, showStats({ show: true }));

    expect(next.showStatsPerItem).toBe(true);
  });

  it("setTasksCap: updates capEnabled + capNumber", () => {
    const state = makeState({ capEnabled: false, capNumber: 50 });
    const next = todoReducer(
      state,
      setTasksCap({ enable: true, capNumber: 10 })
    );

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
    const next = todoReducer(state, reset({ tasks: newTasks }));

    expect(next.tasks).toEqual(newTasks);
    expect(next.activeFilter).toBe("all");
    expect(next.searchQuery).toBe("");
    expect(next.capNumber).toBe(TASKS_CAP);
    expect(next.showStatsPerItem).toBe(true);
    expect(next.capEnabled).toBe(true);
  });
});
