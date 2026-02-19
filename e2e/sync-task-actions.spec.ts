import { expect, test } from "@playwright/test";
import {
  addTaskInMain,
  expectAppsToBeReady,
  expectTaskVisibleInAllRemotes
} from "./helpers";

test.describe("sync: task actions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expectAppsToBeReady(page);
  });

  test("adding task in main propagates to remotes", async ({ page }) => {
    const text = `e2e-add-${Date.now()}`;
    await addTaskInMain(page, text);
    await expectTaskVisibleInAllRemotes(page, text);
  });

  test("toggle/edit/remove task propagate to remotes", async ({ page }) => {
    const text = `e2e-task-${Date.now()}`;
    await addTaskInMain(page, text);
    await expectTaskVisibleInAllRemotes(page, text);

    const main = page.getByTestId("app-main");
    const task = main.getByTestId("todo-item").filter({ hasText: text });

    // edit + update
    const updatedText = `${text}-edited`;
    await task.getByTestId("todo-edit").click();
    const editInput = main.getByTestId("todo-edit-input");
    await editInput.fill(updatedText);
    await editInput.press("Enter");

    await expect(
      main.getByTestId("todo-item").filter({ hasText: updatedText })
    ).toBeVisible();
    await expectTaskVisibleInAllRemotes(page, updatedText);

    // toggle
    const updatedTask = main
      .getByTestId("todo-item")
      .filter({ hasText: updatedText });

    await task.getByTestId("todo-toggle").click();
    await expect(task.getByTestId("todo-toggle")).toBeChecked();

    // remove
    updatedTask.getByTestId("todo-delete").click();

    await expect(
      main.getByTestId("todo-item").filter({ hasText: updatedText })
    ).not.toBeVisible();
    await expectTaskVisibleInAllRemotes(page, updatedText, false);
  });
});
