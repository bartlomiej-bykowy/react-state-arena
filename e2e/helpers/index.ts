import { expect, type Page } from "@playwright/test";

export async function addTaskInMain(page: Page, text: string) {
  const main = page.getByTestId("app-main");
  const input = main.getByTestId("todo-add-input");
  const submit = main.getByTestId("todo-add-submit");

  await input.fill(text);
  await submit.click();

  await expect(main.getByText(text)).toBeVisible();
}

export async function expectTaskVisibleInAllRemotes(
  page: Page,
  text: string,
  visible = true
) {
  const ctx = page.getByTestId("app-context");
  const rdx = page.getByTestId("app-redux");
  const zust = page.getByTestId("app-zustand");

  if (visible) {
    await expect(
      ctx.getByTestId("todo-item").filter({ hasText: text })
    ).toBeVisible();
    await expect(
      rdx.getByTestId("todo-item").filter({ hasText: text })
    ).toBeVisible();
    await expect(
      zust.getByTestId("todo-item").filter({ hasText: text })
    ).toBeVisible();
  } else {
    await expect(
      ctx.getByTestId("todo-item").filter({ hasText: text })
    ).not.toBeVisible();
    await expect(
      rdx.getByTestId("todo-item").filter({ hasText: text })
    ).not.toBeVisible();
    await expect(
      zust.getByTestId("todo-item").filter({ hasText: text })
    ).not.toBeVisible();
  }
}

export async function expectAppsToBeReady(page: Page) {
  await expect(page.getByTestId("app-host")).toBeVisible();
  await expect(page.getByTestId("app-main")).toBeVisible();
  await expect(page.getByTestId("app-context")).toBeVisible();
  await expect(page.getByTestId("app-redux")).toBeVisible();
  await expect(page.getByTestId("app-zustand")).toBeVisible();
}
