import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TodoStats, type TodoStatsProps } from "../../packages/shared-ui";

const defaultProps: TodoStatsProps = {
  active: 7,
  completed: 3,
  total: 10,
  scope: "main",
  stats: {
    listStats: {
      renders: 1,
      timing: {
        totalMs: 0,
        lastMs: 0
      }
    },
    itemsStats: {
      renders: 5,
      timing: {
        totalMs: 0,
        lastMs: 0
      }
    }
  }
};

describe("TodoStats", () => {
  it("renders correctly", () => {
    const { getAllByText, getByText } = render(<TodoStats {...defaultProps} />);

    expect(getByText(/total\s*=\s*10/i)).toBeInTheDocument();
    expect(getByText(/active\s*=\s*7/i)).toBeInTheDocument();
    expect(getByText(/done\s*=\s*3/i)).toBeInTheDocument();

    expect(getByText(/list\s*=\s*1/i)).toBeInTheDocument();
    expect(getByText(/items\s*=\s*5/i)).toBeInTheDocument();

    expect(getAllByText(/last\s*=\s*0.00\s*ms/i)).toHaveLength(2);
    expect(getAllByText(/total\s*=\s*0.00\s*ms/i)).toHaveLength(2);
  });
});
