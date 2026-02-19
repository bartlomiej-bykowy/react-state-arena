import { expect, test } from "@playwright/test";
import { addTaskInMain, expectAppsToBeReady } from "./helpers";

test("stats: after enabling measurements, metrics update after an action", async ({
  page
}) => {
  await page.goto("/");
  await expectAppsToBeReady(page);
  const main = page.getByTestId("app-main");
  const stats = main.getByTestId("number-of-renders");
  const statsBefore = (await stats.innerText()).trim();

  // before enabling measurements stats don't change
  await addTaskInMain(page, "e2e-test-1");
  await expect
    .poll(async () => (await stats.innerText()).trim())
    .toBe(statsBefore);

  // stats should change after enabling mesurements
  await main.getByTestId("enable-measurements").click();
  await addTaskInMain(page, "e2e-test-2");
  await expect
    .poll(async () => (await stats.innerText()).trim())
    .not.toBe(statsBefore);

  // render times should change in all remotes
  await expect
    .poll(async () =>
      (await page.getByTestId("context-stats").innerText()).trim()
    )
    .not.toContain("0.00ms");
  await expect
    .poll(async () =>
      (await page.getByTestId("redux-stats").innerText()).trim()
    )
    .not.toContain("0.00ms");
  await expect
    .poll(async () =>
      (await page.getByTestId("zustand-stats").innerText()).trim()
    )
    .not.toContain("0.00ms");
});
