import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  ensureRecordInRegistry,
  registry,
  resetMetrics,
  setMeasuringEnabled,
  useListStats
} from "../../packages/shared-core";

describe("useListStats", () => {
  beforeEach(() => {
    resetMetrics();
    setMeasuringEnabled(true);
  });

  it("increments list renders for scope correctly", () => {
    ensureRecordInRegistry("lists", "main");
    expect(registry.lists.get("main")?.renders).toBe(0);
    renderHook(() => useListStats("main"));

    expect(registry.lists.get("main")?.renders).toBe(1);
  });

  it("records timing", () => {
    const { result } = renderHook(() => useListStats("main"));

    act(() => {
      result.current.startTiming();
    });

    const entry = registry.lists.get("main");
    expect(entry?.timing.totalMs).toBeGreaterThan(0);
    expect(entry?.timing.lastMs).toBeGreaterThan(0);
  });

  it("does nothing when measuring is disabled", () => {
    setMeasuringEnabled(false);

    const { result } = renderHook(() => useListStats("main"));

    act(() => {
      result.current.startTiming();
    });

    const entry = registry.lists.get("main");
    expect(entry?.timing.totalMs).toBe(0);
    expect(entry?.timing.lastMs).toBe(0);
    expect(entry?.renders).toBe(0);
  });
});
