import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../../packages/shared-ui";

describe("Button", () => {
  it("renders correctly", async () => {
    const mockFn = vi.fn();
    const user = userEvent.setup();
    const { getByRole } = render(<Button onClick={mockFn}>test</Button>);
    const button = getByRole("button");

    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(mockFn).toHaveBeenCalled();
  });
});
