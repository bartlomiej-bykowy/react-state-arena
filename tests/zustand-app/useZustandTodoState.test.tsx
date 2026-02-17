import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useZustandTodoState } from "../../apps/zustand-app/src/hooks/useZustandTodoState";
import { useStore } from "../../apps/zustand-app/src/store/store";

vi.mock("../../packages/shared-core", () => {
  return {
    initialTasks: [
      { id: "a", text: "Buy milk", completed: false, editing: false },
      { id: "b", text: "Walk dog", completed: true, editing: false },
      { id: "c", text: "Write tests", completed: false, editing: true }
    ],
    TASKS_CAP: 50
  };
});

beforeEach(() => {
  useStore.setState(useStore.getInitialState(), true);
});

describe("Zustand app: useZustandTodoState", () => {
  it("returns filteredTasks based on filter + query + cap", () => {
    const { result } = renderHook(() => useZustandTodoState());

    expect(result.current.filteredTasks).toHaveLength(3);

    act(() => {
      useStore.getState().filter({ filter: "all", query: "milk" });
    });
    expect(result.current.filteredTasks.map((t) => t.id)).toEqual(["a"]);

    act(() => {
      useStore.getState().filter({ filter: "completed", query: "milk" });
    });
    expect(result.current.filteredTasks).toHaveLength(0);

    act(() => {
      useStore.getState().filter({ filter: "completed", query: "" });
    });
    expect(result.current.filteredTasks.map((t) => t.id)).toEqual(["b"]);

    act(() => {
      useStore.getState().cap({ enable: true, capNumber: 1 });
      useStore.getState().filter({ filter: "all", query: "" });
    });
    expect(result.current.filteredTasks).toHaveLength(1);
  });

  it("returns stats derived from all tasks (not filteredTasks)", () => {
    const { result } = renderHook(() => useZustandTodoState());

    expect(result.current.stats).toEqual({ total: 3, active: 2, completed: 1 });

    act(() => {
      useStore.getState().toggle({ id: "a" });
    });
    expect(result.current.stats).toEqual({ total: 3, active: 1, completed: 2 });
  });

  it("exposes showStatsPerItem from store", () => {
    const { result } = renderHook(() => useZustandTodoState());

    expect(result.current.showStatsPerItem).toBe(false);

    act(() => {
      useStore.getState().showStats({ show: true });
    });
    expect(result.current.showStatsPerItem).toBe(true);
  });
});
