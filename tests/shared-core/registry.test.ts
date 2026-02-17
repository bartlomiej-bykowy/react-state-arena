// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
  ensureRecordInRegistry,
  registry,
  resetMetrics
} from "../../packages/shared-core";

describe("registry", () => {
  it("ensureRecordInRegistry creates new record if it doesn't exist", () => {
    const record = registry.items.get("item-1");
    expect(record).toBeUndefined();

    ensureRecordInRegistry("items", "item-1");
    const newRecord = registry.items.get("item-1");
    expect(newRecord).toHaveProperty("renders");
  });

  it("keeps scopes isolated", () => {
    const main = ensureRecordInRegistry("lists", "main");
    const ctx = ensureRecordInRegistry("lists", "context");

    main.renders = 1;
    ctx.renders = 2;

    expect(ensureRecordInRegistry("lists", "main").renders).toBe(1);
    expect(ensureRecordInRegistry("lists", "context").renders).toBe(2);
  });

  it("resetMetrics clears renders and timings but keep entries", () => {
    const item = ensureRecordInRegistry("items", "main:abc");
    item.renders = 2;
    item.timing.lastMs = 12.34;
    item.timing.totalMs = 56.78;

    resetMetrics();

    const itemAfterReset = ensureRecordInRegistry("items", "main:abc");
    expect(itemAfterReset.renders).toBe(0);
    expect(itemAfterReset.timing.lastMs).toBe(0);
    expect(itemAfterReset.timing.totalMs).toBe(0);
  });
});
