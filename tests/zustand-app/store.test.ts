// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";
import { useStore } from "../../apps/zustand-app/src/store/store";
import { TASKS_CAP } from "../../packages/shared-core";
import { makeTodo } from "../helpers";

vi.mock("../../packages/shared-core", () => {
  return {
    TASKS_CAP: 50,
    initialTasks: [
      { id: "a", text: "Buy milk", completed: false, editing: false },
      { id: "b", text: "Walk dog", completed: true, editing: false },
      { id: "c", text: "Write tests", completed: false, editing: true }
    ]
  };
});

beforeEach(() => {
  useStore.setState(useStore.getInitialState(), true);
  vi.clearAllMocks();
});

describe("Zustand app: store", () => {
  it("initial state is seeded from initialTasks and TASKS_CAP", () => {
    const s = useStore.getState();

    expect(s.tasks).toHaveLength(3);
    expect(s.activeFilter).toBe("all");
    expect(s.searchQuery).toBe("");
    expect(s.showStatsPerItem).toBe(false);
    expect(s.capEnabled).toBe(false);
    expect(s.capNumber).toBe(TASKS_CAP);
  });

  it("add: prepends new task", () => {
    useStore.getState().add({ task: makeTodo({ id: "new", text: "New" }) });
    const ids = useStore.getState().tasks.map((x) => x.id);

    expect(ids[0]).toBe("new");
  });

  it("edit: toggles editing for matching id", () => {
    useStore.getState().edit({ id: "a", editing: true });
    const tasks = new Map(useStore.getState().tasks.map((t) => [t.id, t]));

    expect(tasks.get("a")!.editing).toBe(true);
  });

  it("update: updates text for matching id", () => {
    useStore.getState().update({ id: "a", text: "Updated" });
    const tasks = new Map(useStore.getState().tasks.map((t) => [t.id, t]));

    expect(tasks.get("a")!.text).toBe("Updated");
  });

  it("toggle: flips completed for matching id", () => {
    const before = useStore
      .getState()
      .tasks.find((x) => x.id === "a")!.completed;
    useStore.getState().toggle({ id: "a" });

    expect(useStore.getState().tasks.find((x) => x.id === "a")!.completed).toBe(
      !before
    );
  });

  it("remove: removes task by id", () => {
    useStore.getState().remove({ id: "a" });
    expect(useStore.getState().tasks.some((x) => x.id === "a")).toBe(false);
  });

  it("filter: sets activeFilter and searchQuery", () => {
    useStore.getState().filter({ filter: "completed", query: "milk" });
    const s = useStore.getState();

    expect(s.activeFilter).toBe("completed");
    expect(s.searchQuery).toBe("milk");
  });

  it("addMany: prepends many tasks", () => {
    useStore
      .getState()
      .addMany({ tasks: [makeTodo({ id: "x" }), makeTodo({ id: "y" })] });

    expect(
      useStore
        .getState()
        .tasks.slice(0, 2)
        .map((x) => x.id)
    ).toEqual(["x", "y"]);
  });

  it("toggleMany: flips completed for multiple tasks", () => {
    useStore.getState().toggleMany({ ids: ["b", "c"] });
    const byId = new Map(
      useStore.getState().tasks.map((t) => [t.id, t.completed])
    );

    expect(byId.get("b")).toBe(false);
    expect(byId.get("c")).toBe(true);
  });

  it("removeMany: removes multiple tasks", () => {
    useStore.getState().removeMany({ ids: ["a", "b"] });

    expect(useStore.getState().tasks).toHaveLength(1);
    expect(useStore.getState().tasks.map((x) => x.id)).toEqual(
      expect.not.arrayContaining(["a", "b"])
    );
  });

  it("removeCompleted: removes only completed tasks", () => {
    useStore.getState().removeCompleted();

    expect(useStore.getState().tasks.every((x) => !x.completed)).toBe(true);
  });

  it("showStats: sets showStatsPerItem", () => {
    useStore.getState().showStats({ show: true });

    expect(useStore.getState().showStatsPerItem).toBe(true);
  });

  it("cap: updates capEnabled + capNumber", () => {
    useStore.getState().cap({ enable: true, capNumber: 10 });

    expect(useStore.getState().capEnabled).toBe(true);
    expect(useStore.getState().capNumber).toBe(10);
  });

  it("reset: restores store initial state", () => {
    useStore.getState().filter({ filter: "completed", query: "x" });
    useStore.getState().cap({ enable: true, capNumber: 2 });
    useStore.getState().add({ task: makeTodo({ id: "new" }) });

    useStore.getState().reset();

    const s = useStore.getState();

    expect(s.activeFilter).toBe("all");
    expect(s.searchQuery).toBe("");
    expect(s.capEnabled).toBe(false);
    expect(s.capNumber).toBe(TASKS_CAP);
    expect(s.tasks).toHaveLength(3);
    expect(s.tasks[0].id).toBe("a");
  });

  it("applyEvent: maps TodoAction to the corresponding store method", () => {
    const s = useStore.getState();
    const spyAdd = vi.spyOn(s, "add");
    const spyRemoveCompleted = vi.spyOn(s, "removeCompleted");
    const spyCap = vi.spyOn(s, "cap");

    s.applyEvent({ type: "add", payload: { task: makeTodo({ id: "evt" }) } });
    expect(spyAdd).toHaveBeenCalledWith({
      task: expect.objectContaining({ id: "evt" })
    });

    s.applyEvent({ type: "removeCompleted" });
    expect(spyRemoveCompleted).toHaveBeenCalled();

    s.applyEvent({
      type: "cap",
      payload: { enable: true, capNumber: 3 }
    });
    expect(spyCap).toHaveBeenCalledWith({ enable: true, capNumber: 3 });

    expect(useStore.getState().tasks[0].id).toBe("evt");
  });
});
