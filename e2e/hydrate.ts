import type { Page } from "@playwright/test";

/** Deferred hydration keeps the LCP path free of client scripts. Keyboard and click handlers attach only after that. */
export async function waitForHydration(page: Page) {
  await page.waitForFunction(() => {
    const header = document.querySelector("header");
    if (!header) return false;
    return Array.from(header.querySelectorAll("a, button")).some((node) =>
      Object.keys(node).some((key) => key.startsWith("__reactProps")),
    );
  });
}
