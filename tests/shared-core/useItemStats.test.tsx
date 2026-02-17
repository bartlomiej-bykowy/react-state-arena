import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  ensureRecordInRegistry,
  registry,
  resetMetrics,
  setMeasuringEnabled,
  useItemStats
} from "../../packages/shared-core";

describe("useItemStats", () => {
  beforeEach(() => {
    resetMetrics();
    setMeasuringEnabled(true);
  });

  it("increments item and itemTotal renders correctly", () => {
    const { rerender } = renderHook(() => useItemStats("1", "main"));
    renderHook(() => useItemStats("2", "main"));
    rerender();

    expect(registry.items.get("main:1")?.renders).toBe(2);
    expect(registry.itemsTotal.get("main")?.renders).toBe(3);
  });

  it("unmounting removes entry from registry", () => {
    const { unmount } = renderHook(() => useItemStats("3", "main"));

    expect(registry.items.has("main:3")).toBe(true);

    unmount();
    expect(registry.items.has("main:3")).toBe(false);
  });

  it("updates item's and total's timings", () => {
    ensureRecordInRegistry("items", "main:4");

    const entry = registry.items.get("main:4");

    expect(entry?.timing.totalMs).toBe(0);
    expect(entry?.timing.lastMs).toBe(0);

    renderHook(() => useItemStats("4", "main"));
    expect(entry?.timing.totalMs).toBeGreaterThan(0);
    expect(entry?.timing.lastMs).toBeGreaterThan(0);
  });
});
