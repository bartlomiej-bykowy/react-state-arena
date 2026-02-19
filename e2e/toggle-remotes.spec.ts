import { expect, test } from "@playwright/test";
import {
  addTaskInMain,
  expectAppsToBeReady,
  expectTaskVisibleInAllRemotes
} from "./helpers";

test("unmount/remount remotes does not keep stale state", async ({ page }) => {
  await page.goto("/");
  await expectAppsToBeReady(page);

  const text = `e2e-unmount-${Date.now()}`;
  await addTaskInMain(page, text);

  // unmount remotes
  await page.getByTestId("toggle-context").click();
  await page.getByTestId("toggle-redux").click();
  await page.getByTestId("toggle-zustand").click();
  await expect(page.getByTestId("app-context")).not.toBeVisible();
  await expect(page.getByTestId("app-redux")).not.toBeVisible();
  await expect(page.getByTestId("app-zustand")).not.toBeVisible();

  const text2 = `${text}-2`;
  await addTaskInMain(page, text2);

  // remount remotes
  await page.getByTestId("toggle-context").click();
  await page.getByTestId("toggle-redux").click();
  await page.getByTestId("toggle-zustand").click();
  await expect(page.getByTestId("app-context")).toBeVisible();
  await expect(page.getByTestId("app-redux")).toBeVisible();
  await expect(page.getByTestId("app-zustand")).toBeVisible();

  // remotes should have latest state
  await expectTaskVisibleInAllRemotes(page, text2);
});
