// @vitest-environment node

import { afterEach, describe, expect, it } from "vitest";
import {
  highlightRenders,
  measuringEnabled,
  setHighlightRenders,
  setMeasuringEnabled
} from "../../packages/shared-core";

describe("todoOptions", () => {
  afterEach(() => {
    setHighlightRenders(false);
    setMeasuringEnabled(false);
  });

  it("options should be set to false as default", () => {
    expect(highlightRenders).toBe(false);
    expect(measuringEnabled).toBe(false);
  });

  it("setHighlightRenders should set the highlightRenders value", () => {
    setHighlightRenders(true);
    expect(highlightRenders).toBe(true);

    setHighlightRenders(false);
    expect(highlightRenders).toBe(false);
  });

  it("setMeasuringEnabled should set the measuringEnabled value", () => {
    setMeasuringEnabled(true);
    expect(measuringEnabled).toBe(true);

    setMeasuringEnabled(false);
    expect(measuringEnabled).toBe(false);
  });
});
