// @vitest-environment node

import { describe, expect, it } from "vitest";
import { createSignal } from "../../packages/shared-core";

describe("signal", () => {
  it("run subscribers correctly", () => {
    const s = createSignal();
    const seen: number[] = [];

    s.subscribe("main", () => seen.push(seen.length + 1));
    s.runSubscribers("main");
    s.runSubscribers("main");
    s.runSubscribers("main");

    expect(seen).toHaveLength(3);
    expect(seen).toEqual([1, 2, 3]);
  });
});
