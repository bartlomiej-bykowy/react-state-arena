import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TodoListEmptyState } from "../../packages/shared-ui";

describe("TodoListEmptyState", () => {
  it("renders correctly", async () => {
    const { getByText } = render(<TodoListEmptyState />);

    expect(getByText(/The list is empty/i)).toBeInTheDocument();
  });
});
