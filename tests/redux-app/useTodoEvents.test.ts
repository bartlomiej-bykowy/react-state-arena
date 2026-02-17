import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTodoDispatch } from "../../apps/redux-app/src/hooks/useTodoDispatch";
import { useTodoEvents } from "../../apps/redux-app/src/hooks/useTodoEvents";
import { makeListStatsHook } from "../helpers";

vi.mock("../../apps/redux-app/src/hooks/useTodoDispatch", () => {
  return { useTodoDispatch: vi.fn() };
});

vi.mock("../../apps/redux-app/src/store/todoSlice", () => {
  const mk = (type: string) => (payload?: unknown) => ({ type, payload });

  return {
    add: mk("todo/add"),
    edit: mk("todo/edit"),
    update: mk("todo/update"),
    toggle: mk("todo/toggle"),
    remove: mk("todo/remove"),
    filter: mk("todo/filter"),
    addMany: mk("todo/addMany"),
    toggleMany: mk("todo/toggleMany"),
    removeMany: mk("todo/removeMany"),
    removeCompleted: mk("todo/removeCompleted"),
    reset: mk("todo/reset"),
    showStats: mk("todo/showStats"),
    setTasksCap: mk("todo/setTasksCap")
  };
});

describe("Redux app: useTodoEvents", () => {
  beforeEach(() => vi.clearAllMocks());

  it("maps 'add' event to add(payload) and dispatches, calling startTiming", () => {
    const dispatchMock = vi.fn();
    vi.mocked(useTodoDispatch).mockReturnValue(dispatchMock);

    const listStats = makeListStatsHook();
    renderHook(() => useTodoEvents(listStats));

    const payload = {
      task: { id: "1", text: "X", completed: false, editing: false }
    };

    window.dispatchEvent(
      new CustomEvent("rsa:todo-action", { detail: { type: "add", payload } })
    );

    expect(listStats.startTiming).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({ type: "todo/add", payload });
  });

  it("maps 'removeCompleted' to removeCompleted() (no payload)", () => {
    const dispatchMock = vi.fn();
    vi.mocked(useTodoDispatch).mockReturnValue(dispatchMock);

    const listStats = makeListStatsHook();
    renderHook(() => useTodoEvents(listStats));

    window.dispatchEvent(
      new CustomEvent("rsa:todo-action", {
        detail: { type: "removeCompleted" }
      })
    );

    expect(listStats.startTiming).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({ type: "todo/removeCompleted" });
  });

  it("maps 'cap' to setTasksCap(payload)", () => {
    const dispatchMock = vi.fn();
    vi.mocked(useTodoDispatch).mockReturnValue(dispatchMock);

    const listStats = makeListStatsHook();
    renderHook(() => useTodoEvents(listStats));

    const payload = { enable: true, capNumber: 10 };

    window.dispatchEvent(
      new CustomEvent("rsa:todo-action", { detail: { type: "cap", payload } })
    );

    expect(listStats.startTiming).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: "todo/setTasksCap",
      payload
    });
  });

  it("removes listener on unmount", () => {
    const dispatchMock = vi.fn();
    vi.mocked(useTodoDispatch).mockReturnValue(dispatchMock);

    const listStats = makeListStatsHook();
    const { unmount } = renderHook(() => useTodoEvents(listStats));

    unmount();

    window.dispatchEvent(
      new CustomEvent("rsa:todo-action", {
        detail: { type: "toggle", payload: { id: "1" } }
      })
    );

    expect(listStats.startTiming).not.toHaveBeenCalled();
    expect(dispatchMock).not.toHaveBeenCalled();
  });
});
