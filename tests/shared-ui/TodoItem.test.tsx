import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TodoItem, type TodoItemProps } from "../../packages/shared-ui";
import { makeTodo } from "../helpers";

vi.mock("../../packages/shared-core", async () => ({
  useHighlight: vi.fn(),
  useItemStats: vi.fn(() => ({
    stats: {
      renders: 3,
      timing: {
        lastMs: 12.345,
        totalMs: 67.89
      }
    }
  }))
}));

function renderTodoItem(partial: Partial<TodoItemProps> = {}) {
  const props: TodoItemProps = {
    task: makeTodo(),
    readonly: false,
    statsVisible: false,
    scope: "main",
    onToggle: vi.fn(),
    onUpdate: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    ...partial
  };

  render(<TodoItem {...props} />);
  return props;
}

describe("TodoItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly in normal mode", () => {
    renderTodoItem();

    expect(screen.getByRole("checkbox")).toBeEnabled();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("renders correctly in the readonly mode", () => {
    renderTodoItem({ readonly: true });

    expect(screen.getByRole("checkbox")).toBeDisabled();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Edit" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete" })
    ).not.toBeInTheDocument();
  });

  it("renders task text when not editing", () => {
    renderTodoItem({ task: makeTodo({ text: "Hello", editing: false }) });

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: /edit task/i })
    ).not.toBeInTheDocument();
  });

  it("renders input when editing", () => {
    renderTodoItem({ task: makeTodo({ editing: true, text: "Draft" }) });

    const input = screen.getByRole("textbox", { name: /edit task/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Draft");
    expect(input).toHaveFocus();
    expect(
      screen.getByText(/\(Press Enter to accept, press Esc to cancel\)/i)
    ).toBeInTheDocument();
  });

  it("calls onToggle when checkbox is clicked", async () => {
    const user = userEvent.setup();
    const props = renderTodoItem({
      task: makeTodo({ id: "abc" })
    });

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(props.onToggle).toHaveBeenCalledTimes(1);
    expect(props.onToggle).toHaveBeenCalledWith("abc");
  });

  it("does not call onToggle when readonly", async () => {
    const user = userEvent.setup();
    const props = renderTodoItem({ readonly: true });

    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);
    expect(props.onToggle).not.toHaveBeenCalled();
  });

  it("hides Edit button when completed", async () => {
    renderTodoItem({ task: makeTodo({ completed: true }) });

    expect(
      screen.queryByRole("button", { name: /edit/i })
    ).not.toBeInTheDocument();
  });

  it("hides Edit button when editing", async () => {
    renderTodoItem({ task: makeTodo({ editing: true }) });

    expect(
      screen.queryByRole("button", { name: /edit/i })
    ).not.toBeInTheDocument();
  });

  it("clicking Edit button calls onEdit", async () => {
    const user = userEvent.setup();
    const props = renderTodoItem({
      task: makeTodo({ id: "x1", completed: false, editing: false })
    });

    await user.click(screen.getByRole("button", { name: /edit/i }));

    expect(props.onEdit).toHaveBeenCalledTimes(1);
    expect(props.onEdit).toHaveBeenCalledWith("x1", true);
  });

  it("clicking Delete calls onDelete", async () => {
    const user = userEvent.setup();
    const props = renderTodoItem({
      task: makeTodo({ id: "del-1" }),
      readonly: false
    });

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(props.onDelete).toHaveBeenCalledTimes(1);
    expect(props.onDelete).toHaveBeenCalledWith("del-1");
  });

  it("pressing Enter in edit input updates and exits edit (when non-empty)", async () => {
    const user = userEvent.setup();
    const props = renderTodoItem({
      task: makeTodo({ id: "e1", editing: true, text: "Old value" })
    });

    const input = screen.getByRole("textbox", { name: /edit task/i });
    await user.clear(input);
    await user.type(input, "New value{Enter}");

    expect(props.onUpdate).toHaveBeenCalledTimes(1);
    expect(props.onUpdate).toHaveBeenCalledWith("e1", "New value");
    expect(props.onEdit).toHaveBeenCalledWith("e1", false);
  });

  it("pressing Enter with empty/whitespace does not update", async () => {
    const user = userEvent.setup();
    const props = renderTodoItem({
      task: makeTodo({ id: "e2", editing: true, text: "Old" })
    });

    const input = screen.getByRole("textbox", { name: /edit task/i });
    await user.clear(input);
    await user.type(input, "   {Enter}");

    expect(props.onUpdate).not.toHaveBeenCalled();
    expect(props.onEdit).not.toHaveBeenCalled();
  });

  it("pressing Escape exits edit without updating", async () => {
    const user = userEvent.setup();
    const props = renderTodoItem({
      task: makeTodo({ id: "e3", editing: true, text: "Old" })
    });

    const input = screen.getByRole("textbox", { name: /edit task/i });
    await user.type(input, "{Escape}");

    expect(props.onUpdate).not.toHaveBeenCalled();
    expect(props.onEdit).toHaveBeenCalledTimes(1);
    expect(props.onEdit).toHaveBeenCalledWith("e3", false);
  });

  it("when statsVisible=true, shows badge with item stats", async () => {
    renderTodoItem({
      statsVisible: true
    });

    await waitFor(() => {
      expect(screen.getByText(/Render time:/i)).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });
});
