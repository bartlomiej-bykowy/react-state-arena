import { test } from "@playwright/test";
import { expectAppsToBeReady } from "./helpers";

test("smoke: host loads all apps", async ({ page }) => {
  await page.goto("/");

  await expectAppsToBeReady(page);
});
