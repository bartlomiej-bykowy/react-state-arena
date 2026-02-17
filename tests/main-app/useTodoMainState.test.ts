import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { useTodoMainState } from "../../packages/main-app/src/hooks/useTodoMainState";
import { dispatchTodoAction } from "../../packages/main-app/src/utils/dispatchTodoAction";
import { generateUUID, TASKS_CAP } from "../../packages/shared-core";
import { makeListStatsHook, makeTodo } from "../helpers";

vi.mock("../../packages/shared-core", () => {
  return {
    generateUUID: vi.fn(() => "uuid-1"),
    TASKS_CAP: 50
  };
});

vi.mock("../../packages/main-app/src/utils/dispatchTodoAction", () => {
  return {
    dispatchTodoAction: vi.fn()
  };
});

describe("useTodoMainState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (generateUUID as Mock).mockReturnValue("uuid-1");
  });

  it("initializes state (filter, query, cap, stats)", () => {
    const initial = [
      makeTodo({ id: "a" }),
      makeTodo({ id: "b" }),
      makeTodo({ id: "c", completed: true })
    ];
    const listStatsHook = makeListStatsHook();

    const { result } = renderHook(() =>
      useTodoMainState(initial, listStatsHook)
    );

    expect(result.current.activeFilter).toBe("all");
    expect(result.current.capEnabled).toBe(false);
    expect(result.current.capNumber).toBe(TASKS_CAP);
    expect(result.current.filteredTasks).toHaveLength(3);
    expect(result.current.stats).toEqual({ total: 3, active: 2, completed: 1 });
  });

  it("add(): prepends a new task, calls startTiming and dispatch", () => {
    const initial = [makeTodo({ id: "old" })];
    const listStatsHook = makeListStatsHook();

    const { result } = renderHook(() =>
      useTodoMainState(initial, listStatsHook)
    );

    (generateUUID as Mock).mockReturnValue("new-id");

    act(() => {
      result.current.add("New task");
    });

    expect(listStatsHook.startTiming).toHaveBeenCalledTimes(1);
    expect(dispatchTodoAction).toHaveBeenCalledTimes(1);
    expect(result.current.filteredTasks[0]).toMatchObject({
      id: "new-id",
      text: "New task",
      completed: false,
      editing: false
    });
    expect(dispatchTodoAction).toHaveBeenCalledWith({
      type: "add",
      payload: {
        task: expect.objectContaining({ id: "new-id", text: "New task" })
      }
    });
  });

  it("remove(): removes by id and dispatches", () => {
    const initial = [makeTodo({ id: "a" }), makeTodo({ id: "b" })];
    const listStatsHook = makeListStatsHook();
    const { result } = renderHook(() =>
      useTodoMainState(initial, listStatsHook)
    );

    act(() => result.current.remove("a"));

    expect(listStatsHook.startTiming).toHaveBeenCalledTimes(1);
    expect(result.current.filteredTasks.map((t) => t.id)).toEqual(["b"]);
    expect(dispatchTodoAction).toHaveBeenCalledWith({
      type: "remove",
      payload: { id: "a" }
    });
  });

  it("edit(): toggles editing flag and dispatches", () => {
    const initial = [makeTodo({ id: "a" })];
    const listStatsHook = makeListStatsHook();
    const { result } = renderHook(() =>
      useTodoMainState(initial, listStatsHook)
    );

    act(() => result.current.edit("a", true));

    expect(listStatsHook.startTiming).toHaveBeenCalledTimes(1);
    expect(result.current.filteredTasks[0].editing).toBe(true);
    expect(dispatchTodoAction).toHaveBeenCalledWith({
      type: "edit",
      payload: { id: "a", editing: true }
    });
  });

  it("update(): updates text and dispatches", () => {
    const initial = [makeTodo({ id: "a", text: "Old" })];
    const listStatsHook = makeListStatsHook();
    const { result } = renderHook(() =>
      useTodoMainState(initial, listStatsHook)
    );

    act(() => result.current.update("a", "New"));

    expect(listStatsHook.startTiming).toHaveBeenCalledTimes(1);
    expect(result.current.filteredTasks[0].text).toBe("New");
    expect(dispatchTodoAction).toHaveBeenCalledWith({
      type: "update",
      payload: { id: "a", text: "New" }
    });
  });

  it("toggle(): toggles completed and affects stats", () => {
    const initial = [makeTodo({ id: "a" })];
    const listStatsHook = makeListStatsHook();
    const { result } = renderHook(() =>
      useTodoMainState(initial, listStatsHook)
    );

    act(() => result.current.toggle("a"));

    expect(listStatsHook.startTiming).toHaveBeenCalledTimes(1);
    expect(result.current.filteredTasks[0].completed).toBe(true);
    expect(result.current.stats).toEqual({ total: 1, active: 0, completed: 1 });

    expect(dispatchTodoAction).toHaveBeenCalledWith({
      type: "toggle",
      payload: { id: "a" }
    });
  });

  it("filter + search: filteredTasks respects activeFilter and query", () => {
    const initial = [
      makeTodo({ id: "a", text: "Buy milk" }),
      makeTodo({ id: "b", text: "Walk dog", completed: true }),
      makeTodo({ id: "c", text: "Milk chocolate", completed: true })
    ];
    const listStatsHook = makeListStatsHook();
    const { result } = renderHook(() =>
      useTodoMainState(initial, listStatsHook)
    );

    act(() => result.current.search("milk"));
    expect(dispatchTodoAction).toHaveBeenCalledWith({
      type: "filter",
      payload: { query: "milk", filter: "all" }
    });
    expect(result.current.filteredTasks.map((t) => t.id)).toEqual(["a", "c"]);

    act(() => result.current.changeFilter("completed"));

    expect(result.current.filteredTasks.map((t) => t.id)).toEqual(["c"]);
  });

  it("cap: when enabled, limits filteredTasks length; changing capNumber dispatches with current capEnabled", () => {
    const initial = Array.from({ length: 5 }, (_, i) =>
      makeTodo({ id: `t${i}`, text: `Task ${i}` })
    );
    const listStatsHook = makeListStatsHook();
    const { result } = renderHook(() =>
      useTodoMainState(initial, listStatsHook)
    );

    act(() => {
      result.current.chageCapNumber(2);
    });
    act(() => {
      result.current.changeCapEnabled(true);
    });

    expect(dispatchTodoAction).toHaveBeenCalledTimes(2);
    expect(dispatchTodoAction).toHaveBeenLastCalledWith({
      type: "cap",
      payload: { enable: true, capNumber: 2 }
    });
    expect(result.current.capNumber).toBe(2);
    expect(result.current.capEnabled).toBe(true);
    expect(result.current.filteredTasks).toHaveLength(2);
  });

  it("addMany/removeMany/toggleMany bulk actions update state + dispatch", () => {
    const initial = [
      makeTodo({ id: "a", completed: false }),
      makeTodo({ id: "b", completed: false }),
      makeTodo({ id: "c", completed: false })
    ];
    const listStatsHook = makeListStatsHook();
    const { result } = renderHook(() =>
      useTodoMainState(initial, listStatsHook)
    );
    const extra = [makeTodo({ id: "x" }), makeTodo({ id: "y" })];

    act(() => result.current.addMany(extra));

    expect(result.current.filteredTasks).toHaveLength(5);
    expect(dispatchTodoAction).toHaveBeenCalledWith({
      type: "addMany",
      payload: { tasks: extra }
    });

    act(() => result.current.removeMany(new Set(["a", "x"])));

    expect(result.current.filteredTasks).toHaveLength(3);
    expect(dispatchTodoAction).toHaveBeenCalledWith({
      type: "removeMany",
      payload: { ids: ["a", "x"] }
    });

    act(() => result.current.toggleMany(new Set(["b", "c"])));
    const byId = new Map(result.current.filteredTasks.map((t) => [t.id, t]));

    expect(byId.get("b")!.completed).toBe(true);
    expect(byId.get("c")!.completed).toBe(true);
    expect(dispatchTodoAction).toHaveBeenCalledWith({
      type: "toggleMany",
      payload: { ids: ["b", "c"] }
    });
  });

  it("reset(): restores initialState, clears filter/query, resets capNumber and dispatches", () => {
    const initial = [makeTodo({ id: "a", text: "A" })];
    const listStatsHook = makeListStatsHook();
    const { result } = renderHook(() =>
      useTodoMainState(initial, listStatsHook)
    );

    act(() => result.current.add("X"));
    act(() => result.current.search("milk"));
    act(() => result.current.changeFilter("completed"));
    act(() => result.current.chageCapNumber(2));
    act(() => result.current.reset());

    expect(result.current.filteredTasks).toEqual(initial);
    expect(result.current.activeFilter).toBe("all");
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.capNumber).toBe(TASKS_CAP);
    expect(dispatchTodoAction).toHaveBeenCalledWith({
      type: "reset",
      payload: { tasks: initial }
    });
  });

  it("removeCompleted(): removes completed tasks and dispatches", () => {
    const initial = [
      makeTodo({ id: "a", completed: false }),
      makeTodo({ id: "b", completed: true }),
      makeTodo({ id: "c", completed: true })
    ];
    const listStatsHook = makeListStatsHook();
    const { result } = renderHook(() =>
      useTodoMainState(initial, listStatsHook)
    );

    act(() => result.current.removeCompleted());

    expect(result.current.filteredTasks.map((t) => t.id)).toEqual(["a"]);
    expect(dispatchTodoAction).toHaveBeenCalledWith({
      type: "removeCompleted"
    });
  });

  it("changeStatsVisibility(): toggles itemStatsVisible and dispatches", () => {
    const initial = [makeTodo()];
    const listStatsHook = makeListStatsHook();
    const { result } = renderHook(() =>
      useTodoMainState(initial, listStatsHook)
    );

    act(() => result.current.changeStatsVisibility(true));

    expect(result.current.itemStatsVisible).toBe(true);
    expect(dispatchTodoAction).toHaveBeenCalledWith({
      type: "showStats",
      payload: { show: true }
    });
  });
});
