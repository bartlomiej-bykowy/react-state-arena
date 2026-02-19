import { expect, test } from "@playwright/test";
import { expectAppsToBeReady } from "./helpers";

test("sync: addMany/toggleMany/removeCompleted propagates to remotes", async ({
  page
}) => {
  await page.goto("/");
  await expectAppsToBeReady(page);

  const main = page.getByTestId("app-main");

  // add many
  const tasksCountInput = main.getByTestId("number-of-tasks-input");
  await tasksCountInput.fill("25");

  await page.getByTestId("add-many-button").click();

  // there should be the same amount of tasks in every app (30)
  const mainCount = await main.getByTestId("todo-item").count();
  expect(mainCount).toBe(30);

  const ctx = page.getByTestId("app-context");
  const rdx = page.getByTestId("app-redux");
  const zust = page.getByTestId("app-zustand");

  await expect(ctx.getByTestId("todo-item")).toHaveCount(mainCount);
  await expect(rdx.getByTestId("todo-item")).toHaveCount(mainCount);
  await expect(zust.getByTestId("todo-item")).toHaveCount(mainCount);

  // toggle many
  await tasksCountInput.fill("10");
  await main.getByTestId("toggle-many-button").click();

  // remove completed
  await main.getByTestId("remove-completed-button").click();

  // now there should be 20 tasks in every app
  const mainCountAfter = await main.getByTestId("todo-item").count();
  expect(mainCountAfter).toBe(20);
  await expect(ctx.getByTestId("todo-item")).toHaveCount(mainCountAfter);
  await expect(rdx.getByTestId("todo-item")).toHaveCount(mainCountAfter);
  await expect(zust.getByTestId("todo-item")).toHaveCount(mainCountAfter);
});
